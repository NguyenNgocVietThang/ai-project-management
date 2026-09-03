'use client'

/**
 * MyTasksList – các task được giao cho người dùng hiện tại (chưa hoàn thành)
 * Hiển thị tối đa 20 task, kèm badge quá hạn và mức nghiêm trọng
 */
import Link from 'next/link'
import { AlertTriangle, Flag } from 'lucide-react'
import { formatDate, formatStatus } from '@/lib/format'
import type { MyTaskItem } from '@/features/dashboard/types/dashboard.types'

const PRIORITY_COLOR: Record<string, string> = {
  critical: 'text-red-500',
  high: 'text-orange-500',
  medium: 'text-amber-500',
  low: 'text-blue-400',
}

const STATUS_DOT: Record<string, string> = {
  todo: 'bg-gray-400',
  in_progress: 'bg-blue-500',
  in_review: 'bg-amber-500',
  done: 'bg-emerald-500',
  blocked: 'bg-red-500',
}

function TaskRow({ task }: { task: MyTaskItem }) {
  return (
    <Link
      href={`/projects/${task.project_id}/tasks`}
      className="group flex items-start gap-3 rounded-lg p-2.5 transition-colors hover:bg-accent"
    >
      <span
        className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${STATUS_DOT[task.status] ?? 'bg-gray-400'}`}
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground group-hover:text-primary">
          {task.name}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">{task.project_name}</p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        <span
          className={`flex items-center gap-0.5 text-xs font-medium ${PRIORITY_COLOR[task.priority] ?? 'text-muted-foreground'}`}
        >
          <Flag className="h-3 w-3" />
          {formatStatus(task.priority)}
        </span>
        {task.is_overdue && (
          <span className="flex items-center gap-0.5 text-xs font-medium text-red-500">
            <AlertTriangle className="h-3 w-3" />
            {task.due_date ? formatDate(task.due_date) : 'Overdue'}
          </span>
        )}
        {!task.is_overdue && task.due_date && (
          <span className="text-xs text-muted-foreground">{formatDate(task.due_date)}</span>
        )}
      </div>
    </Link>
  )
}

interface MyTasksListProps {
  tasks: MyTaskItem[]
}

export function MyTasksList({ tasks }: MyTasksListProps) {
  return (
    <section className="rounded-xl border bg-card">
      <div className="flex items-center justify-between border-b px-5 py-3.5">
        <h2 className="text-sm font-semibold">My Tasks</h2>
        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
          {tasks.length}
        </span>
      </div>
      <div className="divide-y">
        {tasks.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted-foreground">
            No pending tasks assigned to you 🎉
          </p>
        ) : (
          tasks.map((t) => (
            <div key={t.id} className="px-3 py-1">
              <TaskRow task={t} />
            </div>
          ))
        )}
      </div>
    </section>
  )
}
