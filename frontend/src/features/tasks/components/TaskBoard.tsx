'use client'

import { useLocale, useTranslations } from 'next-intl'
import { closestCenter, DndContext, type DragEndEvent, KeyboardSensor, PointerSensor, useDraggable, useDroppable, useSensor, useSensors } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { CalendarDays, GripVertical } from 'lucide-react'
import { Badge, type BadgeTone } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { formatDate } from '@/lib/format'
import { cn } from '@/lib/utils'
import { TASK_STATUSES } from '../hooks/useTaskListState'
import type { Task, TaskPriority, TaskStatus } from '@/types/task.types'

const STATUS_TONE: Record<TaskStatus, BadgeTone> = { TODO: 'neutral', IN_PROGRESS: 'primary', IN_REVIEW: 'info', DONE: 'success', BLOCKED: 'danger' }
const PRIORITY_TONE: Record<TaskPriority, BadgeTone> = { LOW: 'neutral', MEDIUM: 'info', HIGH: 'warning', CRITICAL: 'danger' }

export function TaskBoard({ tasks, onOpen, onStatusChange }: { tasks: Task[]; onOpen: (id: number) => void; onStatusChange: (id: number, status: TaskStatus) => void }) {
  const t = useTranslations('tasks')
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }), useSensor(KeyboardSensor))
  const dragEnd = ({ active, over }: DragEndEvent) => {
    const task = tasks.find(item => item.id === Number(active.id))
    const status = over?.id as TaskStatus
    if (task?.capabilities.can_change_status && TASK_STATUSES.includes(status) && task.status !== status) onStatusChange(task.id, status)
  }
  return <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={dragEnd}>
    <div aria-label={t('board')} className="min-w-0 space-y-3">
      <p className="text-caption text-muted-foreground">{t('boardLoaded', { count: tasks.length })}</p>
      <div className="grid min-w-0 grid-cols-1 items-start gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {TASK_STATUSES.map(status => <KanbanColumn key={status} status={status} tasks={tasks.filter(task => task.status === status)} onOpen={onOpen} />)}
      </div>
    </div>
  </DndContext>
}

function KanbanColumn({ status, tasks, onOpen }: { status: TaskStatus; tasks: Task[]; onOpen: (id: number) => void }) {
  const t = useTranslations('tasks')
  const { setNodeRef, isOver } = useDroppable({ id: status })
  return <section ref={setNodeRef} aria-label={t(`statuses.${status}`)} className={cn('min-w-0 rounded-lg border bg-muted p-2 transition-colors motion-reduce:transition-none', isOver && 'border-primary bg-accent')}>
    <header className="mb-2 flex min-h-8 items-start justify-between gap-2 px-1">
      <h3 className="min-w-0 break-words text-body-sm font-semibold"><Badge tone={STATUS_TONE[status]} dot className="h-auto min-h-6 max-w-full whitespace-normal py-0.5">{t(`statuses.${status}`)}</Badge></h3>
      <span aria-label={t('laneLoaded', { count: tasks.length })} className="pt-1 text-caption font-medium tabular-nums text-muted-foreground">{tasks.length}</span>
    </header>
    <div className="space-y-2">{tasks.map(task => <TaskCard key={task.id} task={task} onOpen={onOpen} />)}</div>
    {tasks.length === 0 && <p className="rounded-md border border-dashed px-3 py-5 text-caption text-muted-foreground">{t('emptyLane')}</p>}
  </section>
}

function TaskCard({ task, onOpen }: { task: Task; onOpen: (id: number) => void }) {
  const locale = useLocale()
  const t = useTranslations('tasks')
  const tc = useTranslations('common')
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, isDragging } = useDraggable({ id: task.id, disabled: !task.capabilities.can_change_status })
  return <Card ref={setNodeRef} as="article" style={{ transform: CSS.Translate.toString(transform) }} className={cn('min-w-0 p-3 sm:p-3', isDragging && 'relative z-20 opacity-80 shadow-soft-lg transition-none')}>
    <div className="mb-2 flex flex-wrap items-center justify-between gap-1">
      <Badge tone={PRIORITY_TONE[task.priority]} size="sm">{t(`priorities.${task.priority}`)}</Badge>
      {task.capabilities.can_change_status && <button ref={setActivatorNodeRef} type="button" aria-label={t('move', { name: task.name })} className="-my-1 flex h-9 w-9 shrink-0 touch-none cursor-grab items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:cursor-grabbing" {...listeners} {...attributes}><GripVertical className="h-4 w-4" aria-hidden="true" /></button>}
    </div>
    <button type="button" className="block w-full min-w-0 rounded text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" onClick={() => onOpen(task.id)}>
      <strong className="block text-body-sm font-semibold [overflow-wrap:anywhere]">{task.name}</strong>
      {(task.is_critical || task.labels.length > 0) && <span className="mt-2 flex min-w-0 flex-wrap gap-1">
        {task.is_critical && <Badge tone="danger" size="sm">{t('critical')}</Badge>}
        {task.labels.slice(0, 2).map(label => <Badge key={label} size="sm" className="h-auto max-w-full whitespace-normal [overflow-wrap:anywhere]">{label}</Badge>)}
      </span>}
      <span className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-caption text-muted-foreground">
        <span className="flex items-center gap-1 tabular-nums"><CalendarDays className="h-3 w-3 shrink-0" aria-hidden="true" />{task.due_date ? formatDate(task.due_date, locale) : t('noDate')}</span>
        <span className="min-w-0 [overflow-wrap:anywhere]">{task.primary_assignee?.full_name || tc('unassigned')}</span>
      </span>
    </button>
  </Card>
}
