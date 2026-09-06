'use client'

import { ErrorState, LoadingState } from '@/components/common/PageState'
import { ActiveProjectsGrid } from '@/features/dashboard/components/ActiveProjectsGrid'
import { MyTasksList } from '@/features/dashboard/components/MyTasksList'
import { RecentActivityFeed } from '@/features/dashboard/components/RecentActivityFeed'
import { StatsRow } from '@/features/dashboard/components/StatsRow'
import { useDashboardSummary } from '@/features/dashboard/hooks/useDashboard'
import { useAuth } from '@/hooks/useAuth'
import { getApiErrorMessage } from '@/types/api.types'

// ── Hàm hỗ trợ ─────────────────────────────────────────────────────────────

function greeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

// ── Thẻ thống kê ───────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { user } = useAuth()
  const { data, isLoading, isError, error } = useDashboardSummary()

  if (isLoading) return <LoadingState label="Loading dashboard…" />
  if (isError || !data) return <ErrorState message={getApiErrorMessage(error)} />

  return (
    <div className="space-y-8">
      {/* Chào mừng */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          {greeting()}, {user?.full_name?.split(' ')[0] ?? 'there'} 👋
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Here&apos;s what&apos;s happening across your projects today.
        </p>
      </div>

      <StatsRow stats={data.stats} />

      <ActiveProjectsGrid projects={data.active_projects} />

      <div className="grid gap-6 xl:grid-cols-2">
        <MyTasksList tasks={data.my_tasks} />
        <RecentActivityFeed items={data.recent_activity} />
      </div>
    </div>
  )
}
