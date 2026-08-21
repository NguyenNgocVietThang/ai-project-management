'use client'

import { useParams } from 'next/navigation'
import { ChatPanel } from '@/features/chat/components/ChatPanel'

export default function ProjectChatPage() {
  const id = Number(useParams<{ id: string }>().id)
  return <ChatPanel projectId={id} />
}
