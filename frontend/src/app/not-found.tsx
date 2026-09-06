import Link from 'next/link'
import { FileQuestion } from 'lucide-react'

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
      <FileQuestion className="h-10 w-10 text-muted-foreground" aria-hidden="true" />
      <div>
        <h1 className="text-xl font-semibold">Page not found</h1>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          This page does not exist, or the item it pointed to has been removed.
        </p>
      </div>
      <Link
        href="/dashboard"
        className="inline-flex min-h-11 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-90"
      >
        Back to dashboard
      </Link>
    </main>
  )
}
