'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useNumericParam } from '@/hooks/useNumericParam'
import { ChangeRequestDetail } from '@/features/change-requests/components/ChangeRequestDetail'

/** Trang chi tiết CR tối giản — đích của thông báo in-app về duyệt CR. */
export default function ChangeRequestDetailPage() {
  const projectId = useNumericParam()
  const crId = useNumericParam('crId')
  const t = useTranslations('approvals')

  return (
    <div className="space-y-4">
      <Link href={`/projects/${projectId}/change-requests`} className="text-sm text-primary underline-offset-4 hover:underline">
        {t('backToList')}
      </Link>
      <ChangeRequestDetail changeRequestId={crId} />
    </div>
  )
}
