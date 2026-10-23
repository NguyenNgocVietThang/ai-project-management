'use client'

import { useTranslations } from 'next-intl'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import { LoadingState } from '@/components/common/PageState'
import { PageHeader } from '@/components/ui/PageHeader'
import { AvatarSection } from '@/features/profile/components/AvatarSection'
import { DangerZoneSection } from '@/features/profile/components/DangerZoneSection'
import { LinkedAccountsSection } from '@/features/profile/components/LinkedAccountsSection'
import { PasswordSection } from '@/features/profile/components/PasswordSection'
import { ProfileDetailsForm } from '@/features/profile/components/ProfileDetailsForm'
import type {
  DeleteAccountFormValues,
  PasswordFormValues,
  ProfileFormValues,
} from '@/features/profile/profile.validation'
import { useAuth } from '@/hooks/useAuth'
import { authService } from '@/services/auth.service'
import { userService } from '@/services/user.service'
import { useAuthStore } from '@/store/authStore'
import { useApiErrorMessage } from '@/i18n/useApiErrorMessage'
import type { OAuthProvider, User } from '@/types/auth.types'

function ProfilePageContent() {
  const getApiErrorMessage = useApiErrorMessage()
  const tAccount = useTranslations('accountUi')
  const searchParams = useSearchParams()
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const setUser = useAuthStore((state) => state.setUser)
  const clear = useAuthStore((state) => state.clear)
  const [pendingProvider, setPendingProvider] = useState<OAuthProvider | null>(null)
  const [socialError, setSocialError] = useState<unknown>(searchParams.get('error'))
  const linkedProvider = searchParams.get('linked')

  useEffect(() => {
    if (linkedProvider !== 'google') return
    authService
      .me()
      .then((updated) => {
        setUser(updated)
        queryClient.setQueryData(['auth', 'me'], updated)
      })
      .catch((error) => setSocialError(error))
  }, [linkedProvider, queryClient, setUser])

  const syncUser = (updated: User) => {
    setUser(updated)
    queryClient.setQueryData(['auth', 'me'], updated)
  }

  const profileMutation = useMutation({
    mutationFn: userService.updateProfile,
    onSuccess: syncUser,
  })
  const avatarMutation = useMutation({
    mutationFn: userService.uploadAvatar,
    onSuccess: syncUser,
  })
  const passwordMutation = useMutation({
    mutationFn: userService.changePassword,
    onSuccess: () => {
      clear()
      queryClient.clear()
      window.location.href = '/login?password=changed'
    },
  })
  const disconnectMutation = useMutation({
    mutationFn: userService.disconnectSocial,
    onSuccess: (updated) => {
      syncUser(updated)
      setSocialError(null)
      setPendingProvider(null)
    },
    onError: () => setPendingProvider(null),
  })
  const deleteMutation = useMutation({
    mutationFn: userService.deactivateAccount,
    onSuccess: () => {
      clear()
      queryClient.clear()
      window.location.href = '/login?account=deactivated'
    },
  })

  if (!user) return <LoadingState variant="page" label={tAccount('loadingProfile')} />

  const updateProfile = async (values: ProfileFormValues) => {
    await profileMutation.mutateAsync({
      ...values,
      phone: values.phone || null,
      position: values.position || null,
      department: values.department || null,
    })
  }

  const changePassword = async (values: PasswordFormValues) => {
    await passwordMutation.mutateAsync({
      current_password: user.has_password ? values.current_password : undefined,
      new_password: values.new_password,
    })
  }

  const connect = async (provider: OAuthProvider) => {
    setPendingProvider(provider)
    setSocialError(null)
    try {
      const result = await userService.connectSocial(provider)
      window.location.href = result.authorization_url
    } catch (error) {
      setSocialError(getApiErrorMessage(error))
      setPendingProvider(null)
    }
  }

  const disconnect = async (provider: OAuthProvider) => {
    setPendingProvider(provider)
    try {
      await disconnectMutation.mutateAsync(provider)
    } catch {
      // Lỗi mutation được hiển thị bên dưới.
    }
  }

  const deactivate = async (values: DeleteAccountFormValues) => {
    await deleteMutation.mutateAsync(values)
  }

  const linkedSuccess = linkedProvider === 'google' ? tAccount('googleAccountConnected') : null

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-10">
      <PageHeader
        eyebrow={tAccount('account')}
        title={tAccount('profileSettings')}
        description={tAccount('manageYourPersonalDetailsAndSignInOptions')}
        meta={
          <Link
            href="/dashboard"
            className="inline-flex min-h-9 items-center gap-2 rounded-lg text-body-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
             {tAccount('backToDashboard')} </Link>
        }
      />

      {/* Hai cột trên desktop: biểu mẫu chính bên trái, ảnh đại diện + tài khoản liên kết bên phải.
          Trên mobile cột phụ (ảnh đại diện) hiển thị trước. */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <aside className="space-y-6 lg:sticky lg:top-24 lg:order-last lg:self-start">
          <AvatarSection
            user={user}
            onUpload={(file) => avatarMutation.mutateAsync(file).then(() => undefined)}
            isLoading={avatarMutation.isPending}
            error={avatarMutation.error ? getApiErrorMessage(avatarMutation.error) : null}
            success={avatarMutation.isSuccess}
          />
          <LinkedAccountsSection
            user={user}
            onConnect={connect}
            onDisconnect={disconnect}
            pendingProvider={pendingProvider}
            error={socialError ? getApiErrorMessage(socialError) : (disconnectMutation.error ? getApiErrorMessage(disconnectMutation.error) : null)}
            successMessage={linkedSuccess}
          />
        </aside>
        <div className="min-w-0 space-y-6">
          <ProfileDetailsForm
            user={user}
            onSubmit={updateProfile}
            isLoading={profileMutation.isPending}
            error={profileMutation.error ? getApiErrorMessage(profileMutation.error) : null}
            success={profileMutation.isSuccess}
          />
          <PasswordSection
            hasPassword={user.has_password}
            onSubmit={changePassword}
            isLoading={passwordMutation.isPending}
            error={passwordMutation.error ? getApiErrorMessage(passwordMutation.error) : null}
          />
          <DangerZoneSection
            username={user.username}
            onDelete={deactivate}
            isLoading={deleteMutation.isPending}
            error={deleteMutation.error ? getApiErrorMessage(deleteMutation.error) : null}
          />
        </div>
      </div>
    </div>
  )
}

export default function ProfilePage() {
  const tAccount = useTranslations('accountUi')
  return (
    <Suspense fallback={<LoadingState variant="page" label={tAccount('loadingProfile')} />}>
      <ProfilePageContent />
    </Suspense>
  )
}
