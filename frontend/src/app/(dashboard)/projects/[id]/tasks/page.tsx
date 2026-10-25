'use client'

import { useLocale, useTranslations } from 'next-intl'

import { useMemo, useState } from 'react'
import { useNumericParam } from '@/hooks/useNumericParam'
import { LayoutGrid, List, ListTodo, Plus, Rows, Timer } from 'lucide-react'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { Modal } from '@/components/common/Modal'
import { EmptyState, ErrorState } from '@/components/common/PageState'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import { Select } from '@/components/ui/Select'
import { Skeleton, SkeletonRegion } from '@/components/ui/Skeleton'
import { TaskDrawer } from '@/features/tasks/components/TaskDrawer'
import { useActiveTimer, useTaskActions, useTasks } from '@/features/tasks/hooks/useTasks'
import { useWBS } from '@/features/wbs/hooks/useWBS'
import { useTaskListState, type TaskView as ViewMode } from '@/features/tasks/hooks/useTaskListState'
import { TaskFilters } from '@/features/tasks/components/TaskFilters'
import { TaskBoard } from '@/features/tasks/components/TaskBoard'
import { GroupedTaskList } from '@/features/tasks/components/GroupedTaskList'
import { SprintWorkspace } from '@/features/tasks/components/SprintWorkspace'
import { useProjectMembers } from '@/features/projects/hooks/useProjectMembers'
import { useProjectDetail } from '@/features/projects/hooks/useProjects'
import { useApiErrorMessage } from '@/i18n/useApiErrorMessage'
import type { TaskCreate, TaskPriority } from '@/types/task.types'

export default function TasksPage() {
  const locale = useLocale()
  const getApiErrorMessage = useApiErrorMessage()
  const projectId = useNumericParam()
  const { filters, queryFilters, view, setFilter, changePage: navigatePage, changeView: navigateView, reset } = useTaskListState()
  const [selectedTask, setSelectedTask] = useState<number | null>(null)
  const [creating, setCreating] = useState(false)
  // Ô tìm kiếm cập nhật ngay, nhưng chỉ giá trị đã debounce mới vào query key.
  const query = useTasks(projectId, queryFilters)
  const wbs = useWBS(projectId)
  const timer = useActiveTimer()
  const project = useProjectDetail(projectId)
  const members = useProjectMembers(projectId)
  const actions = useTaskActions(projectId)
  const t = useTranslations('tasks')
  const tCommon = useTranslations('common')
  const tasks = query.data?.items || []
  const canCreate = Boolean(project.data?.capabilities.can_update || project.data?.current_user_role === 'BA')
  const sprints = useMemo(() => [...(wbs.data?.phases.flatMap(phase => phase.sprints) || []), ...(wbs.data?.unphased_sprints || [])], [wbs.data])
  const changePage = (page: number) => { navigatePage(page) }
  const changeView = (mode: ViewMode) => { navigateView(mode) }
  const page = query.data?.page || 1
  const totalPages = query.data?.total_pages || 1
  return <div className="min-w-0 space-y-3 rounded-xl border bg-card p-3 sm:p-4">
    {/* ===== Đồng hồ bấm giờ đang chạy ===== */}
    {timer.data && <div role="status" className="flex flex-col gap-3 rounded-xl border border-primary/30 bg-accent p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <span className="relative flex h-3 w-3" aria-hidden="true"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75 motion-reduce:animate-none" /><span className="relative inline-flex h-3 w-3 rounded-full bg-primary" /></span>
        <div><strong className="text-body-sm font-semibold text-accent-foreground">{t('timerRunning')}</strong><p className="text-caption tabular-nums text-muted-foreground">{t('timerStarted', { time: timer.data.start_time ? new Date(timer.data.start_time).toLocaleTimeString(locale) : '', id: timer.data.task_id })}</p></div>
      </div>
      <Button fullWidth={false} variant="outline" onClick={() => actions.stopTimer.mutate(timer.data!.id)}><Timer className="h-4 w-4" aria-hidden="true" />{t('stopTimer')}</Button>
    </div>}

    {/* ===== Tiêu đề khu vực + chuyển chế độ xem + CTA tạo task ===== */}
    <header className="flex flex-wrap items-center justify-between gap-2">
      <h2 className="text-h4">{t('title')}</h2>
      <div className="flex max-w-full flex-wrap items-center gap-2">
        <SegmentedControl<ViewMode>
          className="max-w-full flex-wrap [&_button]:px-2 sm:[&_button]:px-3"
          label={t('title')}
          value={view}
          onChange={changeView}
          options={[{ value: 'board', label: t('board'), icon: LayoutGrid }, { value: 'list', label: t('list'), icon: List }, { value: 'sprint', label: t('sprint'), icon: Rows }]}
        />
        {canCreate && <Button size="sm" fullWidth={false} onClick={() => setCreating(true)}><Plus className="h-4 w-4" aria-hidden="true" />{t('newTask')}</Button>}
      </div>
    </header>

    <TaskFilters filters={filters} onChange={(key, value) => { setFilter(key, value) }} onReset={() => { reset() }} phases={wbs.data?.phases || []} sprints={sprints} epics={wbs.data?.epics || []} members={members.data?.map(member => ({ id: member.user.id, name: member.user.full_name })) || []} total={query.data?.total} />

    {query.isLoading || wbs.isLoading ? <SkeletonRegion label={t('loading')} className="space-y-3"><Skeleton className="h-28" /><Skeleton className="h-28" /></SkeletonRegion> : query.isError ? <ErrorState message={getApiErrorMessage(query.error)} onRetry={() => void query.refetch()} retryLabel={t('retry')} /> : <>
        {tasks.length === 0 && view === 'list' && <EmptyState icon={ListTodo} title={t('noTasks')} description={t('noMatch')} action={Object.entries(filters).some(([key, value]) => !['page', 'page_size'].includes(key) && value !== undefined && value !== '' && (!Array.isArray(value) || value.length)) ? <Button fullWidth={false} variant="outline" onClick={reset}>{t('resetFilters')}</Button> : canCreate ? <Button fullWidth={false} onClick={() => setCreating(true)}><Plus className="h-4 w-4" aria-hidden="true" />{t('newTask')}</Button> : undefined} />}
        {view === 'board' && <TaskBoard tasks={tasks} onOpen={setSelectedTask} onStatusChange={(id, status) => actions.changeStatus.mutate({ id, status })} />}
        {view === 'list' && <GroupedTaskList key={`${projectId}:${JSON.stringify(filters)}`} tasks={tasks} phases={wbs.data?.phases || []} onOpen={setSelectedTask} onBulkStatus={(ids, status, onSuccess) => {
          const taskIds = tasks.filter(task => ids.includes(task.id) && task.capabilities.can_update && task.capabilities.can_change_status).map(task => task.id)
          if (taskIds.length) actions.bulk.mutate({ taskIds, body: { status } }, { onSuccess })
        }} />}
        {view === 'sprint' && <SprintWorkspace key={projectId} tasks={tasks} sprints={sprints} onOpen={setSelectedTask} />}
      </>}

    <div className="flex flex-wrap items-center justify-between gap-3 text-caption text-muted-foreground">
      <p className="tabular-nums">{query.data && t('showingPage', { count: tasks.length, total: query.data.total })}</p>
      {(view === 'list' || totalPages > 1) && <nav aria-label={t('pagination')} className="flex flex-wrap items-center gap-2">
        <Button size="sm" fullWidth={false} variant="outline" disabled={page <= 1} onClick={() => changePage(Math.max(1, page - 1))}>{tCommon('previous')}</Button>
        <span className="tabular-nums">{tCommon('page', { page, total: Math.max(1, totalPages) })}</span>
        <Button size="sm" fullWidth={false} variant="outline" disabled={page >= totalPages} onClick={() => changePage(page + 1)}>{tCommon('next')}</Button>
      </nav>}
    </div>
    <TaskCreateModal open={creating} onClose={() => setCreating(false)} onSubmit={body => actions.create.mutate(body, { onSuccess: task => { setCreating(false); setSelectedTask(task.id) } })} loading={actions.create.isPending} phases={wbs.data?.phases || []} sprints={sprints} epics={wbs.data?.epics || []} />
    <TaskDrawer projectId={projectId} taskId={selectedTask} allTasks={tasks} onClose={() => setSelectedTask(null)} />
  </div>
}

function TaskCreateModal({ open, onClose, onSubmit, loading, phases, sprints, epics }: { open: boolean; onClose: () => void; onSubmit: (body: TaskCreate) => void; loading: boolean; phases: Array<{ id: number; name: string }>; sprints: Array<{ id: number; name: string; phase_id: number | null }>; epics: Array<{ id: number; name: string }> }) { const t = useTranslations('tasks'); const [form, setForm] = useState({ name: '', description: '', priority: 'MEDIUM' as TaskPriority, phase_id: '', sprint_id: '', epic_id: '', start_date: '', due_date: '', estimated_hours: '', labels: '' }); const submit = (e: React.FormEvent) => { e.preventDefault(); onSubmit({ name: form.name, description: form.description || null, priority: form.priority, phase_id: form.phase_id ? Number(form.phase_id) : null, sprint_id: form.sprint_id ? Number(form.sprint_id) : null, epic_id: form.epic_id ? Number(form.epic_id) : null, start_date: form.start_date || null, due_date: form.due_date || null, estimated_hours: form.estimated_hours ? Number(form.estimated_hours) : null, labels: form.labels.split(',').map(item => item.trim()).filter(Boolean) }) }; return <Modal open={open} onClose={onClose} title={t('newTask')} className="h-[calc(100dvh-1.5rem)] sm:h-auto" footer={<div className="flex justify-end gap-2"><Button type="button" variant="outline" fullWidth={false} onClick={onClose}>{t('cancel')}</Button><Button form="task-create-form" type="submit" fullWidth={false} isLoading={loading}>{t('createTask')}</Button></div>}><form id="task-create-form" className="space-y-4" onSubmit={submit}><Field label={t('name')}><Input required minLength={3} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></Field><Field label={t('description')}><textarea className="min-h-24 w-full rounded-lg border border-input bg-card p-3 text-body shadow-xs transition-[border-color,box-shadow] duration-150 hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:text-body-sm" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></Field><div className="grid gap-4 sm:grid-cols-2"><Field label={t('priority')}><Select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value as TaskPriority })}>{['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map(value => <option key={value} value={value}>{t(`priorities.${value}`)}</option>)}</Select></Field><Field label={t('estimateHours')}><Input type="number" min="0" step="0.5" value={form.estimated_hours} onChange={e => setForm({ ...form, estimated_hours: e.target.value })} /></Field></div><div className="grid gap-4 sm:grid-cols-3"><Field label={t('phase')}><Select value={form.phase_id} onChange={e => setForm({ ...form, phase_id: e.target.value, sprint_id: '' })}><option value="">{t('unphased')}</option>{phases.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</Select></Field><Field label={t('sprint')}><Select value={form.sprint_id} onChange={e => setForm({ ...form, sprint_id: e.target.value })}><option value="">{t('backlog')}</option>{sprints.filter(item => !form.phase_id || item.phase_id === Number(form.phase_id)).map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</Select></Field><Field label={t('epic')}><Select value={form.epic_id} onChange={e => setForm({ ...form, epic_id: e.target.value })}><option value="">{t('noEpic')}</option>{epics.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</Select></Field></div><div className="grid gap-4 sm:grid-cols-2"><Field label={t('startDate')}><Input type="date" value={form.start_date} onChange={e => setForm({ ...form, start_date: e.target.value })} /></Field><Field label={t('due')}><Input type="date" min={form.start_date} value={form.due_date} onChange={e => setForm({ ...form, due_date: e.target.value })} /></Field></div><Field label={t('labels')}><Input placeholder={t('labelsFilter')} value={form.labels} onChange={e => setForm({ ...form, labels: e.target.value })} /></Field></form></Modal> }

function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="block space-y-2 text-body-sm font-medium"><span>{label}</span>{children}</label> }
