import { api } from '@/services/api'
import type { Epic, EpicInput, Milestone, MilestoneInput, Phase, PhaseDeleteImpact, PhaseInput, Sprint, SprintInput, WBSTree } from '@/types/wbs.types'

export const wbsService = {
  /** Cấu trúc WBS. Mặc định KHÔNG kèm task: cây đầy đủ mang theo mọi task của dự
   *  án đã serialize, và cả trang Tasks lẫn trang WBS đều chỉ cần cấu trúc + số đếm. */
  async tree(projectId: number, includeTasks = false) {
    return (await api.get<WBSTree>(`/projects/${projectId}/wbs`, {
      params: includeTasks ? { include_tasks: true } : undefined,
    })).data
  },
  async createPhase(projectId: number, body: PhaseInput) { return (await api.post<Phase>(`/projects/${projectId}/phases`, body)).data },
  async updatePhase(id: number, body: Partial<PhaseInput>) { return (await api.patch<Phase>(`/phases/${id}`, body)).data },
  async phaseImpact(id: number) { return (await api.get<PhaseDeleteImpact>(`/phases/${id}/delete-impact`)).data },
  async deletePhase(id: number, strategy: 'cascade' | 'reassign' | 'unlink', targetPhaseId?: number) {
    await api.delete(`/phases/${id}`, { params: { strategy, target_phase_id: targetPhaseId } })
  },
  async createSprint(phaseId: number, body: SprintInput) { return (await api.post<Sprint>(`/phases/${phaseId}/sprints`, body)).data },
  async updateSprint(id: number, body: Partial<SprintInput>) { return (await api.patch<Sprint>(`/sprints/${id}`, body)).data },
  async deleteSprint(id: number) { await api.delete(`/sprints/${id}`) },
  async startSprint(id: number) { return (await api.post<Sprint>(`/sprints/${id}/start`)).data },
  async completeSprint(id: number) { return (await api.post<Sprint>(`/sprints/${id}/complete`)).data },
  async createEpic(projectId: number, body: EpicInput) { return (await api.post<Epic>(`/projects/${projectId}/epics`, body)).data },
  async updateEpic(id: number, body: Partial<EpicInput>) { return (await api.patch<Epic>(`/epics/${id}`, body)).data },
  async deleteEpic(id: number) { await api.delete(`/epics/${id}`) },
  async createMilestone(projectId: number, body: MilestoneInput) { return (await api.post<Milestone>(`/projects/${projectId}/milestones`, body)).data },
  async updateMilestone(id: number, body: Partial<MilestoneInput>) { return (await api.patch<Milestone>(`/milestones/${id}`, body)).data },
  async deleteMilestone(id: number) { await api.delete(`/milestones/${id}`) },
  async completeMilestone(id: number) { return (await api.post<Milestone>(`/milestones/${id}/complete`)).data },
}
