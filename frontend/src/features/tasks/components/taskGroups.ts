import type { Task } from '@/types/task.types'

export interface TaskGroup {
  key: string
  id: number | null
  name?: string
  status?: string
  kind: 'known' | 'unassigned' | 'unknown'
  tasks: Task[]
}

/** Keep every loaded task, including references absent from the current WBS. */
function groupTasks(tasks: Task[], records: Array<{ id: number; name: string; status?: string }>, field: 'phase_id' | 'sprint_id'): TaskGroup[] {
  const groups: TaskGroup[] = records.map(record => ({ ...record, key: `${field}:${record.id}`, kind: 'known', tasks: [] }))
  const byId = new Map(groups.map(group => [group.id, group]))
  const unassigned: TaskGroup = { key: `${field}:none`, id: null, kind: 'unassigned', tasks: [] }
  byId.set(null, unassigned)
  for (const task of tasks) {
    const id = task[field]
    let group = byId.get(id)
    if (!group) {
      group = { key: `${field}:${id}`, id, kind: 'unknown', tasks: [] }
      byId.set(id, group)
      groups.push(group)
    }
    group.tasks.push(task)
  }
  return field === 'sprint_id' ? [unassigned, ...groups] : [...groups, unassigned]
}

export const groupTasksByPhase = (tasks: Task[], phases: Array<{ id: number; name: string }>) => groupTasks(tasks, phases, 'phase_id')
export const groupTasksBySprint = (tasks: Task[], sprints: Array<{ id: number; name: string; status: string }>) => groupTasks(tasks, sprints, 'sprint_id')
export const completedTasks = (tasks: Task[]) => tasks.filter(task => task.status === 'DONE').length
