import type { ReactNode } from 'react'

interface SectionCardProps {
  title: string
  description: string
  children: ReactNode
  danger?: boolean
}

export function SectionCard({ title, description, children, danger = false }: SectionCardProps) {
  return (
    <section
      className={`overflow-hidden rounded-xl border bg-card shadow-sm ${
        danger ? 'border-destructive/40' : 'border-border'
      }`}
    >
      <div className="border-b border-border px-5 py-4 sm:px-6">
        <h2 className={`text-base font-semibold ${danger ? 'text-destructive' : 'text-foreground'}`}>
          {title}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </section>
  )
}
