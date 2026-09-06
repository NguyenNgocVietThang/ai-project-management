'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
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
  // Debounce ở đây chứ không ở từng nơi gọi: `query` đi thẳng vào query key, nên
  // nếu không có bước này thì mỗi ký tự gõ vào là một request mới.
  const debounced = useDebouncedValue(query.trim())
  return useQuery({
    queryKey: ['user-search', debounced],
    queryFn: () => projectService.searchUsers(debounced),
    // Backend yêu cầu tối thiểu 3 ký tự; gọi với ít hơn chỉ nhận về 422.
    enabled: debounced.length >= 3,
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
