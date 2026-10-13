'use client'
import { useTranslations } from 'next-intl'

import { useMemo, useState } from 'react'
import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { useNumericParam } from '@/hooks/useNumericParam'
import { CalendarDays, GripVertical, LayoutGrid, List, ListTodo, Plus, Rows, Timer } from 'lucide-react'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { Modal } from '@/components/common/Modal'
import { EmptyState, ErrorState } from '@/components/common/PageState'
import { Badge, type BadgeTone } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { SectionHeader } from '@/components/ui/PageHeader'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import { Select } from '@/components/ui/Select'
import { Skeleton, SkeletonRegion } from '@/components/ui/Skeleton'
import { cn } from '@/lib/utils'
import { TaskDrawer } from '@/features/tasks/components/TaskDrawer'
import { useActiveTimer, useTaskActions, useTasks } from '@/features/tasks/hooks/useTasks'
import { useWBS } from '@/features/wbs/hooks/useWBS'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { useProjectMembers } from '@/features/projects/hooks/useProjectMembers'
import { useProjectDetail } from '@/features/projects/hooks/useProjects'
import { formatDate, formatStatus } from '@/lib/format'
import { getApiErrorMessage } from '@/types/api.types'
import type { Task, TaskCreate, TaskListParams, TaskPriority, TaskStatus } from '@/types/task.types'

const STATUSES: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE', 'BLOCKED']
type ViewMode = 'board' | 'list' | 'sprint'

// Tông Badge ngữ nghĩa cho trạng thái và độ ưu tiên (không hard-code bảng màu).
const STATUS_TONE: Record<TaskStatus, BadgeTone> = { TODO: 'neutral', IN_PROGRESS: 'primary', IN_REVIEW: 'info', DONE: 'success', BLOCKED: 'danger' }
const PRIORITY_TONE: Record<TaskPriority, BadgeTone> = { LOW: 'neutral', MEDIUM: 'info', HIGH: 'warning', CRITICAL: 'danger' }

export default function TasksPage() {
  const projectId = useNumericParam()
  const [view, setView] = useState<ViewMode>('board')
  const [filters, setFilters] = useState<TaskListParams>({ page: 1, page_size: 200 })
  const [labelFilter, setLabelFilter] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const debouncedSearch = useDebouncedValue(searchInput)
  const [selectedTask, setSelectedTask] = useState<number | null>(null)
  const [creating, setCreating] = useState(false)
  const [selected, setSelected] = useState<number[]>([])
  // Ô tìm kiếm cập nhật ngay, nhưng chỉ giá trị đã debounce mới vào query key.
  const query = useTasks(projectId, useMemo(() => ({ ...filters, search: debouncedSearch || undefined }), [filters, debouncedSearch]))
  const wbs = useWBS(projectId)
  const timer = useActiveTimer()
  const project = useProjectDetail(projectId)
  const members = useProjectMembers(projectId)
  const actions = useTaskActions(projectId)
  const t = useTranslations('tasks')
  const tCommon = useTranslations('common')
  // KeyboardSensor để kéo-thả dùng được bằng bàn phím: Space nhấc thẻ, mũi tên di chuyển, Space đặt
  // xuống.
  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor))
  const tasks = query.data?.items || []
  const canCreate = Boolean(project.data?.capabilities.can_update || project.data?.current_user_role === 'BA')
  const sprints = useMemo(() => [...(wbs.data?.phases.flatMap(phase => phase.sprints) || []), ...(wbs.data?.unphased_sprints || [])], [wbs.data])
  const setFilter = (key: keyof TaskListParams, value: unknown) => {
    setSelected([])
    setFilters(current => ({ ...current, [key]: value || undefined, page: 1 }))
  }
  const changePage = (page: number) => {
    setSelected([])
    setFilters(current => ({ ...current, page }))
  }
  const changeView = (mode: ViewMode) => {
    setView(mode)
    setSelected([])
    setFilters(current => ({ ...current, page: 1, page_size: mode === 'list' ? 25 : 200 }))
  }
  const dragEnd = ({ active, over }: DragEndEvent) => { if (!over) return; const status = over.id as TaskStatus; const task = tasks.find(item => item.id === Number(active.id)); if (task && STATUSES.includes(status) && task.status !== status) actions.changeStatus.mutate({ id: task.id, status }) }
  if (query.isLoading || wbs.isLoading) return <TasksSkeleton />
  if (query.isError) return <ErrorState message={getApiErrorMessage(query.error)} onRetry={() => void query.refetch()} />
  const page = query.data?.page || 1
  const totalPages = query.data?.total_pages || 1
  return <div className="space-y-6">
    {/* ===== Đồng hồ bấm giờ đang chạy ===== */}
    {timer.data && <div role="status" className="flex flex-col gap-3 rounded-xl border border-primary/30 bg-accent p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <span className="relative flex h-3 w-3" aria-hidden="true"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75 motion-reduce:animate-none" /><span className="relative inline-flex h-3 w-3 rounded-full bg-primary" /></span>
        <div><strong className="text-body-sm font-semibold text-accent-foreground">{t('timerRunning')}</strong><p className="text-caption tabular-nums text-muted-foreground">{t('timerStarted', { time: timer.data.start_time ? new Date(timer.data.start_time).toLocaleTimeString() : '', id: timer.data.task_id })}</p></div>
      </div>
      <Button fullWidth={false} variant="outline" onClick={() => actions.stopTimer.mutate(timer.data!.id)}><Timer className="h-4 w-4" aria-hidden="true" />{t('stopTimer')}</Button>
    </div>}

    {/* ===== Tiêu đề khu vực + chuyển chế độ xem + CTA tạo task ===== */}
    <SectionHeader
      title={t('title')}
      description={t('subtitle')}
      className="mb-0 flex-col lg:flex-row lg:items-end"
      action={<div className="flex flex-wrap items-center gap-3">
        <SegmentedControl<ViewMode>
          label={t('title')}
          value={view}
          onChange={changeView}
          options={[{ value: 'board', label: t('board'), icon: LayoutGrid }, { value: 'list', label: t('list'), icon: List }, { value: 'sprint', label: t('sprint'), icon: Rows }]}
        />
        {canCreate && <Button fullWidth={false} onClick={() => setCreating(true)}><Plus className="h-4 w-4" aria-hidden="true" />{t('newTask')}</Button>}
      </div>}
    />

    {/* ===== Bộ lọc ===== */}
    <Card as="section" aria-label={tCommon('filter')} className="grid gap-3 p-4 sm:grid-cols-2 sm:p-4 lg:grid-cols-4 xl:grid-cols-5">
      <Input aria-label={t('searchPlaceholder')} placeholder={t('searchPlaceholder')} value={searchInput} onChange={e => { setSelected([]); setSearchInput(e.target.value) }} />
      <FilterSelect label={t('statusFilter')} value={filters.status || ''} onChange={value => setFilter('status', value)} options={STATUSES.map(status => ({ value: status, label: formatStatus(status) }))} placeholder={t('allStatuses')} />
      <FilterSelect label={t('priorityFilter')} value={filters.priority || ''} onChange={value => setFilter('priority', value)} options={['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map(priority => ({ value: priority, label: formatStatus(priority) }))} placeholder={t('allPriorities')} />
      <FilterSelect label={t('phaseFilter')} value={filters.phase_id?.toString() || ''} onChange={value => setFilter('phase_id', value ? Number(value) : undefined)} options={wbs.data?.phases.map(item => ({ value: item.id.toString(), label: item.name })) || []} placeholder={t('allPhases')} />
      <FilterSelect label={t('sprintFilter')} value={filters.sprint_id?.toString() || ''} onChange={value => setFilter('sprint_id', value ? Number(value) : undefined)} options={sprints.map(item => ({ value: item.id.toString(), label: item.name }))} placeholder={t('allSprints')} />
      <FilterSelect label={t('epicFilter')} value={filters.epic_id?.toString() || ''} onChange={value => setFilter('epic_id', value ? Number(value) : undefined)} options={wbs.data?.epics.map(item => ({ value: item.id.toString(), label: item.name })) || []} placeholder={t('allEpics')} />
      <FilterSelect label={t('assigneeFilter')} value={filters.assignee_id?.toString() || ''} onChange={value => setFilter('assignee_id', value ? Number(value) : undefined)} options={members.data?.map(member => ({ value: member.user.id.toString(), label: member.user.full_name })) || []} placeholder={t('allAssignees')} />
      <Input aria-label={t('labelsFilter')} placeholder={t('labelsFilter')} value={labelFilter} onChange={e => { const value = e.target.value; setLabelFilter(value); setFilter('labels', value.split(',').map(label => label.trim()).filter(Boolean)) }} />
      <Input aria-label={t('dueFrom')} type="date" title={t('dueFrom')} value={filters.due_date_from || ''} onChange={e => setFilter('due_date_from', e.target.value)} />
      <Input aria-label={t('dueTo')} type="date" title={t('dueTo')} value={filters.due_date_to || ''} onChange={e => setFilter('due_date_to', e.target.value)} />
    </Card>

    {tasks.length === 0
      ? <EmptyState icon={ListTodo} title={t('noTasks')} description={t('noMatch')} action={canCreate ? <Button fullWidth={false} onClick={() => setCreating(true)}><Plus className="h-4 w-4" aria-hidden="true" />{t('newTask')}</Button> : undefined} />
      : <>
        {/* Bảng Kanban cuộn ngang trong khung riêng, trang không bị cuộn ngang trên mobile. */}
        {view === 'board' && <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={dragEnd}><div className="-mx-1 overflow-x-auto px-1 pb-3"><div className="grid w-max min-w-full grid-cols-[repeat(5,minmax(16rem,1fr))] gap-4">{STATUSES.map(status => <KanbanColumn key={status} status={status} tasks={tasks.filter(task => task.status === status)} onOpen={setSelectedTask} />)}</div></div></DndContext>}
        {view === 'list' && <TaskTable tasks={tasks} selected={selected} setSelected={setSelected} onOpen={setSelectedTask} onBulkStatus={status => actions.bulk.mutate({ taskIds: selected, body: { status } }, { onSuccess: () => setSelected([]) })} />}
        {view === 'sprint' && <SprintView tasks={tasks} sprints={sprints} onOpen={setSelectedTask} />}
      </>}

    <div className="flex flex-wrap items-center justify-between gap-3 text-caption text-muted-foreground">
      <p className="tabular-nums">{t('showing', { count: tasks.length, total: query.data?.total || 0 })}</p>
      {view === 'list' && <div className="flex items-center gap-2">
        <Button size="sm" fullWidth={false} variant="outline" disabled={page <= 1} onClick={() => changePage(Math.max(1, page - 1))}>{tCommon('previous')}</Button>
        <span className="tabular-nums">{tCommon('page', { page, total: Math.max(1, totalPages) })}</span>
        <Button size="sm" fullWidth={false} variant="outline" disabled={page >= totalPages} onClick={() => changePage(page + 1)}>{tCommon('next')}</Button>
      </div>}
    </div>
    <TaskCreateModal open={creating} onClose={() => setCreating(false)} onSubmit={body => actions.create.mutate(body, { onSuccess: task => { setCreating(false); setSelectedTask(task.id) } })} loading={actions.create.isPending} phases={wbs.data?.phases || []} sprints={sprints} epics={wbs.data?.epics || []} />
    <TaskDrawer projectId={projectId} taskId={selectedTask} allTasks={tasks} onClose={() => setSelectedTask(null)} />
  </div>
}

/** Một làn Kanban: vùng thả (droppable) theo trạng thái, nền muted nhạt, viền primary khi kéo qua. */
function KanbanColumn({ status, tasks, onOpen }: { status: TaskStatus; tasks: Task[]; onOpen: (id: number) => void }) {
  const { setNodeRef, isOver } = useDroppable({ id: status })
  return <section ref={setNodeRef} aria-label={formatStatus(status)} className={cn('min-h-[420px] rounded-xl bg-muted/40 p-3 ring-1 ring-inset ring-transparent transition-[background-color,box-shadow] duration-200', isOver && 'bg-accent ring-2 ring-primary/40')}>
    <div className="mb-3 flex items-center justify-between gap-2 px-1">
      <Badge tone={STATUS_TONE[status]} dot>{formatStatus(status)}</Badge>
      <span className="text-caption font-medium tabular-nums text-muted-foreground">{tasks.length}</span>
    </div>
    <div className="space-y-3">{tasks.map(task => <TaskCard key={task.id} task={task} onOpen={onOpen} />)}</div>
  </section>
}

/** Thẻ task kéo được (dnd-kit). Tắt transition khi đang kéo để thẻ bám sát con trỏ. */
function TaskCard({ task, onOpen }: { task: Task; onOpen: (id: number) => void }) {
  const t = useTranslations('tasks')
  const tCommon = useTranslations('common')
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: task.id, disabled: !task.capabilities.can_change_status })
  return <Card ref={setNodeRef} as="article" interactive style={{ transform: CSS.Translate.toString(transform) }} className={cn('p-4 sm:p-4', isDragging && 'z-20 opacity-80 shadow-soft-lg transition-none')}>
    <div className="flex items-start gap-2">
      {task.capabilities.can_change_status && <button type="button" aria-label={t('move', { name: task.name })} className="-ml-1 flex h-8 w-6 shrink-0 cursor-grab items-center justify-center rounded text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:cursor-grabbing" {...listeners} {...attributes}><GripVertical className="h-4 w-4" aria-hidden="true" /></button>}
      <button type="button" className="min-w-0 flex-1 rounded text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" onClick={() => onOpen(task.id)}>
        <strong className="line-clamp-2 text-body-sm font-semibold">{task.name}</strong>
        <div className="mt-2 flex flex-wrap gap-1">
          {task.is_critical && <Badge tone="danger" size="sm" dot>{t('critical')}</Badge>}
          <Badge tone={PRIORITY_TONE[task.priority]} size="sm">{formatStatus(task.priority)}</Badge>
          {task.labels.slice(0, 2).map(label => <Badge key={label} tone="neutral" size="sm">{label}</Badge>)}
        </div>
        <div className="mt-3 flex items-center justify-between gap-2 text-caption text-muted-foreground">
          <span className="flex items-center gap-1 tabular-nums"><CalendarDays className="h-3 w-3" aria-hidden="true" />{formatDate(task.due_date)}</span>
          <span className="truncate">{task.primary_assignee?.full_name?.split(' ')[0] || tCommon('unassigned')}</span>
        </div>
      </button>
    </div>
  </Card>
}

/** Chế độ danh sách: bảng trong Card tràn viền, thanh chọn hàng loạt phía trên, tiêu đề cột dính. */
function TaskTable({ tasks, selected, setSelected, onOpen, onBulkStatus }: { tasks: Task[]; selected: number[]; setSelected: (ids: number[]) => void; onOpen: (id: number) => void; onBulkStatus: (status: TaskStatus) => void }) {
  const t = useTranslations('tasks')
  const tCommon = useTranslations('common')
  return <Card flush className="overflow-hidden">
    <div className="flex min-h-14 flex-wrap items-center gap-3 border-b bg-muted/50 px-4 py-2">
      <input type="checkbox" aria-label="Select all tasks" className="h-4 w-4 accent-primary" checked={tasks.length > 0 && selected.length === tasks.length} onChange={e => setSelected(e.target.checked ? tasks.map(task => task.id) : [])} />
      {selected.length > 0 && <>
        <span className="text-body-sm font-medium tabular-nums">{t('selected', { count: selected.length })}</span>
        <Select aria-label={t('setStatus')} wrapperClassName="w-48" className="h-9" defaultValue="" onChange={e => { if (e.target.value) onBulkStatus(e.target.value as TaskStatus); e.target.value = '' }}><option value="">{t('setStatus')}</option>{STATUSES.map(status => <option key={status} value={status}>{formatStatus(status)}</option>)}</Select>
      </>}
    </div>
    <div className="max-h-[70vh] overflow-auto">
      <table className="w-full min-w-[850px] text-body-sm">
        <thead className="sticky top-0 z-10 bg-muted text-left text-caption uppercase text-muted-foreground">
          <tr><th scope="col" className="w-12 px-4 py-3"><span className="sr-only">Select</span></th><th scope="col" className="px-4 py-3 font-medium">Task</th><th scope="col" className="px-4 py-3 font-medium">Status</th><th scope="col" className="px-4 py-3 font-medium">Priority</th><th scope="col" className="px-4 py-3 font-medium">Assignee</th><th scope="col" className="px-4 py-3 font-medium">Due</th><th scope="col" className="px-4 py-3 text-right font-medium">Hours</th></tr>
        </thead>
        <tbody>{tasks.map(task => <tr key={task.id} className={cn('border-t transition-colors hover:bg-muted/40', selected.includes(task.id) && 'bg-accent/60')}>
          <td className="px-4 py-3"><input type="checkbox" aria-label={task.name} className="h-4 w-4 accent-primary" checked={selected.includes(task.id)} onChange={e => setSelected(e.target.checked ? [...selected, task.id] : selected.filter(id => id !== task.id))} /></td>
          <td className="px-4 py-3"><button type="button" className="text-left font-medium transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" onClick={() => onOpen(task.id)}>{task.name}</button></td>
          <td className="px-4 py-3"><Badge tone={STATUS_TONE[task.status]} size="sm" dot>{formatStatus(task.status)}</Badge></td>
          <td className="px-4 py-3"><Badge tone={PRIORITY_TONE[task.priority]} size="sm">{formatStatus(task.priority)}</Badge></td>
          <td className="px-4 py-3">{task.primary_assignee?.full_name || tCommon('unassigned')}</td>
          <td className="whitespace-nowrap px-4 py-3 tabular-nums">{formatDate(task.due_date)}</td>
          <td className="whitespace-nowrap px-4 py-3 text-right tabular-nums">{task.actual_hours.toFixed(1)} / {task.estimated_hours ?? 0}</td>
        </tr>)}</tbody>
      </table>
    </div>
  </Card>
}

/** Chế độ theo sprint: mỗi sprint (và backlog) là một Card chứa danh sách task. */
function SprintView({ tasks, sprints, onOpen }: { tasks: Task[]; sprints: Array<{ id: number; name: string; status: string }>; onOpen: (id: number) => void }) {
  const t = useTranslations('tasks')
  const tCommon = useTranslations('common')
  const groups = [{ id: 0, name: t('backlog'), status: 'UNPLANNED' }, ...sprints]
  return <div className="space-y-4">{groups.map(sprint => {
    const items = tasks.filter(task => sprint.id === 0 ? task.sprint_id === null : task.sprint_id === sprint.id)
    return <Card key={sprint.id} flush as="section" className="overflow-hidden">
      <header className="flex flex-wrap items-center justify-between gap-2 border-b bg-muted/50 px-4 py-3">
        <div className="min-w-0"><h3 className="text-h4">{sprint.name}</h3><p className="text-caption tabular-nums text-muted-foreground">{formatStatus(sprint.status)} · {t('points', { count: items.reduce((sum, task) => sum + (task.story_points || 0), 0) })}</p></div>
        <Badge tone="neutral" size="sm">{t('taskCount', { count: items.length })}</Badge>
      </header>
      <div className="divide-y">
        {items.map(task => <button type="button" key={task.id} className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/40 focus-visible:bg-muted/40 focus-visible:outline-none" onClick={() => onOpen(task.id)}>
          <div className="min-w-0"><strong className="block truncate text-body-sm font-medium">{task.name}</strong><p className="text-caption text-muted-foreground">{task.primary_assignee?.full_name || tCommon('unassigned')}</p></div>
          <Badge tone={STATUS_TONE[task.status]} size="sm" dot>{formatStatus(task.status)}</Badge>
        </button>)}
        {items.length === 0 && <p className="p-4 text-center text-body-sm text-muted-foreground">{t('noTasks')}</p>}
      </div>
    </Card>
  })}</div>
}

/** Khung xương trang task: tiêu đề, thanh lọc và 5 làn Kanban. */
function TasksSkeleton() {
  return <SkeletonRegion label="Loading tasks…" className="space-y-6">
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"><div className="space-y-2"><Skeleton className="h-7 w-32" /><Skeleton className="h-4 w-64 max-w-full" /></div><Skeleton className="h-11 w-72 max-w-full" /></div>
    <Skeleton className="h-36 w-full rounded-xl sm:h-28" />
    <div className="overflow-hidden"><div className="grid w-max min-w-full grid-cols-[repeat(5,minmax(16rem,1fr))] gap-4">
      {[3, 2, 2, 1, 1].map((count, column) => <div key={column} className="space-y-3 rounded-xl bg-muted/40 p-3"><Skeleton className="h-6 w-24 rounded-full" />{Array.from({ length: count }, (_, i) => <Skeleton key={i} className="h-28 rounded-xl bg-card" />)}</div>)}
    </div></div>
  </SkeletonRegion>
}

function TaskCreateModal({ open, onClose, onSubmit, loading, phases, sprints, epics }: { open: boolean; onClose: () => void; onSubmit: (body: TaskCreate) => void; loading: boolean; phases: Array<{ id: number; name: string }>; sprints: Array<{ id: number; name: string; phase_id: number | null }>; epics: Array<{ id: number; name: string }> }) { const [form, setForm] = useState({ name: '', description: '', priority: 'MEDIUM' as TaskPriority, phase_id: '', sprint_id: '', epic_id: '', start_date: '', due_date: '', estimated_hours: '', labels: '' }); const submit = (e: React.FormEvent) => { e.preventDefault(); onSubmit({ name: form.name, description: form.description || null, priority: form.priority, phase_id: form.phase_id ? Number(form.phase_id) : null, sprint_id: form.sprint_id ? Number(form.sprint_id) : null, epic_id: form.epic_id ? Number(form.epic_id) : null, start_date: form.start_date || null, due_date: form.due_date || null, estimated_hours: form.estimated_hours ? Number(form.estimated_hours) : null, labels: form.labels.split(',').map(item => item.trim()).filter(Boolean) }) }; return <Modal open={open} onClose={onClose} title="New task"><form className="space-y-4" onSubmit={submit}><Field label="Name"><Input required minLength={3} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></Field><Field label="Description"><textarea className="min-h-24 w-full rounded-lg border border-input bg-card p-3 text-body shadow-xs transition-[border-color,box-shadow] duration-150 hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:text-body-sm" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></Field><div className="grid gap-4 sm:grid-cols-2"><Field label="Priority"><Select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value as TaskPriority })}>{['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map(value => <option key={value}>{value}</option>)}</Select></Field><Field label="Estimate (hours)"><Input type="number" min="0" step="0.5" value={form.estimated_hours} onChange={e => setForm({ ...form, estimated_hours: e.target.value })} /></Field></div><div className="grid gap-4 sm:grid-cols-3"><Field label="Phase"><Select value={form.phase_id} onChange={e => setForm({ ...form, phase_id: e.target.value, sprint_id: '' })}><option value="">Unphased</option>{phases.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</Select></Field><Field label="Sprint"><Select value={form.sprint_id} onChange={e => setForm({ ...form, sprint_id: e.target.value })}><option value="">Backlog</option>{sprints.filter(item => !form.phase_id || item.phase_id === Number(form.phase_id)).map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</Select></Field><Field label="Epic"><Select value={form.epic_id} onChange={e => setForm({ ...form, epic_id: e.target.value })}><option value="">No epic</option>{epics.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</Select></Field></div><div className="grid gap-4 sm:grid-cols-2"><Field label="Start date"><Input type="date" value={form.start_date} onChange={e => setForm({ ...form, start_date: e.target.value })} /></Field><Field label="Due date"><Input type="date" min={form.start_date} value={form.due_date} onChange={e => setForm({ ...form, due_date: e.target.value })} /></Field></div><Field label="Labels"><Input placeholder="frontend, urgent" value={form.labels} onChange={e => setForm({ ...form, labels: e.target.value })} /></Field><div className="flex justify-end gap-2"><Button type="button" variant="outline" fullWidth={false} onClick={onClose}>Cancel</Button><Button type="submit" fullWidth={false} isLoading={loading}>Create task</Button></div></form></Modal> }

/** Select lọc có tuỳ chọn "tất cả" ở đầu; dựa trên Select primitive. */
function FilterSelect({ value, onChange, options, placeholder, label }: { value: string; onChange: (value: string) => void; options: Array<{ value: string; label: string }>; placeholder: string; label?: string }) { return <Select aria-label={label || placeholder} value={value} onChange={e => onChange(e.target.value)}><option value="">{placeholder}</option>{options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</Select> }
function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="block space-y-2 text-body-sm font-medium"><span>{label}</span>{children}</label> }
