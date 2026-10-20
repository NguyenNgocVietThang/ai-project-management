import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NextIntlClientProvider } from 'next-intl'
import { describe, expect, it, vi } from 'vitest'
import en from '../../../../messages/en.json'
import type { PhaseNode, SprintNode } from '@/types/wbs.types'
import { WBSTree } from './WBSTree'

const sprint: SprintNode = { id: 4, project_id: 2, phase_id: 1, name: 'Sprint inside phase', goal: null, status: 'PLANNED', start_date: null, end_date: null, story_points_committed: 0, story_points_completed: 0, velocity: 0, tasks: [], task_count: 0 }
const phase: PhaseNode = { id: 1, project_id: 2, name: 'Sprint 1 (20/10–31/10) '.repeat(8), status: 'PLANNED', start_date: null, end_date: null, description: null, order_index: 0, created_at: '', tasks: [], task_count: 0, sprints: [sprint] }
function setup(phases = [phase], unphasedSprints: SprintNode[] = []) {
  const callbacks = { onEditPhase: vi.fn(), onDeletePhase: vi.fn(), onAddSprint: vi.fn(), onEditSprint: vi.fn(), onDeleteSprint: vi.fn(), onStartSprint: vi.fn(), onCompleteSprint: vi.fn() }
  render(<NextIntlClientProvider locale="en" messages={en}><WBSTree phases={phases} unphasedSprints={unphasedSprints} canManage {...callbacks} /></NextIntlClientProvider>)
  return callbacks
}
describe('WBSTree', () => {
  it('discloses child rows with keyboard and keeps a named Sprint as a phase', async () => {
    setup()
    const row = screen.getByRole('button', { name: /Phase Sprint 1/ })
    expect(row).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('button', { name: /Sprint inside phase/ })).not.toBeInTheDocument()
    row.focus()
    await userEvent.keyboard('{Enter}')
    expect(row).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('button', { name: /Sprint inside phase/ })).toBeInTheDocument()
    expect(row).toHaveTextContent(en.wbs.dateNotSet)
    expect(row).toHaveTextContent(phase.name.trim())
  })
  it('keeps action buttons outside disclosure and supplies original ids', async () => {
    const callbacks = setup()
    const user = userEvent.setup()
    await user.click(screen.getAllByLabelText(/^Actions for/)[0])
    await user.click(screen.getByRole('button', { name: en.wbs.addSprint }))
    expect(callbacks.onAddSprint).toHaveBeenCalledWith(1)
    expect(screen.getByRole('button', { name: /Phase Sprint 1/ })).toHaveAttribute('aria-expanded', 'false')
  })
  it('supports empty phases and sprints without phases', () => {
    setup([], [{ ...sprint, phase_id: null }])
    expect(screen.getByText(en.wbs.noPhases)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: en.wbs.unphasedSprints })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Sprint inside phase/ })).toBeInTheDocument()
  })
})
