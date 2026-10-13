'use client'

import { X } from 'lucide-react'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { Label } from '@/components/common/Label'
import { Card } from '@/components/ui/Card'
import type { AuditLogListParams } from '@/types/admin.types'

export function AuditLogFilters({
  value,
  onChange,
}: {
  value: AuditLogListParams
  onChange: (value: AuditLogListParams) => void
}) {
  const hasFilters = Boolean(value.entity_type || value.action || value.date_from || value.date_to)

  return (
    // Thanh bộ lọc: 1 cột trên mobile, 2 cột tablet, 4 trường + nút xoá trên desktop
    <Card className="grid gap-3 sm:grid-cols-2 xl:grid-cols-[repeat(4,minmax(0,1fr))_auto] xl:items-end">
      <div>
        <Label htmlFor="audit-entity-type">Entity type</Label>
        <Input
          id="audit-entity-type"
          placeholder="e.g. User, Project"
          value={value.entity_type ?? ''}
          onChange={(event) => onChange({ ...value, entity_type: event.target.value || undefined })}
        />
      </div>
      <div>
        <Label htmlFor="audit-action">Action</Label>
        <Input
          id="audit-action"
          placeholder="e.g. CREATE, UPDATE"
          value={value.action ?? ''}
          onChange={(event) => onChange({ ...value, action: event.target.value || undefined })}
        />
      </div>
      <div>
        <Label htmlFor="audit-date-from">From</Label>
        <Input
          id="audit-date-from"
          type="date"
          value={value.date_from?.slice(0, 10) ?? ''}
          onChange={(event) => onChange({ ...value, date_from: event.target.value || undefined })}
        />
      </div>
      <div>
        <Label htmlFor="audit-date-to">To</Label>
        <Input
          id="audit-date-to"
          type="date"
          value={value.date_to?.slice(0, 10) ?? ''}
          onChange={(event) => onChange({ ...value, date_to: event.target.value || undefined })}
        />
      </div>
      <Button
        type="button"
        variant="ghost"
        className="sm:col-span-2 sm:w-auto sm:justify-self-end xl:col-span-1"
        disabled={!hasFilters}
        onClick={() => onChange({})}
      >
        <X className="h-4 w-4" aria-hidden="true" />
        Clear filters
      </Button>
    </Card>
  )
}
