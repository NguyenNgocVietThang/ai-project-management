'use client'

import { useNumericParam } from '@/hooks/useNumericParam'
import { ChatPanel } from '@/features/chat/components/ChatPanel'

/** Tab chat dự án: toàn bộ giao diện và kết nối WebSocket nằm trong ChatPanel. */
export default function ProjectChatPage() {
  const id = useNumericParam()
  return (
    <div className="min-w-0">
      <ChatPanel projectId={id} />
    </div>
  )
}
