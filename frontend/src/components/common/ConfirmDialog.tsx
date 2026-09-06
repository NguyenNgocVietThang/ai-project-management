'use client'

import { Button } from '@/components/common/Button'
import { Modal } from '@/components/common/Modal'

interface ConfirmDialogProps {
  open: boolean
  title: string
  description: string
  confirmLabel?: string
  isLoading?: boolean
  destructive?: boolean
  onConfirm: () => void
  onClose: () => void
}

/**
 * Hộp thoại xác nhận dùng chung.
 *
 * Thay cho `window.confirm()`, thứ vốn nằm rải rác cùng với các Modal xác nhận
 * được thiết kế đàng hoàng ở nơi khác trong cùng ứng dụng. Hộp thoại gốc của
 * trình duyệt không style được, không khớp với phần còn lại của giao diện, chặn
 * luồng thực thi, và bị một số trình duyệt chặn hẳn trong iframe.
 */
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  isLoading = false,
  destructive = true,
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onClose} title={title} description={description} className="max-w-md">
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" className="w-auto" onClick={onClose}>
          Cancel
        </Button>
        <Button
          type="button"
          variant={destructive ? 'destructive' : 'default'}
          className="w-auto"
          isLoading={isLoading}
          onClick={onConfirm}
        >
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  )
}
