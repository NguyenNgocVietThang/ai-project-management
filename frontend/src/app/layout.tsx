import type { Metadata, Viewport } from 'next'
import { Providers } from '@/app/providers'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'AI Project Management',
    template: '%s · AI Project Management',
  },
  description: 'AI Project Planning & Portfolio Management',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
