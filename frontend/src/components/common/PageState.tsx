import { AlertCircle, FolderOpen } from 'lucide-react'
import { Spinner } from '@/components/common/Spinner'

export function LoadingState({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="flex min-h-48 items-center justify-center gap-3 text-sm text-muted-foreground">
      <Spinner className="h-5 w-5" />
      {label}
    </div>
  )
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div role="alert" className="flex min-h-48 flex-col items-center justify-center gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center">
      <AlertCircle className="h-7 w-7 text-destructive" />
      <p className="max-w-lg text-sm text-destructive">{message}</p>
    </div>
  )
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center rounded-xl border border-dashed p-8 text-center">
      <FolderOpen className="h-8 w-8 text-muted-foreground" />
      <h3 className="mt-3 font-medium">{title}</h3>
      <p className="mt-1 max-w-md text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
