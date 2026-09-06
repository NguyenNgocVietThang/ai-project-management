'use client'

import { useNumericParam } from '@/hooks/useNumericParam'
import { ChatPanel } from '@/features/chat/components/ChatPanel'

export default function ProjectChatPage() {
  const id = useNumericParam()
  return <ChatPanel projectId={id} />
}
