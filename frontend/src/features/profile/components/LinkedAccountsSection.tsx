'use client'

import { Link2 } from 'lucide-react'
import { Alert } from '@/components/common/Alert'
import { Button } from '@/components/common/Button'
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
  { id: 'facebook', label: 'Facebook' },
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
          const connected = provider.id === 'google' ? user.google_connected : user.facebook_connected
          return (
            <div
              key={provider.id}
              className="flex flex-col gap-3 rounded-lg border border-border p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                  <Link2 className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-medium text-foreground">{provider.label}</p>
                  <p className="text-sm text-muted-foreground">
                    {connected ? 'Connected' : 'Not connected'}
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant={connected ? 'outline' : 'default'}
                className="sm:w-auto"
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
