import { render, screen } from '@testing-library/react'
import { NextIntlClientProvider } from 'next-intl'
import { describe, expect, it, vi } from 'vitest'
import messages from '../../../../../messages/en.json'
import ProjectLayout from './layout'

const route = vi.hoisted(() => ({ pathname: '/projects/2/tasks' }))
vi.mock('next/navigation', () => ({ useParams: () => ({ id: '2' }), usePathname: () => route.pathname, notFound: vi.fn() }))
vi.mock('@/components/layout/Breadcrumbs', () => ({ useBreadcrumbLabel: vi.fn() }))
vi.mock('@/features/chat/hooks/useChat', () => ({ useChatUnreadCount: () => ({ data: { unread_count: 0 } }) }))
vi.mock('@/features/projects/hooks/useProjects', () => ({ useProjectDetail: () => ({ data: { name: 'Project context', portfolio_name: 'Portfolio context', status: 'ACTIVE', methodology: 'AGILE' } }) }))

describe('project tasks layout', () => {
  it.each(['/projects/2/tasks', '/projects/2/tasks/17'])('keeps compact project identity and navigation on %s', pathname => {
    route.pathname = pathname
    render(<NextIntlClientProvider locale="en" messages={messages}><ProjectLayout><p>Workspace</p></ProjectLayout></NextIntlClientProvider>)
    expect(screen.getByRole('heading', { level: 1, name: 'Project context' })).toBeInTheDocument()
    expect(screen.getByText('Active')).toBeInTheDocument()
    expect(screen.getByText('Agile')).toBeInTheDocument()
    expect(screen.queryByText('Portfolio context')).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Tasks' })).toHaveAttribute('aria-current', 'page')
  })

  it('retains full project context outside tasks', () => {
    route.pathname = '/projects/2/overview'
    render(<NextIntlClientProvider locale="en" messages={messages}><ProjectLayout><p>Overview</p></ProjectLayout></NextIntlClientProvider>)
    expect(screen.getByText('Portfolio context')).toBeInTheDocument()
  })
})
