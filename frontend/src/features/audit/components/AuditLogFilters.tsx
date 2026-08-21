'use client'

import { Input } from '@/components/common/Input'
import { Label } from '@/components/common/Label'
import type { AuditLogListParams } from '@/types/admin.types'

export function AuditLogFilters({
  value,
  onChange,
}: {
  value: AuditLogListParams
  onChange: (value: AuditLogListParams) => void
}) {
  return (
    <div className="grid gap-3 rounded-xl border bg-card p-4 sm:grid-cols-4">
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
    </div>
  )
}
