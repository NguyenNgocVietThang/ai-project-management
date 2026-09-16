import { Layers } from 'lucide-react'
import { useTranslations } from 'next-intl'

export function Brand({ compact = false }: { compact?: boolean }) {
  const t = useTranslations('shell')
  return <div className="flex min-w-0 items-center gap-3">
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Layers className="h-5 w-5" strokeWidth={1.7} aria-hidden="true" /></span>
    <span className={compact ? 'hidden sm:block' : ''}>
      <span className="block text-[17px] font-semibold tracking-tight">AI Project<span className="text-primary">.</span></span>
      <span className="block whitespace-nowrap text-[9px] font-medium tracking-[0.08em] text-muted-foreground">{t('brandSubtitle')}</span>
    </span>
  </div>
}
