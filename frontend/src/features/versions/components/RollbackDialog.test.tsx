import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NextIntlClientProvider } from 'next-intl'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { ProjectVersion, RollbackResult, VersionDiff } from '@/features/versions/types'
import { RollbackDialog } from './RollbackDialog'

// Khóa i18n `versions` tối thiểu cho dialog (EN), không phụ thuộc messages/*.json.
const messages = {
  versions: {
    comparing: 'Comparing…',
    compareError: 'Could not compare versions.',
    summary: '{added} added, {removed} removed, {changed} changed',
    noDifferences: 'No differences.',
    truncatedNotice: 'The comparison is large.',
    groupTruncated: 'More items not shown.',
    emptyValue: '(empty)',
    changeValue: '{old} -> {new}',
    dependencyLabel: '{predecessor} -> {successor}',
    lagDays: 'lag {days} d',
    kind: { added: 'Added', removed: 'Removed', changed: 'Changed' },
    entities: {
      phases: 'Phases', sprints: 'Sprints', epics: 'Epics', milestones: 'Milestones',
      tasks: 'Tasks', dependencies: 'Dependencies',
    },
    rollbackTitle: 'Restore version v{number}?',
    rollbackDescription: 'Current plan is saved as a version first, so you can undo this restore.',
    rollbackChangesHeading: 'Changes since v{number} that will be undone:',
    rollbackConfirm: 'Restore to v{number}',
    rollbackCancel: 'Cancel',
    rollbackClose: 'Close',
    rollbackDone: 'Restored. New version v{number} created ({changes} changes).',
    rollbackWarnings: '{count, plural, one {# warning} other {# warnings}}',
    warningAssigneeNotMember: 'Task {task}: previous assignee is no longer a project member, left unassigned.',
    rollbackError: 'Could not restore this version.',
  },
}

const mocks = vi.hoisted(() => ({ useVersionDiff: vi.fn(), useRollbackVersion: vi.fn() }))
vi.mock('@/features/versions/hooks/useVersions', () => ({
  useVersionDiff: mocks.useVersionDiff,
  useRollbackVersion: mocks.useRollbackVersion,
}))

const version: ProjectVersion = {
  id: 3, project_id: 7, version_number: 2, label: 'Plan', description: null, is_baseline: true,
  kind: 'manual_baseline', change_request_id: null, created_by_id: 1, created_at: '2026-10-01T10:00:00Z',
  schema_version: 1, counts: {},
}
const emptyGroup = { added: [], removed: [], changed: [], truncated: false }
const zero = { added: 0, removed: 0, changed: 0 }
const diff: VersionDiff = {
  project_id: 7, base: version, target: null, target_is_current: true, truncated: false,
  entities: {
    phases: emptyGroup, sprints: emptyGroup, epics: emptyGroup, milestones: emptyGroup, dependencies: emptyGroup,
    tasks: { added: [{ id: 9, name: 'Task added later' }], removed: [], changed: [], truncated: false },
  },
  summary: {
    by_entity: { phases: zero, sprints: zero, epics: zero, milestones: zero, dependencies: zero, tasks: { added: 1, removed: 0, changed: 0 } },
    total: { added: 1, removed: 0, changed: 0 },
  },
}

function renderDialog(rollbackState: Record<string, unknown> = {}) {
  const mutate = vi.fn()
  const onClose = vi.fn()
  mocks.useVersionDiff.mockReturnValue({ isLoading: false, isError: false, data: diff })
  mocks.useRollbackVersion.mockReturnValue({ mutate, isPending: false, isError: false, data: undefined, ...rollbackState })
  render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <RollbackDialog projectId={7} version={version} onClose={onClose} />
    </NextIntlClientProvider>
  )
  return { mutate, onClose }
}

beforeEach(() => vi.clearAllMocks())

describe('RollbackDialog', () => {
  it('hiển thị diff phiên bản so với hiện trạng trước khi xác nhận', () => {
    renderDialog()
    expect(mocks.useVersionDiff).toHaveBeenCalledWith(7, 3, 'current')
    expect(screen.getByRole('dialog', { name: 'Restore version v2?' })).toBeInTheDocument()
    expect(screen.getByText('Changes since v2 that will be undone:')).toBeInTheDocument()
    expect(screen.getByText('Task added later')).toBeInTheDocument()
  })

  it('xác nhận gọi rollback với id phiên bản; hủy thì đóng mà không gọi', async () => {
    const { mutate, onClose } = renderDialog()
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(onClose).toHaveBeenCalled()
    expect(mutate).not.toHaveBeenCalled()
    await userEvent.click(screen.getByRole('button', { name: 'Restore to v2' }))
    expect(mutate).toHaveBeenCalledWith(3)
  })

  it('hiển thị lỗi khi rollback thất bại', () => {
    renderDialog({ isError: true, error: new Error('boom') })
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('sau khi xong hiển thị tóm tắt và cảnh báo', () => {
    const data: RollbackResult = {
      version: { ...version, id: 10, version_number: 6, is_baseline: false, kind: 'rollback' },
      summary: {
        pre_rollback_version_id: 9, target_version_id: 3, target_version_number: 2,
        changes: { deleted: 1 }, total_changes: 4, id_map: {},
        warnings: [{ code: 'assignee_not_member', task_id: 1, task_name: 'Design', assignee_id: 5 }],
      },
    }
    renderDialog({ data })
    expect(screen.getByRole('status')).toHaveTextContent('Restored. New version v6 created (4 changes).')
    expect(screen.getByText('1 warning')).toBeInTheDocument()
    expect(screen.getByText(/Task Design: previous assignee/)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Restore to v2' })).not.toBeInTheDocument()
  })
})
