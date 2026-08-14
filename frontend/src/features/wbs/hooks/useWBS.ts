'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { wbsService } from '@/services/wbs.service'
import type { EpicInput, MilestoneInput, PhaseInput, SprintInput } from '@/types/wbs.types'
import { projectKeys } from '@/features/projects/hooks/useProjects'
import { taskKeys } from '@/features/tasks/hooks/useTasks'

export const wbsKeys = { all: ['wbs'] as const, tree: (projectId: number) => ['wbs', projectId] as const, impact: (phaseId: number) => ['wbs', 'impact', phaseId] as const }

export function useWBS(projectId: number) {
  return useQuery({ queryKey: wbsKeys.tree(projectId), queryFn: () => wbsService.tree(projectId), enabled: Number.isFinite(projectId) })
}
export function usePhaseImpact(phaseId: number | null) {
  return useQuery({ queryKey: wbsKeys.impact(phaseId || 0), queryFn: () => wbsService.phaseImpact(phaseId!), enabled: phaseId !== null })
}
export function useWBSActions(projectId: number) {
  const client = useQueryClient()
  const refresh = () => { client.invalidateQueries({ queryKey: wbsKeys.tree(projectId) }); client.invalidateQueries({ queryKey: taskKeys.all }); client.invalidateQueries({ queryKey: projectKeys.detail(projectId) }) }
  return {
    createPhase: useMutation({ mutationFn: (body: PhaseInput) => wbsService.createPhase(projectId, body), onSuccess: refresh }),
    updatePhase: useMutation({ mutationFn: ({ id, body }: { id: number; body: Partial<PhaseInput> }) => wbsService.updatePhase(id, body), onSuccess: refresh }),
    deletePhase: useMutation({ mutationFn: ({ id, strategy, targetPhaseId }: { id: number; strategy: 'cascade' | 'reassign' | 'unlink'; targetPhaseId?: number }) => wbsService.deletePhase(id, strategy, targetPhaseId), onSuccess: refresh }),
    createSprint: useMutation({ mutationFn: ({ phaseId, body }: { phaseId: number; body: SprintInput }) => wbsService.createSprint(phaseId, body), onSuccess: refresh }),
    updateSprint: useMutation({ mutationFn: ({ id, body }: { id: number; body: Partial<SprintInput> }) => wbsService.updateSprint(id, body), onSuccess: refresh }),
    deleteSprint: useMutation({ mutationFn: wbsService.deleteSprint, onSuccess: refresh }),
    startSprint: useMutation({ mutationFn: wbsService.startSprint, onSuccess: refresh }),
    completeSprint: useMutation({ mutationFn: wbsService.completeSprint, onSuccess: refresh }),
    createEpic: useMutation({ mutationFn: (body: EpicInput) => wbsService.createEpic(projectId, body), onSuccess: refresh }),
    updateEpic: useMutation({ mutationFn: ({ id, body }: { id: number; body: Partial<EpicInput> }) => wbsService.updateEpic(id, body), onSuccess: refresh }),
    deleteEpic: useMutation({ mutationFn: wbsService.deleteEpic, onSuccess: refresh }),
    createMilestone: useMutation({ mutationFn: (body: MilestoneInput) => wbsService.createMilestone(projectId, body), onSuccess: refresh }),
    updateMilestone: useMutation({ mutationFn: ({ id, body }: { id: number; body: Partial<MilestoneInput> }) => wbsService.updateMilestone(id, body), onSuccess: refresh }),
    deleteMilestone: useMutation({ mutationFn: wbsService.deleteMilestone, onSuccess: refresh }),
    completeMilestone: useMutation({ mutationFn: wbsService.completeMilestone, onSuccess: refresh }),
  }
}
