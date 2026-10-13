'use client'

import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Modal } from '@/components/common/Modal'
import { RequirementClarifier } from '@/features/ai/components/RequirementClarifier'

// Modal sinh dự án bằng AI: giữ cách mở cũ, nội dung là luồng hỏi làm rõ.
export function AIGeneratorModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter()
  const t = useTranslations('clarifier')

  return (
    <Modal open={open} onClose={onClose} title={t('title')} description={t('description')}>
      <RequirementClarifier
        onViewProject={(projectId) => {
          router.push(`/projects/${projectId}/overview`)
          onClose()
        }}
      />
    </Modal>
  )
}
