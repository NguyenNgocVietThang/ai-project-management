'use client'

import { Link2 } from 'lucide-react'
import { Alert } from '@/components/common/Alert'
import { Button } from '@/components/common/Button'
import { Badge } from '@/components/ui/Badge'
import type { OAuthProvider, User } from '@/types/auth.types'
import { SectionCard } from './SectionCard'

interface LinkedAccountsSectionProps {
  user: User
  onConnect: (provider: OAuthProvider) => Promise<void>
  onDisconnect: (provider: OAuthProvider) => Promise<void>
  pendingProvider: OAuthProvider | null
  error: string | null
  successMessage: string | null
}

const providers: { id: OAuthProvider; label: string }[] = [
  { id: 'google', label: 'Google' },
]

export function LinkedAccountsSection({
  user,
  onConnect,
  onDisconnect,
  pendingProvider,
  error,
  successMessage,
}: LinkedAccountsSectionProps) {
  return (
    <SectionCard
      title="Linked accounts"
      description="Connect another sign-in method, or remove one you no longer use."
    >
      <div className="space-y-4">
        {error && <Alert>{error}</Alert>}
        {successMessage && <Alert variant="success">{successMessage}</Alert>}
        {providers.map((provider) => {
          const connected = user.google_connected
          return (
            // Xếp dọc: thông tin nhà cung cấp phía trên, nút full width phía dưới (cột 320px)
            <div key={provider.id} className="space-y-3 rounded-lg border border-border p-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent">
                  <Link2 className="h-5 w-5 text-accent-foreground" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-foreground">{provider.label}</p>
                  <Badge tone={connected ? 'success' : 'neutral'} size="sm" dot className="mt-1">
                    {connected ? 'Connected' : 'Not connected'}
                  </Badge>
                </div>
              </div>
              <Button
                type="button"
                variant={connected ? 'outline' : 'default'}
                isLoading={pendingProvider === provider.id}
                onClick={() => (connected ? onDisconnect(provider.id) : onConnect(provider.id))}
              >
                {connected ? 'Disconnect' : 'Connect'}
              </Button>
            </div>
          )
        })}
      </div>
    </SectionCard>
  )
}
