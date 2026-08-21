'use client'

import { Alert } from '@/components/common/Alert'
import { Button } from '@/components/common/Button'
import { Modal } from '@/components/common/Modal'
import type { Role } from '@/types/admin.types'

export function DeleteRoleDialog({
  role,
  onClose,
  onConfirm,
  isLoading,
  error,
}: {
  role: Role | null
  onClose: () => void
  onConfirm: () => Promise<void>
  isLoading: boolean
  error?: string | null
}) {
  return (
    <Modal open={Boolean(role)} onClose={onClose} title="Delete role" className="max-w-lg">
      {error && <Alert className="mb-4">{error}</Alert>}
      <p className="text-sm text-muted-foreground">
        Delete <strong className="text-foreground">{role?.name}</strong>? This cannot be undone.
      </p>
      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" className="sm:w-auto" onClick={onClose}>
          Cancel
        </Button>
        <Button type="button" variant="destructive" className="sm:w-auto" isLoading={isLoading} onClick={onConfirm}>
          Delete role
        </Button>
      </div>
    </Modal>
  )
}
