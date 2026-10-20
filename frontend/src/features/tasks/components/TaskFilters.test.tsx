import { useState } from 'react'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NextIntlClientProvider } from 'next-intl'
import { describe, expect, it } from 'vitest'
import messages from '../../../../messages/en.json'
import type { TaskListParams } from '@/types/task.types'
import { TaskFilters } from './TaskFilters'

function Harness() {
  const [filters, setFilters] = useState<TaskListParams>({})
  return <TaskFilters filters={filters} onChange={(key, value) => setFilters(current => ({ ...current, [key]: value }))} onReset={() => setFilters({})} phases={[{ id: 2, name: 'Discovery' }]} sprints={[]} epics={[]} members={[{ id: 7, name: 'An' }]} total={17} />
}

describe('TaskFilters', () => {
  it('opens advanced controls on request, applies chips, resets and restores focus using Escape', async () => {
    render(<NextIntlClientProvider locale="en" messages={messages}><Harness /></NextIntlClientProvider>)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByRole('searchbox')).toBeInTheDocument()
    const user = userEvent.setup()
    const trigger = screen.getByRole('button', { name: 'Filters' })
    await user.click(trigger)
    const dialog = screen.getByRole('dialog')
    await user.selectOptions(within(dialog).getByLabelText('Phase'), '2')
    await user.type(within(dialog).getByLabelText('Labels'), 'frontend, urgent')
    await user.tab()
    expect(screen.getByRole('button', { name: 'Remove Phase filter' })).toHaveTextContent('Discovery')
    expect(screen.getByRole('button', { name: 'Remove Labels filter' })).toHaveTextContent('frontend, urgent')
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
    await user.click(screen.getByRole('button', { name: 'Clear filters' }))
    expect(screen.queryByRole('button', { name: /Remove .* filter/ })).not.toBeInTheDocument()
  })
})
