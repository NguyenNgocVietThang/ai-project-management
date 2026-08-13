'use client'

import { useAuth } from '@/hooks/useAuth'

export default function DashboardPage() {
  const { user } = useAuth()

  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">
        Welcome{user ? `, ${user.full_name}` : ''}
      </h1>
      <p className="text-sm text-muted-foreground">
        This is a placeholder dashboard confirming the protected route + auth flow work.
        Portfolio, project, and task views land here next.
      </p>
    </div>
  )
}
