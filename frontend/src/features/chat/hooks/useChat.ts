import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { chatService } from '../services/chat.service'
import type { ChatHistoryResponse } from '../types/chat.types'

export const chatKeys = {
  all: ['chat'] as const,
  history: (projectId: number) => [...chatKeys.all, 'history', projectId] as const,
  unread: (projectId: number) => [...chatKeys.all, 'unread', projectId] as const,
}

/** Paginated message history — first page is the most recent messages;
 * fetchNextPage() loads older messages via the `before_id` cursor. */
export function useChatHistory(projectId: number) {
  return useInfiniteQuery<ChatHistoryResponse>({
    queryKey: chatKeys.history(projectId),
    queryFn: ({ pageParam }) => chatService.getHistory(projectId, pageParam as number | undefined),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => (lastPage.has_more ? (lastPage.next_before_id ?? undefined) : undefined),
    enabled: Boolean(projectId),
  })
}

export function useChatUnreadCount(projectId: number) {
  return useQuery({
    queryKey: chatKeys.unread(projectId),
    queryFn: () => chatService.getUnreadCount(projectId),
    enabled: Boolean(projectId),
    staleTime: 15_000,
  })
}

/** REST fallback for sending a message — used only if the WebSocket send
 * isn't available (e.g. still connecting); the live path is useChatSocket. */
export function usePostChatMessage(projectId: number) {
  return useMutation({
    mutationFn: (content: string) => chatService.postMessage(projectId, content),
  })
}

export function useMarkChatRead(projectId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (messageId?: number) => chatService.markRead(projectId, messageId),
    onSuccess: (data) => {
      qc.setQueryData(chatKeys.unread(projectId), data)
    },
  })
}
