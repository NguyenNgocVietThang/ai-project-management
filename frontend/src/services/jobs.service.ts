import { api } from '@/services/api'
import type { DurableJob } from '@/types/job.types'

export const jobsService = {
  async list(signal?: AbortSignal): Promise<DurableJob[]> {
    const { data } = await api.get<DurableJob[]>('/jobs', { signal })
    return data
  },
  async get(id: number, signal?: AbortSignal): Promise<DurableJob> {
    const { data } = await api.get<DurableJob>(`/jobs/${id}`, { signal })
    return data
  },
}
