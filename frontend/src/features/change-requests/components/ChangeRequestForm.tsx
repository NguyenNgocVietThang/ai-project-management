'use client'

import { useId, useState } from 'react'
import { Alert } from '@/components/common/Alert'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { Label } from '@/components/common/Label'
import { Modal } from '@/components/common/Modal'
import { useCreateChangeRequest } from '@/features/change-requests/hooks/useChangeRequests'
import type { ChangeRequest } from '@/types/change-request.types'
import { getApiErrorMessage } from '@/types/api.types'

const TEXTAREA_CLASSES =
  'w-full rounded-md border bg-background px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'

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
  const titleId = useId()
  const descriptionId = useId()
  const reasonId = useId()
  const impactId = useId()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [reason, setReason] = useState('')
  const [impactDescription, setImpactDescription] = useState('')
  const createMutation = useCreateChangeRequest()

  const reset = () => {
    setTitle('')
    setDescription('')
    setReason('')
    setImpactDescription('')
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
      title="New change request"
      description="Describe the proposed change — you can run an AI impact analysis on it afterwards."
    >
      <form onSubmit={submit} className="space-y-4">
        {createMutation.isError && <Alert>{getApiErrorMessage(createMutation.error)}</Alert>}

        <div>
          <Label htmlFor={titleId}>Title</Label>
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
          <Label htmlFor={descriptionId}>Description</Label>
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
          <Label htmlFor={reasonId}>Reason (optional)</Label>
          <textarea
            id={reasonId}
            rows={2}
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            className={TEXTAREA_CLASSES}
          />
        </div>

        <div>
          <Label htmlFor={impactId}>Impact description (optional)</Label>
          <textarea
            id={impactId}
            rows={2}
            value={impactDescription}
            onChange={(event) => setImpactDescription(event.target.value)}
            className={TEXTAREA_CLASSES}
          />
        </div>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" className="sm:w-auto" onClick={close}>
            Cancel
          </Button>
          <Button type="submit" className="sm:w-auto" isLoading={createMutation.isPending}>
            Create
          </Button>
        </div>
      </form>
    </Modal>
  )
}
