/** Kiểu dữ liệu phiên bản dự án và kết quả so sánh (V1, V2). */
export type VersionEntity = 'phases' | 'sprints' | 'epics' | 'milestones' | 'tasks' | 'dependencies'

export const VERSION_ENTITIES: VersionEntity[] = ['phases', 'sprints', 'epics', 'milestones', 'tasks', 'dependencies']

export interface ProjectVersion {
  id: number
  project_id: number
  version_number: number
  label: string
  description: string | null
  is_baseline: boolean
  kind: string | null
  change_request_id: number | null
  created_by_id: number
  created_at: string
  schema_version: number | null
  counts: Partial<Record<VersionEntity, number>>
  snapshot?: Record<string, unknown> | null
}

export interface FieldChange {
  field: string
  old: unknown
  new: unknown
}

/** Bản tóm tắt gọn của một thực thể; dependency có thêm thông tin task trước/sau. */
export interface DiffItem {
  id: number | null
  name?: string | null
  predecessor_id?: number
  successor_id?: number
  predecessor_name?: string | null
  successor_name?: string | null
  dependency_type?: string | null
  lag_days?: number | null
  changes?: FieldChange[]
}

export interface EntityDiff {
  added: DiffItem[]
  removed: DiffItem[]
  changed: DiffItem[]
  truncated: boolean
}

export interface DiffCounts {
  added: number
  removed: number
  changed: number
}

export interface VersionDiff {
  project_id: number
  base: ProjectVersion
  target: ProjectVersion | null
  target_is_current: boolean
  entities: Record<VersionEntity, EntityDiff>
  summary: { by_entity: Record<VersionEntity, DiffCounts>; total: DiffCounts }
  truncated: boolean
}

/** `current` = so với hiện trạng dự án. */
export type DiffTarget = number | 'current'
