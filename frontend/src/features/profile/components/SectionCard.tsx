import { useId, type ReactNode } from 'react'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { cn } from '@/lib/utils'

interface SectionCardProps {
  title: string
  description: string
  children: ReactNode
  /** Vùng nguy hiểm: viền và tiêu đề màu destructive. */
  danger?: boolean
  className?: string
}

/** Khối cài đặt hồ sơ dựng trên primitive Card (tiêu đề + mô tả + nội dung). */
export function SectionCard({ title, description, children, danger = false, className }: SectionCardProps) {
  const titleId = useId()

  return (
    <Card
      as="section"
      aria-labelledby={titleId}
      className={cn(danger && 'border-destructive/40', className)}
    >
      <CardHeader className="-mx-4 mb-6 block border-b px-4 pb-4 sm:-mx-6 sm:px-6">
        <CardTitle id={titleId} className={cn(danger && 'text-destructive')}>
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      {children}
    </Card>
  )
}
