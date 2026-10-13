'use client'

import { format, parseISO } from 'date-fns'
import { Avatar } from '@/components/common/Avatar'
import { cn } from '@/lib/utils'
import type { ChatMessage } from '../types/chat.types'

interface Props {
  message: ChatMessage
  isOwn: boolean
}

/**
 * Một tin nhắn dạng bong bóng: tin của mình nằm bên phải, nền primary;
 * tin của người khác nằm bên trái, nền muted.
 */
export function ChatMessageItem({ message, isOwn }: Props) {
  const time = format(parseISO(message.created_at), 'HH:mm')

  return (
    <div className={cn('flex items-end gap-3', isOwn && 'flex-row-reverse')}>
      <Avatar name={message.user_name} src={message.user_avatar_url} className="h-8 w-8 shrink-0 text-caption" />
      <div className={cn('flex min-w-0 max-w-[80%] flex-col sm:max-w-[70%]', isOwn ? 'items-end' : 'items-start')}>
        <div className={cn('mb-1 flex items-baseline gap-2 px-1', isOwn && 'flex-row-reverse')}>
          <span className="text-caption font-medium text-foreground">{message.user_name}</span>
          <time dateTime={message.created_at} className="text-caption tabular-nums text-muted-foreground">{time}</time>
        </div>
        <p
          className={cn(
            'whitespace-pre-wrap break-words rounded-2xl px-4 py-2 text-body-sm',
            isOwn ? 'rounded-br-md bg-primary text-primary-foreground' : 'rounded-bl-md bg-muted text-foreground'
          )}
        >
          {message.content}
        </p>
      </div>
    </div>
  )
}
