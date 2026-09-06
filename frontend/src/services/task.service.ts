import { api } from '@/services/api'
import type { PaginatedResponse } from '@/types/common.types'
import type {
  Assignment,
  AssignmentCreate,
  Dependency,
  ResourceWarning,
  Subtask,
  SubtaskCreate,
  Task,
  TaskCreate,
  TaskDetail,
  TaskListParams,
  TaskStatus,
  TaskUpdate,
  Worklog,
  WorklogCreate,
  WorklogProjectSummary,
} from '@/types/task.types'

export const taskService = {
  async list(projectId: number, params: TaskListParams = {}) {
    const { data } = await api.get<PaginatedResponse<Task>>(`/projects/${projectId}/tasks`, {
      params,
      paramsSerializer: { indexes: null },
    })
    return data
  },
  async get(id: number) { return (await api.get<TaskDetail>(`/tasks/${id}`)).data },
  async create(projectId: number, body: TaskCreate) { return (await api.post<Task>(`/projects/${projectId}/tasks`, body)).data },
  async update(id: number, body: TaskUpdate) { return (await api.patch<Task>(`/tasks/${id}`, body)).data },
  async changeStatus(id: number, status: TaskStatus) { return (await api.post<Task>(`/tasks/${id}/status`, { status })).data },
  async remove(id: number) { await api.delete(`/tasks/${id}`) },
  async bulk(projectId: number, taskIds: number[], body: Partial<Pick<Task, 'status' | 'priority' | 'phase_id' | 'sprint_id'>>) {
    return (await api.patch<Task[]>(`/projects/${projectId}/tasks/bulk`, { task_ids: taskIds, ...body })).data
  },
  async createSubtask(taskId: number, body: SubtaskCreate) { return (await api.post<Subtask>(`/tasks/${taskId}/subtasks`, body)).data },
  async updateSubtask(id: number, body: Partial<SubtaskCreate>) { return (await api.patch<Subtask>(`/subtasks/${id}`, body)).data },
  async removeSubtask(id: number) { await api.delete(`/subtasks/${id}`) },
  async dependencies(projectId: number) { return (await api.get<Dependency[]>(`/projects/${projectId}/dependencies`)).data },
  async addDependency(taskId: number, body: { depends_on_task_id: number; dependency_type: string; lag_days: number }) {
    return (await api.post<Dependency>(`/tasks/${taskId}/dependencies`, body)).data
  },
  async removeDependency(id: number) { await api.delete(`/dependencies/${id}`) },
  async assign(taskId: number, body: AssignmentCreate) {
    return (await api.post<{ assignment: Assignment; warnings: ResourceWarning[] }>(`/tasks/${taskId}/assignments`, body)).data
  },
  async unassign(id: number) { await api.delete(`/assignments/${id}`) },
  async worklogs(taskId: number) { return (await api.get<Worklog[]>(`/tasks/${taskId}/worklogs`)).data },
  async addWorklog(taskId: number, body: WorklogCreate) { return (await api.post<Worklog>(`/tasks/${taskId}/worklogs`, body)).data },
  async removeWorklog(id: number) { await api.delete(`/worklogs/${id}`) },
  async startTimer(taskId: number) { return (await api.post<Worklog>(`/tasks/${taskId}/worklogs/start`)).data },
  async stopTimer(id: number) { return (await api.post<Worklog>(`/worklogs/${id}/stop`)).data },
  /** Timesheet toan du an. Endpoint nay da ton tai o backend tu dau nhung chua
   *  he duoc frontend goi - khong co man hinh nao xem duoc gio da ghi. */
  async projectWorklogs(projectId: number, params?: { user_id?: number; start_date?: string; end_date?: string }) {
    return (await api.get<WorklogProjectSummary>(`/projects/${projectId}/worklogs`, { params })).data
  },
  async myAssignments(params?: { limit?: number; offset?: number }) {
    return (await api.get<Assignment[]>('/users/me/assignments', { params })).data
  },
  /** Canh bao qua tai nhan su. Cung vay: endpoint co san, chua co giao dien. */
  async resourceLeveling(projectId: number, params?: { start_date?: string; end_date?: string }) {
    return (await api.get<ResourceWarning[]>(`/resource-leveling/${projectId}`, { params })).data
  },
  async activeTimer() { return (await api.get<Worklog | null>('/users/me/worklogs/active')).data },
}
