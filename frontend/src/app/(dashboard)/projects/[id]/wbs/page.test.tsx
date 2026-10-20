import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createTranslator, NextIntlClientProvider } from 'next-intl'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import en from '../../../../../../messages/en.json'
import viMessages from '../../../../../../messages/vi.json'
import WBSPage from './page'

const mocks = vi.hoisted(() => ({ useWBS: vi.fn(), usePhaseImpact: vi.fn(), actions: {} as Record<string, { mutate: ReturnType<typeof vi.fn>; isPending: boolean }> }))
vi.mock('next/navigation', () => ({ useParams: () => ({ id: '7' }), notFound: vi.fn() }))
vi.mock('@/features/projects/hooks/useProjects', () => ({ useProjectDetail: () => ({ data: { current_user_role: 'PM' } }) }))
vi.mock('@/features/wbs/hooks/useWBS', () => ({ useWBS: mocks.useWBS, usePhaseImpact: mocks.usePhaseImpact, useWBSActions: () => mocks.actions }))

const phase = { id: 1, project_id: 7, name: 'Sprint 1 (20/10–31/10)', description: null, status: 'PLANNED', order_index: 0, start_date: null, end_date: null, created_at: '', sprints: [], tasks: [], task_count: 1 }
const tree = { project_id: 7, phases: [phase], epics: [{ id: 4, name: 'Epic A', status: 'OPEN', color: null }], milestones: [{ id: 5, name: 'Release', status: 'PENDING', due_date: null }], unphased_sprints: [], unphased_tasks: [], unphased_task_count: 0, includes_tasks: false }
const impact = { sprint_count: 1, task_count: 2, subtask_count: 3, external_dependency_count: 4, assignment_count: 5, worklog_count: 6 }

beforeEach(() => {
  mocks.useWBS.mockReturnValue({ data: tree, isLoading: false, isError: false, refetch: vi.fn() })
  mocks.usePhaseImpact.mockReturnValue({ data: impact, isLoading: false, isError: false, refetch: vi.fn() })
  mocks.actions = Object.fromEntries(['createPhase', 'updatePhase', 'deletePhase', 'createSprint', 'updateSprint', 'deleteSprint', 'startSprint', 'completeSprint', 'createEpic', 'updateEpic', 'deleteEpic', 'createMilestone', 'updateMilestone', 'deleteMilestone', 'completeMilestone'].map(name => [name, { mutate: vi.fn(), isPending: false }]))
})

describe.each([{ locale: 'en', messages: en }, { locale: 'vi', messages: viMessages }])('WBS localization ($locale)', ({ locale, messages }) => {
  function setup() {
    const onError = vi.fn()
    const t = createTranslator({ locale, messages, namespace: 'wbs', onError })
    render(<NextIntlClientProvider locale={locale} messages={messages} timeZone="UTC" onError={onError}><WBSPage /></NextIntlClientProvider>)
    return { t, onError }
  }

  it('formats real ICU plurals, missing dates and statuses without changing named phases', () => {
    mocks.useWBS.mockReturnValue({ data: { ...tree, phases: [0, 1, 2].map(count => ({ ...phase, id: count + 1, task_count: count })) }, isLoading: false })
    const { t, onError } = setup()
    for (const count of [0, 1, 2]) expect(screen.getByText(new RegExp(t('taskCount', { count })))).toBeInTheDocument()
    expect(screen.getAllByText(new RegExp(t('dateNotSet'))).length).toBeGreaterThan(0)
    expect(screen.getAllByText(t('statuses.PLANNED'))).toHaveLength(3)
    expect(screen.getAllByText(phase.name)).toHaveLength(3)
    if (locale === 'en') expect(t('taskCount', { count: 1 })).toBe('1 task')
    expect(onError).not.toHaveBeenCalled()
  })

  it.each([
    ['addPhase', 'phase', ['name', 'description', 'startDate', 'endDate']],
    ['addSprint', 'sprint', ['name', 'goal', 'startDate', 'endDate']],
    ['addEpic', 'epic', ['name', 'description', 'color']],
    ['addMilestone', 'milestone', ['name', 'description', 'dueDate']],
  ] as const)('labels the %s editor', async (action, kind, fields) => {
    const user = userEvent.setup()
    const { t, onError } = setup()
    if (action === 'addSprint') await user.click(screen.getByLabelText(t('actionsFor', { name: phase.name })))
    if (action === 'addEpic' || action === 'addMilestone') await user.click(screen.getByText(t('createOther')))
    await user.click(screen.getByRole('button', { name: t(action) }))
    const dialog = within(screen.getByRole('dialog', { name: t(`editor.create.${kind}`) }))
    for (const field of fields) expect(dialog.getByLabelText(t(`fields.${field}`))).toBeInTheDocument()
    await user.click(dialog.getByRole('button', { name: t('cancel') }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(onError).not.toHaveBeenCalled()
  })

  it('submits through the footer with unchanged phase data', async () => {
    const user = userEvent.setup()
    const { t, onError } = setup()
    await user.click(screen.getByRole('button', { name: t('addPhase') }))
    const dialog = within(screen.getByRole('dialog', { name: t('editor.create.phase') }))
    await user.type(dialog.getByLabelText(t('fields.name')), phase.name)
    await user.click(dialog.getByRole('button', { name: t('save') }))
    expect(mocks.actions.createPhase.mutate).toHaveBeenCalledWith(expect.objectContaining({ name: phase.name, start_date: null, end_date: null }), expect.any(Object))
    expect(mocks.actions.createSprint.mutate).not.toHaveBeenCalled()
    expect(onError).not.toHaveBeenCalled()
  })

  it('keeps status API values while translating labels and protects deletion strategies', async () => {
    const user = userEvent.setup()
    const { t, onError } = setup()
    await user.click(screen.getByLabelText(t('actionsFor', { name: phase.name })))
    await user.click(screen.getByRole('button', { name: t('editPhase') }))
    const editor = within(screen.getByRole('dialog', { name: t('editor.edit.phase') }))
    const status = editor.getByLabelText(t('fields.status'))
    expect(within(status).getByRole('option', { name: t('statuses.ON_HOLD') })).toHaveValue('ON_HOLD')
    await user.click(editor.getByRole('button', { name: t('cancel') }))
    await user.click(screen.getByLabelText(t('actionsFor', { name: phase.name })))
    await user.click(screen.getByRole('button', { name: t('deletePhase') }))
    const dialog = within(screen.getByRole('dialog', { name: t('deleteConfirm', { name: phase.name }) }))
    for (const label of ['sprints', 'tasks', 'subtasks', 'externalLinks', 'assignments', 'worklogs'] as const) expect(dialog.getByText(t(`impact.${label}`))).toBeInTheDocument()
    await user.selectOptions(dialog.getByLabelText(t('impact.strategy')), 'cascade')
    const deleteButton = dialog.getByRole('button', { name: t('deletePhase') })
    expect(deleteButton).toBeDisabled()
    await user.type(dialog.getByLabelText(t('impact.confirmCascade', { name: phase.name })), phase.name)
    expect(deleteButton).toBeEnabled()
    await user.click(deleteButton)
    expect(mocks.actions.deletePhase.mutate).toHaveBeenCalledWith({ id: 1, strategy: 'cascade', targetPhaseId: undefined }, expect.any(Object))
    expect(onError).not.toHaveBeenCalled()
  })

  it('translates page loading and recoverable errors', () => {
    mocks.useWBS.mockReturnValue({ isLoading: true })
    const { t, onError } = setup()
    expect(screen.getByRole('status')).toHaveTextContent(t('loading'))
    expect(onError).not.toHaveBeenCalled()
  })

  it('offers a translated retry when deletion impact fails', async () => {
    const refetch = vi.fn()
    mocks.usePhaseImpact.mockReturnValue({ isError: true, isLoading: false, refetch })
    const { t, onError } = setup()
    await userEvent.click(screen.getByLabelText(t('actionsFor', { name: phase.name })))
    await userEvent.click(screen.getByRole('button', { name: t('deletePhase') }))
    const dialog = within(screen.getByRole('dialog'))
    expect(dialog.getByRole('alert')).toHaveTextContent(t('impact.error'))
    await userEvent.click(dialog.getByRole('button', { name: t('retry') }))
    expect(refetch).toHaveBeenCalledOnce()
    expect(onError).not.toHaveBeenCalled()
  })
})
