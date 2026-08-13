'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import { FullPageSpinner } from '@/components/common/FullPageSpinner'
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
import { getApiErrorMessage } from '@/types/api.types'
import type { OAuthProvider, User } from '@/types/auth.types'

function ProfilePageContent() {
  const searchParams = useSearchParams()
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const setUser = useAuthStore((state) => state.setUser)
  const clear = useAuthStore((state) => state.clear)
  const [pendingProvider, setPendingProvider] = useState<OAuthProvider | null>(null)
  const [socialError, setSocialError] = useState<string | null>(searchParams.get('error'))
  const linkedProvider = searchParams.get('linked')

  useEffect(() => {
    if (linkedProvider !== 'google' && linkedProvider !== 'facebook') return
    authService
      .me()
      .then((updated) => {
        setUser(updated)
        queryClient.setQueryData(['auth', 'me'], updated)
      })
      .catch((error) => setSocialError(getApiErrorMessage(error)))
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

  if (!user) return <FullPageSpinner />

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
      // Mutation error is rendered below.
    }
  }

  const deactivate = async (values: DeleteAccountFormValues) => {
    await deleteMutation.mutateAsync(values)
  }

  const linkedSuccess =
    linkedProvider === 'google' || linkedProvider === 'facebook'
      ? `${linkedProvider === 'google' ? 'Google' : 'Facebook'} account connected.`
      : null

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-10">
      <div>
        <Link href="/dashboard" className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to dashboard
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Profile settings</h1>
        <p className="mt-2 text-sm text-muted-foreground">Manage your personal details and sign-in options.</p>
      </div>

      <AvatarSection
        user={user}
        onUpload={(file) => avatarMutation.mutateAsync(file).then(() => undefined)}
        isLoading={avatarMutation.isPending}
        error={avatarMutation.error ? getApiErrorMessage(avatarMutation.error) : null}
        success={avatarMutation.isSuccess}
      />
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
      <LinkedAccountsSection
        user={user}
        onConnect={connect}
        onDisconnect={disconnect}
        pendingProvider={pendingProvider}
        error={socialError ?? (disconnectMutation.error ? getApiErrorMessage(disconnectMutation.error) : null)}
        successMessage={linkedSuccess}
      />
      <DangerZoneSection
        username={user.username}
        onDelete={deactivate}
        isLoading={deleteMutation.isPending}
        error={deleteMutation.error ? getApiErrorMessage(deleteMutation.error) : null}
      />
    </div>
  )
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<FullPageSpinner />}>
      <ProfilePageContent />
    </Suspense>
  )
}
