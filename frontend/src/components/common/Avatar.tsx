import Image from 'next/image'
import { cn } from '@/lib/utils'
import { API_BASE_URL } from '@/services/api'

interface AvatarProps {
  name: string
  src?: string | null
  className?: string
}

export function Avatar({ name, src, className }: AvatarProps) {
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')

  if (src) {
    const resolved = /^https?:\/\//.test(src) ? src : `${new URL(API_BASE_URL).origin}${src}`
    return <Image src={resolved} alt="" width={40} height={40} unoptimized className={cn('h-10 w-10 rounded-full object-cover', className)} />
  }

  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary',
        className
      )}
    >
      {initials || '?'}
    </span>
  )
}
