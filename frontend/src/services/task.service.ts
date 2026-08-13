import { api } from '@/services/api'
import type { PaginatedResponse, MessageResponse } from '@/types/common.types'
import type { Task, TaskCreate, TaskListParams, TaskUpdate } from '@/types/task.types'

export const taskService = {
  async list(params: TaskListParams = {}): Promise<PaginatedResponse<Task>> {
    const { data } = await api.get<PaginatedResponse<Task>>('/tasks/', { params })
    return data
  },

  async get(id: number): Promise<Task> {
    const { data } = await api.get<Task>(`/tasks/${id}`)
    return data
  },

  async create(body: TaskCreate): Promise<Task> {
    const { data } = await api.post<Task>('/tasks/', body)
    return data
  },

  async update(id: number, body: TaskUpdate): Promise<Task> {
    const { data } = await api.put<Task>(`/tasks/${id}`, body)
    return data
  },

  async remove(id: number): Promise<MessageResponse> {
    const { data } = await api.delete<MessageResponse>(`/tasks/${id}`)
    return data
  },
}
