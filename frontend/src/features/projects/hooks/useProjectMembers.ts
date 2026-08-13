'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { projectService } from '@/services/project.service'
import type { ProjectMember, ProjectMemberCreate } from '@/types/project.types'
import { projectKeys } from '@/features/projects/hooks/useProjects'

export function useProjectMembers(projectId: number) {
  return useQuery({
    queryKey: projectKeys.members(projectId),
    queryFn: () => projectService.members(projectId),
  })
}

export function useAssignableRoles() {
  return useQuery({ queryKey: ['project-roles'], queryFn: projectService.assignableRoles })
}

export function useUserSearch(query: string) {
  return useQuery({
    queryKey: ['user-search', query],
    queryFn: () => projectService.searchUsers(query),
    enabled: query.trim().length > 0,
  })
}

export function useAddProjectMember(projectId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: ProjectMemberCreate) => projectService.addMember(projectId, body),
    onSuccess: (member) => {
      queryClient.setQueryData<ProjectMember[]>(projectKeys.members(projectId), (current = []) => [
        ...current,
        member,
      ])
      queryClient.invalidateQueries({ queryKey: projectKeys.detail(projectId) })
      queryClient.invalidateQueries({ queryKey: projectKeys.activity(projectId) })
    },
  })
}

export function useRemoveProjectMember(projectId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (userId: number) => projectService.removeMember(projectId, userId),
    onMutate: async (userId) => {
      await queryClient.cancelQueries({ queryKey: projectKeys.members(projectId) })
      const previous = queryClient.getQueryData<ProjectMember[]>(projectKeys.members(projectId))
      queryClient.setQueryData<ProjectMember[]>(projectKeys.members(projectId), (current = []) =>
        current.filter((member) => member.user.id !== userId)
      )
      return { previous }
    },
    onError: (_error, _userId, context) => {
      queryClient.setQueryData(projectKeys.members(projectId), context?.previous)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.members(projectId) })
      queryClient.invalidateQueries({ queryKey: projectKeys.detail(projectId) })
      queryClient.invalidateQueries({ queryKey: projectKeys.activity(projectId) })
    },
  })
}
