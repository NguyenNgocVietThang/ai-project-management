'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { taskService } from '@/services/task.service'
import type { AssignmentCreate, SubtaskCreate, Task, TaskCreate, TaskListParams, TaskStatus, TaskUpdate, WorklogCreate } from '@/types/task.types'
import { projectKeys } from '@/features/projects/hooks/useProjects'

export const taskKeys = {
  all: ['tasks'] as const,
  /** Mọi thứ thuộc về một dự án. Khoá invalidation nên dừng ở đây chứ không phải
   *  ở `all`: invalidate `all` sẽ refetch danh sách task của MỌI dự án với MỌI bộ
   *  lọc, nên một lần tick subtask cũng kéo theo refetch toàn bộ. */
  project: (projectId: number) => [...taskKeys.all, 'project', projectId] as const,
  list: (projectId: number, params: TaskListParams) => [...taskKeys.project(projectId), 'list', params] as const,
  detail: (id: number) => [...taskKeys.all, 'detail', id] as const,
  dependencies: (projectId: number) => [...taskKeys.project(projectId), 'dependencies'] as const,
  worklogs: (id: number) => [...taskKeys.detail(id), 'worklogs'] as const,
  activeTimer: ['worklogs', 'active'] as const,
}

export function useTasks(projectId: number, params: TaskListParams) {
  return useQuery({ queryKey: taskKeys.list(projectId, params), queryFn: () => taskService.list(projectId, params), enabled: Number.isFinite(projectId) })
}
export function useTask(id: number | null) {
  return useQuery({ queryKey: taskKeys.detail(id || 0), queryFn: () => taskService.get(id!), enabled: id !== null })
}
export function useDependencies(projectId: number) {
  return useQuery({ queryKey: taskKeys.dependencies(projectId), queryFn: () => taskService.dependencies(projectId), enabled: Number.isFinite(projectId) })
}
export function useWorklogs(taskId: number | null) {
  return useQuery({ queryKey: taskKeys.worklogs(taskId || 0), queryFn: () => taskService.worklogs(taskId!), enabled: taskId !== null })
}
export function useActiveTimer() {
  return useQuery({
    queryKey: taskKeys.activeTimer,
    queryFn: taskService.activeTimer,
    // Chỉ poll khi thực sự có timer đang chạy. Poll vô điều kiện mỗi 60 giây là
    // một request nền cho mọi người dùng đang mở trang, hầu hết chẳng có timer nào.
    refetchInterval: (query) => (query.state.data ? 60_000 : false),
  })
}

function useInvalidate() {
  const client = useQueryClient()
  return (projectId: number, taskId?: number) => {
    client.invalidateQueries({ queryKey: taskKeys.project(projectId) })
    client.invalidateQueries({ queryKey: projectKeys.detail(projectId) })
    if (taskId) client.invalidateQueries({ queryKey: taskKeys.detail(taskId) })
  }
}

export function useTaskActions(projectId: number) {
  const client = useQueryClient()
  const invalidate = useInvalidate()
  const create = useMutation({ mutationFn: (body: TaskCreate) => taskService.create(projectId, body), onSuccess: () => invalidate(projectId) })
  const update = useMutation({ mutationFn: ({ id, body }: { id: number; body: TaskUpdate }) => taskService.update(id, body), onSuccess: (_, variables) => invalidate(projectId, variables.id) })
  const changeStatus = useMutation({
    mutationFn: ({ id, status }: { id: number; status: TaskStatus }) => taskService.changeStatus(id, status),
    onMutate: async ({ id, status }) => {
      await client.cancelQueries({ queryKey: taskKeys.project(projectId) })
      const snapshots = client.getQueriesData({ queryKey: taskKeys.project(projectId) })
      client.setQueriesData<{ items: Task[] }>({ queryKey: taskKeys.project(projectId) }, current => current ? { ...current, items: current.items?.map(item => item.id === id ? { ...item, status } : item) } : current)
      return { snapshots }
    },
    onError: (_error, _variables, context) => context?.snapshots.forEach(([key, value]) => client.setQueryData(key, value)),
    onSettled: (_data, _error, variables) => invalidate(projectId, variables.id),
  })
  const remove = useMutation({ mutationFn: taskService.remove, onSuccess: () => invalidate(projectId) })
  const bulk = useMutation({ mutationFn: ({ taskIds, body }: { taskIds: number[]; body: Partial<Pick<Task, 'status' | 'priority' | 'phase_id' | 'sprint_id'>> }) => taskService.bulk(projectId, taskIds, body), onSuccess: () => invalidate(projectId) })
  const createSubtask = useMutation({ mutationFn: ({ taskId, body }: { taskId: number; body: SubtaskCreate }) => taskService.createSubtask(taskId, body), onSuccess: (_, variables) => invalidate(projectId, variables.taskId) })
  const updateSubtask = useMutation({ mutationFn: ({ id, body }: { id: number; body: Partial<SubtaskCreate>; taskId: number }) => taskService.updateSubtask(id, body), onSuccess: (_, variables) => invalidate(projectId, variables.taskId) })
  const removeSubtask = useMutation({ mutationFn: ({ id }: { id: number; taskId: number }) => taskService.removeSubtask(id), onSuccess: (_, variables) => invalidate(projectId, variables.taskId) })
  const addDependency = useMutation({ mutationFn: ({ taskId, body }: { taskId: number; body: { depends_on_task_id: number; dependency_type: string; lag_days: number } }) => taskService.addDependency(taskId, body), onSuccess: (_, variables) => invalidate(projectId, variables.taskId) })
  const removeDependency = useMutation({ mutationFn: taskService.removeDependency, onSuccess: () => invalidate(projectId) })
  const assign = useMutation({ mutationFn: ({ taskId, body }: { taskId: number; body: AssignmentCreate }) => taskService.assign(taskId, body), onSuccess: (_, variables) => invalidate(projectId, variables.taskId) })
  const unassign = useMutation({ mutationFn: taskService.unassign, onSuccess: () => invalidate(projectId) })
  const addWorklog = useMutation({ mutationFn: ({ taskId, body }: { taskId: number; body: WorklogCreate }) => taskService.addWorklog(taskId, body), onSuccess: (_, variables) => invalidate(projectId, variables.taskId) })
  const removeWorklog = useMutation({ mutationFn: ({ id }: { id: number; taskId: number }) => taskService.removeWorklog(id), onSuccess: (_, variables) => invalidate(projectId, variables.taskId) })
  const startTimer = useMutation({ mutationFn: taskService.startTimer, onSuccess: (_, taskId) => { invalidate(projectId, taskId); client.invalidateQueries({ queryKey: taskKeys.activeTimer }) } })
  const stopTimer = useMutation({ mutationFn: taskService.stopTimer, onSuccess: () => { invalidate(projectId); client.invalidateQueries({ queryKey: taskKeys.activeTimer }) } })
  return { create, update, changeStatus, remove, bulk, createSubtask, updateSubtask, removeSubtask, addDependency, removeDependency, assign, unassign, addWorklog, removeWorklog, startTimer, stopTimer }
}
