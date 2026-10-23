'use client'

import { useTranslations } from 'next-intl'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { ResetPasswordForm } from '@/features/auth/components/ResetPasswordForm'
import { Skeleton, SkeletonRegion } from '@/components/ui/Skeleton'

function ResetPasswordContent() {
  const tAccount = useTranslations('accountUi')
  const searchParams = useSearchParams()

  return (
    <div>
      <div className="mb-8 space-y-2">
        <h1 className="text-h2 text-foreground">
           {tAccount('chooseANewPassword')} </h1>
        <p className="text-body-sm text-muted-foreground">
           {tAccount('useAtLeast12CharactersAndIncludeANumberOrSpecialCharacter')} </p>
      </div>
      <ResetPasswordForm token={searchParams.get('token')} />
    </div>
  )
}

export default function ResetPasswordPage() {
  const tAccount = useTranslations('accountUi')
  return (
    <Suspense
      fallback={
        // Khung xương giữ chỗ cho tiêu đề và form trong lúc đọc tham số URL.
        <SkeletonRegion label={tAccount('loadingResetLink')} className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-4 w-full" />
          </div>
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-12 w-full" />
        </SkeletonRegion>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  )
}
