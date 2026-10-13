import { api } from '@/services/api'
import type { DiffTarget, ProjectVersion, RollbackResult, VersionDiff } from '@/features/versions/types'

export const versionService = {
  async list(projectId: number): Promise<ProjectVersion[]> {
    const { data } = await api.get<ProjectVersion[]>(`/projects/${projectId}/versions`)
    return data
  },
  async createBaseline(projectId: number, body: { label: string; description: string | null }): Promise<ProjectVersion> {
    const { data } = await api.post<ProjectVersion>(`/projects/${projectId}/versions/baseline`, body)
    return data
  },
  /** Chỉ lấy diff đã cắt gọn, không tải snapshot đầy đủ. */
  async diff(projectId: number, baseId: number, target: DiffTarget): Promise<VersionDiff> {
    const { data } = await api.get<VersionDiff>(`/projects/${projectId}/versions/${baseId}/diff/${target}`)
    return data
  },
  /** Khôi phục dự án về phiên bản (chỉ PM/admin). */
  async rollback(projectId: number, versionId: number): Promise<RollbackResult> {
    const { data } = await api.post<RollbackResult>(`/projects/${projectId}/versions/${versionId}/rollback`)
    return data
  },
}
