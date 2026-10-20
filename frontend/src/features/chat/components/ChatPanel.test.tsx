import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NextIntlClientProvider } from 'next-intl'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ChatPanel } from './ChatPanel'

const controls = vi.hoisted(() => ({ post: vi.fn(), socket: vi.fn(), markRead: vi.fn() }))
vi.mock('@/store/authStore', () => ({ useAuthStore: (select: (s: { user: { id: number } }) => unknown) => select({ user: { id: 7 } }) }))
vi.mock('../hooks/useChatSocket', () => ({ useChatSocket: () => ({ sendMessage: controls.socket, isConnected: false }) }))
vi.mock('../hooks/useChat', async () => {
  const { useMutation } = await import('@tanstack/react-query')
  return {
    chatKeys: { history: (id: number) => ['chat', id] },
    useChatHistory: () => ({ data: { pages: [{ items: [] }] }, isLoading: false, isError: false, hasNextPage: false }),
    useMarkChatRead: () => ({ mutate: controls.markRead }),
    usePostChatMessage: () => useMutation({ mutationFn: controls.post }),
  }
})

function mount() {
  const client = new QueryClient({ defaultOptions: { mutations: { retry: false } } })
  return render(<QueryClientProvider client={client}><NextIntlClientProvider locale="en" messages={{ remainingUi: { chat: { loading: 'Loading chat…', historyError: 'Could not load chat history.', title: 'Project chat', live: 'Live', connecting: 'Connecting…', history: 'Chat history', loadingEarlier: 'Loading…', earlier: 'Load earlier messages', empty: 'No messages yet', emptyDescription: 'Start the conversation.', placeholder: 'Write a message…', compose: 'Write a message', send: 'Send message', sendError: 'Message could not be sent. Your draft is saved; check the conversation before sending again.' }, retry: 'Try again' } }}><ChatPanel projectId={2} /></NextIntlClientProvider></QueryClientProvider>)
}

describe('ChatPanel send recovery', () => {
  beforeEach(() => {
    controls.post.mockReset()
    controls.socket.mockReset().mockReturnValue(false)
    Object.defineProperty(Element.prototype, 'scrollIntoView', { configurable: true, value: vi.fn() })
  })

  it('keeps a failed REST draft and lets the user deliberately send it again', async () => {
    controls.post.mockRejectedValueOnce(new Error('offline')).mockResolvedValueOnce({ id: 9, content: 'Keep this draft', user_id: 7 })
    mount()
    const user = userEvent.setup()
    const input = screen.getByRole('textbox', { name: 'Write a message' })
    await user.type(input, 'Keep this draft')
    await user.click(screen.getByRole('button', { name: 'Send message' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('Your draft is saved')
    expect(input).toHaveValue('Keep this draft')
    expect(controls.post).toHaveBeenCalledTimes(1)
    await user.click(screen.getByRole('button', { name: 'Send message' }))
    await waitFor(() => expect(input).toHaveValue(''))
    expect(controls.post).toHaveBeenCalledTimes(2)
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('does not erase a newer draft or dispatch twice while REST is pending', async () => {
    let finish!: (value: unknown) => void
    controls.post.mockImplementation(() => new Promise((resolve) => { finish = resolve }))
    mount()
    const user = userEvent.setup()
    const input = screen.getByRole('textbox', { name: 'Write a message' })
    await user.type(input, 'First message{Enter}')
    await user.clear(input)
    await user.type(input, 'Next message{Enter}')
    expect(controls.post).toHaveBeenCalledTimes(1)
    finish({ id: 9, content: 'First message', user_id: 7 })
    await waitFor(() => expect(screen.getByRole('button', { name: 'Send message' })).not.toBeDisabled())
    expect(input).toHaveValue('Next message')
  })
})
