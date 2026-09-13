'use client'

import { Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useId, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Alert } from '@/components/common/Alert'
import { Button } from '@/components/common/Button'
import { Label } from '@/components/common/Label'
import { Modal } from '@/components/common/Modal'
import { Spinner } from '@/components/common/Spinner'
import { projectKeys } from '@/features/projects/hooks/useProjects'
import { useAIJob, useGenerateProject } from '@/features/ai/hooks/useAIGenerator'
import { getApiErrorMessage } from '@/types/api.types'

const STATUS_LABEL: Record<string, string> = {
  PENDING: 'Queued…',
  PROCESSING: 'AI is drafting your plan…',
}

export function AIGeneratorModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const promptId = useId()
  const [prompt, setPrompt] = useState('')
  const [jobId, setJobId] = useState<string | null>(null)
  const generateMutation = useGenerateProject()
  const job = useAIJob(jobId)

  // Job vừa xếp hàng vẫn đang PENDING lúc mutation resolve, nên chỉ khi query
  // poll thấy COMPLETED mới có project_id thật để invalidate danh sách project.
  useEffect(() => {
    if (job.data?.status === 'COMPLETED') {
      queryClient.invalidateQueries({ queryKey: projectKeys.all })
    }
  }, [job.data?.status, queryClient])

  const reset = () => {
    setPrompt('')
    setJobId(null)
    generateMutation.reset()
  }

  const close = () => {
    reset()
    onClose()
  }

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    const response = await generateMutation.mutateAsync(prompt.trim())
    setJobId(response.job_id)
  }

  const viewProject = () => {
    if (job.data?.project_id) {
      router.push(`/projects/${job.data.project_id}/overview`)
      close()
    }
  }

  return (
    <Modal
      open={open}
      onClose={close}
      title="Generate project with AI"
      description="Describe the project in plain language — AI drafts the phases, tasks, and dependencies for you."
    >
      {!jobId && (
        <form onSubmit={submit} className="space-y-4">
          {generateMutation.isError && <Alert>{getApiErrorMessage(generateMutation.error)}</Alert>}
          <div>
            <Label htmlFor={promptId}>Project prompt</Label>
            <textarea
              id={promptId}
              rows={5}
              required
              minLength={10}
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              placeholder="e.g. Build a task management app with user authentication and a Kanban board"
              className="w-full rounded-md border bg-background px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" className="sm:w-auto" onClick={close}>
              Cancel
            </Button>
            <Button type="submit" className="sm:w-auto" isLoading={generateMutation.isPending}>
              <Sparkles className="h-4 w-4" />
              Generate
            </Button>
          </div>
        </form>
      )}

      {jobId && job.data?.status !== 'COMPLETED' && job.data?.status !== 'FAILED' && (
        <div className="flex flex-col items-center gap-3 py-8 text-center">
          <Spinner className="h-8 w-8 text-primary" />
          <p className="text-sm text-muted-foreground">
            {STATUS_LABEL[job.data?.status ?? 'PENDING']}
          </p>
        </div>
      )}

      {jobId && job.data?.status === 'FAILED' && (
        <div className="space-y-4">
          <Alert>{job.data.error ?? 'AI project generation failed.'}</Alert>
          <div className="flex justify-end">
            <Button type="button" variant="outline" className="sm:w-auto" onClick={reset}>
              Try again
            </Button>
          </div>
        </div>
      )}

      {jobId && job.data?.status === 'COMPLETED' && (
        <div className="space-y-4">
          <Alert variant="success">Project generated successfully.</Alert>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" className="sm:w-auto" onClick={close}>
              Close
            </Button>
            <Button type="button" className="sm:w-auto" onClick={viewProject}>
              View project
            </Button>
          </div>
        </div>
      )}
    </Modal>
  )
}
