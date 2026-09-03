import { Spinner } from '@/components/common/Spinner'

/** Hiển thị trong khi auth store đang khôi phục từ localStorage, để tránh nháy redirect. */
export function FullPageSpinner() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Spinner className="h-6 w-6 text-muted-foreground" />
    </div>
  )
}
