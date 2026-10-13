'use client'

import { ArrowLeft } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { ButtonLink } from '@/components/common/Button'
import { useBreadcrumbLabel } from '@/components/layout/Breadcrumbs'
import { useNumericParam } from '@/hooks/useNumericParam'
import { ChangeRequestDetail } from '@/features/change-requests/components/ChangeRequestDetail'
import { useChangeRequest } from '@/features/change-requests/hooks/useChangeRequests'

/** Trang chi tiết CR — đích của thông báo in-app về duyệt CR. */
export default function ChangeRequestDetailPage() {
  const projectId = useNumericParam()
  const crId = useNumericParam('crId')
  const t = useTranslations('approvals')
  // Dùng chung cache với ChangeRequestDetail (cùng query key) để lấy tiêu đề cho breadcrumb.
  const cr = useChangeRequest(crId)
  useBreadcrumbLabel(`/projects/${projectId}/change-requests/${crId}`, cr.data?.title)

  return (
    <div className="space-y-6">
      <ButtonLink href={`/projects/${projectId}/change-requests`} variant="ghost" size="sm" className="-ml-3">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        {t('backToList')}
      </ButtonLink>
      <ChangeRequestDetail changeRequestId={crId} />
    </div>
  )
}
