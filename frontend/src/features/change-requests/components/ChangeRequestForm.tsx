'use client'
import { useTranslations } from 'next-intl'

import { useId, useState } from 'react'
import { Alert } from '@/components/common/Alert'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { Label } from '@/components/common/Label'
import { Modal } from '@/components/common/Modal'
import { Select } from '@/components/ui/Select'
import { useCreateChangeRequest } from '@/features/change-requests/hooks/useChangeRequests'
import { IMPACT_LEVELS, type ChangeRequest, type ImpactLevel } from '@/types/change-request.types'
import { useApiErrorMessage } from '@/i18n/useApiErrorMessage'

// Ô nhập nhiều dòng cùng kiểu với Input (bo 8px, viền input, focus ring).
const TEXTAREA_CLASSES =
  'w-full rounded-lg border border-input bg-card px-3 py-2 text-body sm:text-body-sm shadow-xs transition-[border-color,box-shadow] duration-150 placeholder:text-muted-foreground hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'

export function ChangeRequestForm({
  projectId,
  open,
  onClose,
  onCreated,
}: {
  projectId: number
  open: boolean
  onClose: () => void
  onCreated: (item: ChangeRequest) => void
}) {
  const getApiErrorMessage = useApiErrorMessage()
  const tw = useTranslations('workflowUi')
  const ti = useTranslations('impactControl')
  const titleId = useId()
  const descriptionId = useId()
  const reasonId = useId()
  const impactId = useId()
  const levelId = useId()
  const levelHintId = useId()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [reason, setReason] = useState('')
  const [impactDescription, setImpactDescription] = useState('')
  // Mức tác động người tạo đề xuất; PM chốt sau (PM tạo thì tự chốt luôn).
  const [impactLevel, setImpactLevel] = useState<ImpactLevel>('MODERATE')
  const createMutation = useCreateChangeRequest()

  const reset = () => {
    setTitle('')
    setDescription('')
    setReason('')
    setImpactDescription('')
    setImpactLevel('MODERATE')
    createMutation.reset()
  }

  const close = () => {
    reset()
    onClose()
  }

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    try {
      const created = await createMutation.mutateAsync({
        projectId,
        body: {
          title: title.trim(),
          description: description.trim(),
          reason: reason.trim() || undefined,
          impact_description: impactDescription.trim() || undefined,
          impact_level: impactLevel,
        },
      })
      reset()
      onCreated(created)
    } catch {
      // Trạng thái lỗi của mutation được render ở dưới.
    }
  }

  return (
    <Modal
      open={open}
      onClose={close}
      title={tw('newChangeRequest')}
      description={tw('changeRequestFormDescription')}
    >
      <form onSubmit={submit} className="space-y-4">
        {createMutation.isError && <Alert>{getApiErrorMessage(createMutation.error)}</Alert>}

        <div>
          <Label htmlFor={titleId}>{tw('title')}</Label>
          <Input
            id={titleId}
            required
            minLength={3}
            maxLength={255}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </div>

        <div>
          <Label htmlFor={descriptionId}>{tw('description')}</Label>
          <textarea
            id={descriptionId}
            rows={4}
            required
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className={TEXTAREA_CLASSES}
          />
        </div>

        <div>
          <Label htmlFor={reasonId}>{tw('reasonOptional')}</Label>
          <textarea
            id={reasonId}
            rows={2}
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            className={TEXTAREA_CLASSES}
          />
        </div>

        <div>
          <Label htmlFor={impactId}>{tw('impactOptional')}</Label>
          <textarea
            id={impactId}
            rows={2}
            value={impactDescription}
            onChange={(event) => setImpactDescription(event.target.value)}
            className={TEXTAREA_CLASSES}
          />
        </div>

        <div>
          <Label htmlFor={levelId}>{ti('proposedLabel')}</Label>
          <Select
            id={levelId}
            value={impactLevel}
            aria-describedby={levelHintId}
            onChange={(event) => setImpactLevel(event.target.value as ImpactLevel)}
          >
            {IMPACT_LEVELS.map((level) => (
              <option key={level} value={level}>{ti(`level.${level}`)}</option>
            ))}
          </Select>
          <p id={levelHintId} className="mt-1 text-caption text-muted-foreground">
            {ti(`levelHint.${impactLevel}`)} {ti('proposedHint')}
          </p>
        </div>

        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" fullWidth={false} className="w-full sm:w-auto" onClick={close}>
            {tw('cancel')}
          </Button>
          <Button type="submit" fullWidth={false} className="w-full sm:w-auto" isLoading={createMutation.isPending}>
            {tw('create')}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
