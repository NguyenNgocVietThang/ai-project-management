import { Spinner } from '@/components/common/Spinner'

/** Shown while the auth store is rehydrating from localStorage, to avoid a redirect flash. */
export function FullPageSpinner() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Spinner className="h-6 w-6 text-muted-foreground" />
    </div>
  )
}
