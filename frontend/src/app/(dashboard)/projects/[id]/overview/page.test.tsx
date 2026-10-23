import { fireEvent, render, screen, within } from '@testing-library/react'
import { NextIntlClientProvider } from 'next-intl'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import en from '../../../../../../messages/en.json'
import viMessages from '../../../../../../messages/vi.json'
import Overview from './page'

const mocks = vi.hoisted(() => ({ project: vi.fn(), stats: vi.fn(), activity: vi.fn() }))
vi.mock('next/navigation', () => ({ useParams: () => ({ id: '2' }) }))
vi.mock('@/features/projects/hooks/useProjects', () => ({ useProjectDetail: mocks.project, useProjectActivity: mocks.activity }))
vi.mock('@/features/dashboard/hooks/useDashboard', () => ({ useProjectStats: mocks.stats }))
vi.mock('@/features/reports/components/XlsxExportButton', () => ({ XlsxExportButton: () => null }))
vi.mock('./charts', () => ({ ProjectOverviewCharts: () => <div data-testid="charts" /> }))

const phases = Object.freeze([{ id: 2, name: 'Second', status: 'PLANNED', start_date: null, end_date: null, order_index: 2 }, { id: 1, name: 'Sprint 1 (20/10–31/10)', status: 'PLANNED', start_date: null, end_date: null, order_index: 1 }])
beforeEach(() => {
  mocks.project.mockReturnValue({ data: { name: 'Project', phases, milestones: [], task_count: 17, completed_task_count: 1, progress_percent: 6, member_count: 1, end_date: null, start_date: null, budget: null, budget_spent: 0, currency: 'VND', description: 'Long project description' } })
  mocks.stats.mockReturnValue({ data: { overdue_tasks: 2, critical_tasks: 3, task_distribution: [{ status: 'BLOCKED', count: 1 }] } })
  mocks.activity.mockReturnValue({ data: [] })
})

describe.each([{ locale: 'en', messages: en }, { locale: 'vi', messages: viMessages }])('Overview ($locale)', ({ locale, messages }) => {
  it('prioritizes real attention counts, preserves phase data and defers charts', async () => {
    const onError = vi.fn()
    render(<NextIntlClientProvider locale={locale} messages={messages} onError={onError}><Overview /></NextIntlClientProvider>)
    const section = screen.getByRole('region', { name: messages.projectOverview.attention })
    expect(within(section).getByText('2')).toBeInTheDocument()
    expect(within(section).getByRole('link')).toHaveAttribute('href', '/projects/2/tasks')
    expect(phases[0].id).toBe(2)
    expect(screen.getByText('Sprint 1 (20/10–31/10)')).toBeInTheDocument()
    expect(screen.queryByTestId('charts')).not.toBeInTheDocument()
    const details = screen.getByText(messages.projectOverview.charts).closest('details')!
    details.open = true
    fireEvent(details, new Event('toggle'))
    expect(await screen.findByTestId('charts')).toBeInTheDocument()
    expect(onError).not.toHaveBeenCalled()
  })
  it('shows secondary query failures with a retry instead of invented counts', () => {
    const refetch = vi.fn()
    mocks.stats.mockReturnValue({ isError: true, refetch })
    render(<NextIntlClientProvider locale={locale} messages={messages}><Overview /></NextIntlClientProvider>)
    const section = screen.getByRole('region', { name: messages.projectOverview.attention })
    expect(within(section).getByRole('alert')).toHaveTextContent(messages.projectOverview.attentionError)
    fireEvent.click(within(section).getByRole('button', { name: messages.projectOverview.retry }))
    expect(refetch).toHaveBeenCalledOnce()
    expect(within(section).queryByRole('definition')).not.toBeInTheDocument()
  })
})
