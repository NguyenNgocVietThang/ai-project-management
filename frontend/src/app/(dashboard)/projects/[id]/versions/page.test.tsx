import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NextIntlClientProvider } from 'next-intl'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { ProjectVersion, VersionDiff } from '@/features/versions/types'
import VersionsPage from './page'

// Bản sao khóa i18n `versions` (EN) để test không phụ thuộc messages/*.json.
const messages = {
  "versions": {
    "title": "Versions",
    "subtitle": "Snapshots of the project plan. Pick two versions to see what changed.",
    "loading": "Loading versions…",
    "loadError": "Could not load versions.",
    "baselineLabel": "Baseline name",
    "baselinePlaceholder": "e.g. Approved plan Q4",
    "createBaseline": "Create baseline",
    "createError": "Could not create baseline.",
    "emptyTitle": "No versions yet",
    "emptyDescription": "Versions are created when a baseline is saved or a change request is approved.",
    "listTitle": "Version history",
    "selectHint": "Choose a base version and a version to compare with.",
    "versionNumber": "v{number}",
    "baseline": "Baseline",
    "relatedCr": "CR #{id}",
    "setBase": "Base",
    "setTarget": "Compare",
    "setBaseFor": "Use v{number} as base",
    "setTargetFor": "Compare with v{number}",
    "compareCurrent": "Compare with current plan",
    "compareTitle": "Comparison",
    "pickTwo": "Select a base version and a version (or the current plan) to compare.",
    "pickDifferent": "Choose two different versions.",
    "comparing": "Comparing…",
    "compareError": "Could not compare versions.",
    "comparingLabel": "Changes from v{base} to {target}",
    "current": "current plan",
    "summary": "{added} added, {removed} removed, {changed} changed",
    "noDifferences": "No differences.",
    "truncatedNotice": "The comparison is large. Only the first 500 items of each group are shown; counts include everything.",
    "groupTruncated": "More items not shown.",
    "emptyValue": "(empty)",
    "changeValue": "{old} -> {new}",
    "dependencyLabel": "{predecessor} -> {successor}",
    "lagDays": "lag {days} d",
    "kind": {
      "added": "Added",
      "removed": "Removed",
      "changed": "Changed"
    },
    "kinds": {
      "manual_baseline": "Manual baseline",
      "change_request_approved": "Approved change request",
      "pre_rollback": "Before rollback",
      "rollback": "Rollback",
      "unknown": "Snapshot"
    },
    "entities": {
      "phases": "Phases",
      "sprints": "Sprints",
      "epics": "Epics",
      "milestones": "Milestones",
      "tasks": "Tasks",
      "dependencies": "Dependencies"
    }
  }
}

const mocks = vi.hoisted(() => ({
  useProjectDetail: vi.fn(),
  useProjectVersions: vi.fn(),
  useVersionDiff: vi.fn(),
  useCreateBaseline: vi.fn(),
}))
vi.mock('next/navigation', () => ({ useParams: () => ({ id: '7' }), notFound: vi.fn() }))
vi.mock('@/features/projects/hooks/useProjects', () => ({ useProjectDetail: mocks.useProjectDetail }))
vi.mock('@/features/versions/hooks/useVersions', () => ({
  useProjectVersions: mocks.useProjectVersions,
  useVersionDiff: mocks.useVersionDiff,
  useCreateBaseline: mocks.useCreateBaseline,
}))

function version(id: number, over: Partial<ProjectVersion> = {}): ProjectVersion {
  return {
    id, project_id: 7, version_number: id, label: `Label ${id}`, description: null, is_baseline: false,
    kind: 'manual_baseline', change_request_id: null, created_by_id: 1, created_at: '2026-10-01T10:00:00Z',
    schema_version: 1, counts: {}, snapshot: null, ...over,
  }
}

const emptyGroup = { added: [], removed: [], changed: [], truncated: false }
const zero = { added: 0, removed: 0, changed: 0 }
const diff: VersionDiff = {
  project_id: 7, base: version(1), target: version(2), target_is_current: false, truncated: false,
  entities: {
    phases: emptyGroup, sprints: emptyGroup, epics: emptyGroup, milestones: emptyGroup,
    tasks: {
      added: [{ id: 9, name: 'New task' }],
      removed: [{ id: 3, name: 'Old task' }],
      changed: [{ id: 1, name: 'Design', changes: [{ field: 'due_date', old: '2026-01-10', new: '2026-01-20' }] }],
      truncated: false,
    },
    dependencies: {
      added: [], removed: [],
      changed: [{ id: 5, predecessor_id: 1, successor_id: 2, predecessor_name: 'Design', successor_name: 'Build', dependency_type: 'FS', lag_days: 2, changes: [{ field: 'lag_days', old: 0, new: 2 }] }],
      truncated: false,
    },
  },
  summary: {
    by_entity: { phases: zero, sprints: zero, epics: zero, milestones: zero, tasks: { added: 1, removed: 1, changed: 1 }, dependencies: { added: 0, removed: 0, changed: 1 } },
    total: { added: 1, removed: 1, changed: 2 },
  },
}

function setup({ canUpdate = false, diffData = undefined as VersionDiff | undefined } = {}) {
  mocks.useProjectDetail.mockReturnValue({ data: { capabilities: { can_update: canUpdate } } })
  mocks.useProjectVersions.mockReturnValue({ isLoading: false, isError: false, data: [version(2, { is_baseline: true, change_request_id: 4, kind: 'change_request_approved' }), version(1)] })
  mocks.useVersionDiff.mockReturnValue({ isLoading: false, isError: false, data: diffData })
  mocks.useCreateBaseline.mockReturnValue({ mutateAsync: vi.fn(), isPending: false, isError: false })
  return render(<NextIntlClientProvider locale="en" messages={messages}><VersionsPage /></NextIntlClientProvider>)
}

beforeEach(() => vi.clearAllMocks())

describe('trang phiên bản', () => {
  it('liệt kê phiên bản với baseline, CR liên quan và loại', () => {
    setup()
    expect(screen.getByText('Label 2')).toBeInTheDocument()
    expect(screen.getByText('Baseline')).toBeInTheDocument()
    expect(screen.getByText(/CR #4/)).toBeInTheDocument()
    expect(screen.getByText(/Approved change request/)).toBeInTheDocument()
  })

  it('ẩn form tạo baseline nếu không phải PM', () => {
    setup()
    expect(screen.queryByRole('button', { name: 'Create baseline' })).not.toBeInTheDocument()
  })

  it('PM thấy form tạo baseline và gửi được', async () => {
    setup({ canUpdate: true })
    const mutateAsync = vi.fn().mockResolvedValue({})
    mocks.useCreateBaseline.mockReturnValue({ mutateAsync, isPending: false, isError: false })
    await userEvent.type(screen.getByLabelText('Baseline name'), 'Plan Q4')
    await userEvent.click(screen.getByRole('button', { name: 'Create baseline' }))
    expect(mutateAsync).toHaveBeenCalledWith({ label: 'Plan Q4', description: null })
  })

  it('chọn gốc và đích rồi gọi hook diff với đúng tham số', async () => {
    setup()
    expect(screen.getByText(messages.versions.pickTwo)).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Use v1 as base' }))
    await userEvent.click(screen.getByRole('button', { name: 'Compare with v2' }))
    expect(mocks.useVersionDiff).toHaveBeenLastCalledWith(7, 1, 2)
    await userEvent.click(screen.getByRole('button', { name: 'Compare with current plan' }))
    expect(mocks.useVersionDiff).toHaveBeenLastCalledWith(7, 1, 'current')
  })

  it('hiển thị diff nhóm theo thực thể với nhãn chữ, không chỉ màu', async () => {
    setup({ diffData: diff })
    await userEvent.click(screen.getByRole('button', { name: 'Use v1 as base' }))
    await userEvent.click(screen.getByRole('button', { name: 'Compare with v2' }))
    expect(screen.getByRole('heading', { name: 'Tasks' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Dependencies' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Phases' })).not.toBeInTheDocument()
    expect(screen.getByText('New task')).toBeInTheDocument()
    expect(screen.getAllByText('Added')).toHaveLength(1)
    expect(screen.getAllByText('Removed')).toHaveLength(1)
    expect(screen.getAllByText('Changed')).toHaveLength(2)
    expect(screen.getByText('2026-01-10 -> 2026-01-20')).toBeInTheDocument()
    expect(screen.getByText(/Design -> Build \(FS, lag 2 d\)/)).toBeInTheDocument()
    expect(screen.getByText('1 added, 1 removed, 2 changed')).toBeInTheDocument()
  })
})
