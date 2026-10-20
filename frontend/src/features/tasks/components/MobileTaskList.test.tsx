import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NextIntlClientProvider } from 'next-intl'
import { describe, expect, it, vi } from 'vitest'
import messages from '../../../../messages/en.json'
import type { Task } from '@/types/task.types'
import { MobileTaskList } from './MobileTaskList'

describe('MobileTaskList', () => {
  it('shows status, assignee and missing date and opens with the keyboard', async () => {
    const onOpen = vi.fn()
    const task = { id: 17, name: 'Phân tích yêu cầu với tên công việc dài', status: 'IN_PROGRESS', primary_assignee: { full_name: 'Nguyễn An' }, due_date: null } as Task
    render(<NextIntlClientProvider locale="en" messages={messages}><MobileTaskList tasks={[task]} onOpen={onOpen} /></NextIntlClientProvider>)
    expect(screen.getByText('In progress')).toBeInTheDocument()
    expect(screen.getByText('Nguyễn An')).toBeInTheDocument()
    expect(screen.getByText(/No date set/)).toBeInTheDocument()
    const user = userEvent.setup()
    await user.tab()
    expect(screen.getByRole('button')).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(onOpen).toHaveBeenCalledWith(17)
  })
})
