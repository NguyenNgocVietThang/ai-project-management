import { api } from '@/services/api'
import type { PaginatedResponse } from '@/types/common.types'
import type {
  AuditEvent,
  Project,
  ProjectCreate,
  ProjectDetail,
  ProjectListParams,
  ProjectMember,
  ProjectMemberCreate,
  ProjectUpdate,
  RoleSummary,
  UserSummary,
} from '@/types/project.types'

export const projectService = {
  async list(params: ProjectListParams = {}): Promise<PaginatedResponse<Project>> {
    const { data } = await api.get<PaginatedResponse<Project>>('/projects/', { params })
    return data
  },

  async get(id: number): Promise<ProjectDetail> {
    const { data } = await api.get<ProjectDetail>(`/projects/${id}`)
    return data
  },

  async create(body: ProjectCreate): Promise<Project> {
    const { data } = await api.post<Project>('/projects/', body)
    return data
  },

  async update(id: number, body: ProjectUpdate): Promise<Project> {
    const { data } = await api.patch<Project>(`/projects/${id}`, body)
    return data
  },

  async remove(id: number): Promise<void> {
    await api.delete(`/projects/${id}`)
  },

  async members(id: number): Promise<ProjectMember[]> {
    const { data } = await api.get<ProjectMember[]>(`/projects/${id}/members`)
    return data
  },

  async addMember(id: number, body: ProjectMemberCreate): Promise<ProjectMember> {
    const { data } = await api.post<ProjectMember>(`/projects/${id}/members`, body)
    return data
  },

  async removeMember(id: number, userId: number): Promise<void> {
    await api.delete(`/projects/${id}/members/${userId}`)
  },

  async activity(id: number): Promise<AuditEvent[]> {
    const { data } = await api.get<AuditEvent[]>(`/projects/${id}/activity`, {
      params: { limit: 10 },
    })
    return data
  },

  async searchUsers(query: string): Promise<UserSummary[]> {
    const { data } = await api.get<UserSummary[]>('/users/search', { params: { q: query } })
    return data
  },

  async assignableRoles(): Promise<RoleSummary[]> {
    const { data } = await api.get<RoleSummary[]>('/roles/', {
      params: { project_assignable: true },
    })
    return data
  },
}
