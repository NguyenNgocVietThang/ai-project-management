'use client'

import { useQuery } from '@tanstack/react-query'
import { taskService } from '@/services/task.service'

export const timesheetKeys = {
  project: (projectId: number, params: object) => ['timesheet', projectId, params] as const,
  mine: (params: object) => ['timesheet', 'mine', params] as const,
  leveling: (projectId: number, params: object) => ['resource-leveling', projectId, params] as const,
}

/** Giờ đã ghi trên một dự án, có lọc theo người và khoảng ngày. */
export function useProjectWorklogs(
  projectId: number,
  params: { user_id?: number; start_date?: string; end_date?: string }
) {
  return useQuery({
    queryKey: timesheetKeys.project(projectId, params),
    queryFn: () => taskService.projectWorklogs(projectId, params),
    enabled: Number.isFinite(projectId),
  })
}

/** Công việc đang được giao cho người dùng hiện tại, trên mọi dự án. */
export function useMyAssignments() {
  return useQuery({
    queryKey: timesheetKeys.mine({}),
    queryFn: () => taskService.myAssignments(),
  })
}

/** Cảnh báo quá tải nhân sự theo ngày. */
export function useResourceLeveling(
  projectId: number,
  params: { start_date?: string; end_date?: string }
) {
  return useQuery({
    queryKey: timesheetKeys.leveling(projectId, params),
    queryFn: () => taskService.resourceLeveling(projectId, params),
    enabled: Number.isFinite(projectId),
  })
}
