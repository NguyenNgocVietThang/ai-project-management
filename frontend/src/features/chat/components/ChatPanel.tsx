'use client'

import { useQueryClient } from '@tanstack/react-query'
import { Send } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/common/Button'
import { ErrorState, LoadingState } from '@/components/common/PageState'
import { useAuthStore } from '@/store/authStore'
import { getApiErrorMessage } from '@/types/api.types'
import { chatKeys, useChatHistory, useMarkChatRead, usePostChatMessage } from '../hooks/useChat'
import { useChatSocket } from '../hooks/useChatSocket'
import type { ChatHistoryResponse, ChatMessage } from '../types/chat.types'
import { ChatMessageItem } from './ChatMessageItem'

interface Props {
  projectId: number
}

export function ChatPanel({ projectId }: Props) {
  const currentUserId = useAuthStore((s) => s.user?.id)
  const qc = useQueryClient()
  const history = useChatHistory(projectId)
  const postMessage = usePostChatMessage(projectId)
  const markRead = useMarkChatRead(projectId)
  const [draft, setDraft] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const appendLiveMessage = (message: ChatMessage) => {
    qc.setQueryData<{ pages: ChatHistoryResponse[]; pageParams: unknown[] }>(
      chatKeys.history(projectId),
      (current) => {
        if (!current || current.pages.length === 0) return current
        // pages[0] chứa trang mới nhất — tin nhắn trực tiếp thuộc về cuối trang đó.
        const [first, ...rest] = current.pages
        if (first.items.some((item) => item.id === message.id)) return current // loại bỏ trùng lặp
        return {
          ...current,
          pages: [{ ...first, items: [...first.items, message] }, ...rest],
        }
      }
    )
    markRead.mutate(message.id)
  }

  const { sendMessage, isConnected } = useChatSocket(projectId, appendLiveMessage)

  const messages = [...(history.data?.pages ?? [])].reverse().flatMap((page) => page.items)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'end' })
  }, [messages.length])

  useEffect(() => {
    if (messages.length > 0) {
      markRead.mutate(messages[messages.length - 1].id)
    }
    // Chỉ đánh dấu đã đọc lại khi trang tải lần đầu hoặc id tin nhắn mới nhất thay đổi.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages[messages.length - 1]?.id])

  async function handleSend() {
    const content = draft.trim()
    if (!content) return
    setDraft('')
    const sentOverSocket = sendMessage(content)
    if (!sentOverSocket) {
      // WS chưa kết nối — chuyển sang REST để không mất tin nhắn.
      const message = await postMessage.mutateAsync(content)
      appendLiveMessage(message)
    }
  }

  if (history.isLoading) return <LoadingState label="Loading chat…" />
  if (history.isError) {
    return <ErrorState message={getApiErrorMessage(history.error, 'Could not load chat history.')} />
  }

  return (
    <div className="flex h-[calc(100vh-260px)] min-h-[420px] flex-col rounded-xl border">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <h2 className="text-sm font-semibold">Project chat</h2>
        <span
          className={`flex items-center gap-1.5 text-xs ${isConnected ? 'text-emerald-600' : 'text-muted-foreground'}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-muted-foreground/50'}`} />
          {isConnected ? 'Live' : 'Connecting…'}
        </span>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
        {history.hasNextPage && (
          <div className="flex justify-center pb-2">
            <button
              onClick={() => history.fetchNextPage()}
              disabled={history.isFetchingNextPage}
              className="text-xs text-muted-foreground hover:text-foreground disabled:opacity-50"
            >
              {history.isFetchingNextPage ? 'Loading…' : 'Load earlier messages'}
            </button>
          </div>
        )}
        {messages.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No messages yet — say hi to the team.
          </p>
        )}
        {messages.map((message) => (
          <ChatMessageItem key={message.id} message={message} isOwn={message.user_id === currentUserId} />
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="flex items-end gap-2 border-t p-3">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSend()
            }
          }}
          placeholder="Write a message…"
          rows={1}
          className="max-h-32 min-h-[44px] flex-1 resize-none rounded-md border border-input bg-background px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <Button
          onClick={handleSend}
          disabled={!draft.trim()}
          isLoading={postMessage.isPending}
          className="w-auto shrink-0 px-3"
          aria-label="Send message"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
