'use client'

import { format, parseISO } from 'date-fns'
import { Avatar } from '@/components/common/Avatar'
import { cn } from '@/lib/utils'
import type { ChatMessage } from '../types/chat.types'

interface Props {
  message: ChatMessage
  isOwn: boolean
}

export function ChatMessageItem({ message, isOwn }: Props) {
  const time = format(parseISO(message.created_at), 'HH:mm')

  return (
    <div className={cn('flex items-start gap-3', isOwn && 'flex-row-reverse')}>
      <Avatar name={message.user_name} src={message.user_avatar_url} className="h-8 w-8 shrink-0 text-xs" />
      <div className={cn('max-w-[75%] min-w-0', isOwn && 'items-end text-right')}>
        <div className={cn('flex items-baseline gap-2', isOwn && 'flex-row-reverse')}>
          <span className="text-xs font-medium text-foreground">{message.user_name}</span>
          <span className="text-[10px] text-muted-foreground">{time}</span>
        </div>
        <p
          className={cn(
            'mt-1 whitespace-pre-wrap break-words rounded-2xl px-3 py-2 text-sm leading-snug',
            isOwn ? 'bg-primary text-primary-foreground' : 'bg-accent text-foreground'
          )}
        >
          {message.content}
        </p>
      </div>
    </div>
  )
}
