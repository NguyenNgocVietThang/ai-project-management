'use client'

import { Alert } from '@/components/common/Alert'
import { Button } from '@/components/common/Button'
import { Modal } from '@/components/common/Modal'
import type { AdminUser } from '@/types/admin.types'

export function DeactivateUserDialog({
  user,
  onClose,
  onConfirm,
  isLoading,
  error,
}: {
  user: AdminUser | null
  onClose: () => void
  onConfirm: () => Promise<void>
  isLoading: boolean
  error?: string | null
}) {
  return (
    <Modal
      open={Boolean(user)}
      onClose={onClose}
      title="Deactivate user"
      description="They immediately lose the ability to sign in. You can reactivate them later."
      className="max-w-lg"
    >
      {error && <Alert className="mb-4">{error}</Alert>}
      <p className="text-sm text-muted-foreground">
        Deactivate <strong className="text-foreground">{user?.full_name}</strong> ({user?.email})?
      </p>
      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" className="sm:w-auto" onClick={onClose}>
          Cancel
        </Button>
        <Button type="button" variant="destructive" className="sm:w-auto" isLoading={isLoading} onClick={onConfirm}>
          Deactivate user
        </Button>
      </div>
    </Modal>
  )
}
