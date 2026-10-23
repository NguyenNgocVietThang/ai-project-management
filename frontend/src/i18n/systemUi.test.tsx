import { render, screen } from '@testing-library/react'
import { NextIntlClientProvider } from 'next-intl'
import { describe, expect, it, vi } from 'vitest'
import { NotificationItem } from '@/features/notifications/components/NotificationItem'
import { RecentActivityFeed } from '@/features/dashboard/components/RecentActivityFeed'
import { BurndownChart } from '@/components/charts/BurndownChart'
import { DonutChart } from '@/components/charts/DonutChart'
import { TeamBarChart } from '@/components/charts/TeamBarChart'
import en from '../../messages/en.json'
import vn from '../../messages/vi.json'

// Responsive chart drawing needs browser layout; the accessible tables and text
// remain real so this test exercises locale changes without pretending to draw.
vi.mock('recharts', async (importOriginal) => ({
  ...await importOriginal<typeof import('recharts')>(), ResponsiveContainer: () => null,
}))

function SystemUI({ locale }: { locale: 'en' | 'vi' }) {
  return <NextIntlClientProvider locale={locale} messages={locale === 'vi' ? vn : en}>
    <NotificationItem notification={{ id: 1, title: 'Task assigned to you', message: "You have been assigned to task 'API review'",
      notification_type: 'TASK_ASSIGNED', is_read: false, read_at: null, link: null,
      related_entity_type: 'Task', related_entity_id: 1, created_at: '2026-10-20T00:00:00Z' }} />
    <RecentActivityFeed items={[{ id: 1, action: 'CREATE', description: 'Created phase API rollout', entity_type: 'Phase',
      entity_id: 1, actor_name: 'Alex', created_at: '2026-10-20T00:00:00Z' }]} />
    <BurndownChart data={[{ date: '2026-10-23', ideal: 5, remaining: 6 }]} />
    <DonutChart data={[]} />
    <TeamBarChart data={[]} />
  </NextIntlClientProvider>
}

describe('system notifications and chart live locale changes', () => {
  it('updates stored system messages, audit metadata, chart fallback labels and cached dates', () => {
    const { rerender } = render(<SystemUI locale="vi" />)
    expect(screen.getByText('Công việc đã được phân công')).toBeInTheDocument()
    expect(screen.getByText(/Bạn đã được phân công công việc “API review”/)).toBeInTheDocument()
    expect(screen.getByText('Đã tạo giai đoạn API rollout')).toBeInTheDocument()
    expect(screen.getByText('Giai đoạn')).toBeInTheDocument()
    expect(screen.getByText('23/10', { selector: 'th' })).toBeInTheDocument()
    expect(screen.getByText('Chưa có dữ liệu')).toBeInTheDocument()
    expect(screen.getByText('Chưa có dữ liệu nhân sự')).toBeInTheDocument()

    rerender(<SystemUI locale="en" />)
    expect(screen.getByText('Task assigned to you')).toBeInTheDocument()
    expect(screen.getByText(/You have been assigned to task “API review”/)).toBeInTheDocument()
    expect(screen.getByText('Created phase API rollout')).toBeInTheDocument()
    expect(screen.getByText('Phase')).toBeInTheDocument()
    expect(screen.getByText('10/23', { selector: 'th' })).toBeInTheDocument()
    expect(screen.queryByText('23/10', { selector: 'th' })).not.toBeInTheDocument()
    expect(screen.getByText('No data available')).toBeInTheDocument()
    expect(screen.getByText('No team data available')).toBeInTheDocument()
  })
})
