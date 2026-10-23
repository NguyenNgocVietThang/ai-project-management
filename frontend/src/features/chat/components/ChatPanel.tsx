'use client'

import { useQueryClient } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { MessageSquare, Send } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/common/Button'
import { EmptyState, ErrorState } from '@/components/common/PageState'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { Skeleton, SkeletonRegion } from '@/components/ui/Skeleton'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/authStore'
import { useApiErrorMessage } from '@/i18n/useApiErrorMessage'
import { chatKeys, useChatHistory, useMarkChatRead, usePostChatMessage } from '../hooks/useChat'
import { useChatSocket } from '../hooks/useChatSocket'
import type { ChatHistoryResponse, ChatMessage } from '../types/chat.types'
import { ChatMessageItem } from './ChatMessageItem'

interface Props {
  projectId: number
}

export function ChatPanel({ projectId }: Props) {
  const getApiErrorMessage = useApiErrorMessage()
  const t = useTranslations('remainingUi')
  const currentUserId = useAuthStore((s) => s.user?.id)
  const qc = useQueryClient()
  const history = useChatHistory(projectId)
  const postMessage = usePostChatMessage(projectId)
  const markRead = useMarkChatRead(projectId)
  const [draft, setDraft] = useState('')
  const [sendFailed, setSendFailed] = useState(false)
  const sendingRef = useRef(false)
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
    if (!content || sendingRef.current) return
    setSendFailed(false)
    sendingRef.current = true
    const submittedDraft = draft
    try {
      const sentOverSocket = sendMessage(content)
      if (!sentOverSocket) {
        // Only fall back when the socket declined the send; never auto-retry an ambiguous send.
        const message = await postMessage.mutateAsync(content)
        appendLiveMessage(message)
      }
      setDraft((current) => current === submittedDraft ? '' : current)
    } catch {
      setSendFailed(true)
    } finally {
      sendingRef.current = false
    }
  }

  // Khung xương có dạng khung chat (đầu, vài bong bóng xen kẽ hai bên, ô nhập) để không nhảy bố cục.
  if (history.isLoading) {
    return (
      <SkeletonRegion label={t('chat.loading')}>
        <Card flush className="flex h-[calc(100dvh-260px)] min-h-[420px] flex-col overflow-hidden">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
          <div className="flex-1 space-y-4 p-4">
            {[0, 1, 2, 3].map(i => (
              <div key={i} className={cn('flex items-end gap-3', i % 2 === 1 && 'flex-row-reverse')}>
                <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
                <Skeleton className={cn('h-12 rounded-2xl', i % 2 === 1 ? 'w-1/3' : 'w-1/2')} />
              </div>
            ))}
          </div>
          <div className="border-t p-3"><Skeleton className="h-11 w-full" /></div>
        </Card>
      </SkeletonRegion>
    )
  }
  if (history.isError) {
    return <ErrorState message={getApiErrorMessage(history.error, t('chat.historyError'))} retryLabel={t('retry')} onRetry={() => void history.refetch()} />
  }

  return (
    <Card flush className="flex h-[calc(100dvh-260px)] min-h-[420px] flex-col overflow-hidden">
      {/* ===== Đầu khung chat: tiêu đề + trạng thái kết nối WebSocket ===== */}
      <div className="flex items-center justify-between gap-3 border-b px-4 py-3">
        <h2 className="text-h4">{t('chat.title')}</h2>
        <Badge tone={isConnected ? 'success' : 'neutral'} dot>
          {isConnected ? t('chat.live') : t('chat.connecting')}
        </Badge>
      </div>

      {/* ===== Vùng tin nhắn: tự cuộn, ô nhập luôn nằm ở đáy khung ===== */}
      <div ref={scrollRef} role="region" aria-label={t('chat.history')} tabIndex={0} className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring">
        {history.hasNextPage && (
          <div className="flex justify-center pb-2">
            <Button
              variant="ghost"
              size="sm"
              fullWidth={false}
              onClick={() => history.fetchNextPage()}
              disabled={history.isFetchingNextPage}
              className="text-muted-foreground"
            >
              {history.isFetchingNextPage ? t('chat.loadingEarlier') : t('chat.earlier')}
            </Button>
          </div>
        )}
        {messages.length === 0 && (
          <EmptyState
            icon={MessageSquare}
            title={t('chat.empty')}
            description={t('chat.emptyDescription')}
            className="min-h-0 border-0 bg-transparent py-8"
          />
        )}
        {messages.map((message) => (
          <ChatMessageItem key={message.id} message={message} isOwn={message.user_id === currentUserId} />
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="sticky bottom-0 border-t bg-card p-3">
        {sendFailed && <p role="alert" className="mb-2 text-body-sm text-destructive">{t('chat.sendError')}</p>}
        <div className="flex items-end gap-2">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSend()
            }
          }}
          placeholder={t('chat.placeholder')}
          aria-label={t('chat.compose')}
          rows={1}
          className="max-h-32 min-h-11 flex-1 resize-none rounded-lg border border-input bg-card px-3 py-2 text-body shadow-xs transition-[border-color,box-shadow] duration-150 placeholder:text-muted-foreground hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:text-body-sm"
        />
        <Button
          onClick={handleSend}
          disabled={!draft.trim() || postMessage.isPending}
          isLoading={postMessage.isPending}
          size="icon"
          fullWidth={false}
          aria-label={t('chat.send')}
        >
          {!postMessage.isPending && <Send className="h-4 w-4" aria-hidden="true" />}
        </Button>
        </div>
      </div>
    </Card>
  )
}
