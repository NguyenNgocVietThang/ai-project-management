import { api } from '@/services/api'
import type { ChangeRequest } from '@/types/change-request.types'

export interface ChangeRequestCreateInput {
  title: string
  description: string
  reason?: string
  impact_description?: string
}

export const changeRequestService = {
  async list(projectId: number): Promise<ChangeRequest[]> {
    const { data } = await api.get<ChangeRequest[]>(`/projects/${projectId}/change-requests`)
    return data
  },

  async create(projectId: number, body: ChangeRequestCreateInput): Promise<ChangeRequest> {
    const { data } = await api.post<ChangeRequest>(`/projects/${projectId}/change-requests`, body)
    return data
  },

  async get(id: number): Promise<ChangeRequest> {
    const { data } = await api.get<ChangeRequest>(`/change-requests/${id}`)
    return data
  },

  async submit(id: number): Promise<ChangeRequest> {
    const { data } = await api.post<ChangeRequest>(`/change-requests/${id}/submit`)
    return data
  },
}
