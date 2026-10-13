'use client'

import { Grid2X2, List, Plus, Search, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { Alert } from '@/components/common/Alert'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { Modal } from '@/components/common/Modal'
import { EmptyState, ErrorState, LoadingState } from '@/components/common/PageState'
import { Reveal } from '@/components/motion/RevealText'
import { Card } from '@/components/ui/Card'
import { PageHeader } from '@/components/ui/PageHeader'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import { Select } from '@/components/ui/Select'
import { AIGeneratorModal } from '@/features/ai/components/AIGeneratorModal'
import { usePortfolios } from '@/features/portfolios/hooks/usePortfolios'
import { ProjectCard } from '@/features/projects/components/ProjectCard'
import { ProjectStatusBadge } from '@/features/projects/components/ProjectStatusBadge'
import { ProjectWizard, type InitialProjectMember } from '@/features/projects/components/ProjectWizard'
import { useCreateProject, useProjects } from '@/features/projects/hooks/useProjects'
import { formatDate, formatStatus } from '@/lib/format'
import { projectService } from '@/services/project.service'
import { getApiErrorMessage } from '@/types/api.types'
import type { ProjectCreate, ProjectMethodology, ProjectStatus } from '@/types/project.types'

export default function ProjectsPage() {
  const [view, setView] = useState<'grid' | 'table'>('grid')
  const [creating, setCreating] = useState(false)
  const [generatingWithAI, setGeneratingWithAI] = useState(false)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<ProjectStatus | ''>('')
  const [methodology, setMethodology] = useState<ProjectMethodology | ''>('')
  const [portfolioId, setPortfolioId] = useState('')
  const [startDateFrom, setStartDateFrom] = useState('')
  const [endDateTo, setEndDateTo] = useState('')
  const [inviteFailures, setInviteFailures] = useState<string[]>([])
  const query = useProjects({ page_size: 100, search: search || undefined, status: status || undefined, methodology: methodology || undefined, portfolio_id: portfolioId ? Number(portfolioId) : undefined, start_date_from: startDateFrom || undefined, end_date_to: endDateTo || undefined })
  const portfolios = usePortfolios({ page_size: 100 })
  const createMutation = useCreateProject()

  const createProject = async (body: ProjectCreate, members: InitialProjectMember[]) => {
    const project = await createMutation.mutateAsync(body)
    const failures: string[] = []
    for (const member of members) {
      try { await projectService.addMember(project.id, { user_id: member.user.id, role_id: member.role.id }) }
      catch { failures.push(member.user.full_name) }
    }
    setInviteFailures(failures)
    setCreating(false)
  }

  const newProjectButton = (
    <Button fullWidth={false} onClick={() => setCreating(true)}>
      <Plus className="h-4 w-4" aria-hidden="true" />
      New project
    </Button>
  )

  return <div className="space-y-8">
    <PageHeader
      eyebrow="Project workspace"
      title="Projects"
      description="Plan, staff, and monitor projects across portfolios."
      actions={<>
        <Button variant="outline" fullWidth={false} onClick={() => setGeneratingWithAI(true)}>
          <Sparkles className="h-4 w-4" aria-hidden="true" />
          Generate with AI
        </Button>
        {newProjectButton}
      </>}
    />
    {inviteFailures.length > 0 && <Alert>Project created, but invitations failed for: {inviteFailures.join(', ')}. You can retry from the Members page.</Alert>}
    {/* Thanh bộ lọc: 1 cột trên mobile, 2 cột tablet, 4 cột desktop */}
    <Card className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      <div className="relative self-end">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <Input value={search} onChange={(event) => setSearch(event.target.value)} className="pl-9" placeholder="Search projects" aria-label="Search projects" />
      </div>
      <Select aria-label="Status filter" wrapperClassName="self-end" value={status} onChange={(event) => setStatus(event.target.value as ProjectStatus | '')}>
        <option value="">All statuses</option>
        <option value="PLANNING">Planning</option>
        <option value="ACTIVE">Active</option>
        <option value="ON_HOLD">On hold</option>
        <option value="COMPLETED">Completed</option>
        <option value="CANCELLED">Cancelled</option>
      </Select>
      <Select aria-label="Methodology filter" wrapperClassName="self-end" value={methodology} onChange={(event) => setMethodology(event.target.value as ProjectMethodology | '')}>
        <option value="">All methods</option>
        <option value="agile">Agile</option>
        <option value="waterfall">Waterfall</option>
        <option value="hybrid">Hybrid</option>
      </Select>
      <Select aria-label="Portfolio filter" wrapperClassName="self-end" value={portfolioId} onChange={(event) => setPortfolioId(event.target.value)}>
        <option value="">All portfolios</option>
        {portfolios.data?.items.map((portfolio) => <option key={portfolio.id} value={portfolio.id}>{portfolio.name}</option>)}
      </Select>
      <div><label htmlFor="projects-start-after" className="mb-1 block text-caption text-muted-foreground">Starts on/after</label><Input id="projects-start-after" type="date" value={startDateFrom} onChange={(event) => setStartDateFrom(event.target.value)} /></div>
      <div><label htmlFor="projects-end-before" className="mb-1 block text-caption text-muted-foreground">Ends on/before</label><Input id="projects-end-before" type="date" value={endDateTo} onChange={(event) => setEndDateTo(event.target.value)} /></div>
      <div className="flex items-end xl:col-start-4 xl:justify-end">
        <SegmentedControl
          label="View mode"
          value={view}
          onChange={setView}
          options={[
            { value: 'grid', label: 'Grid view', icon: Grid2X2, iconOnly: true },
            { value: 'table', label: 'Table view', icon: List, iconOnly: true },
          ]}
        />
      </div>
    </Card>
    {query.isLoading && <LoadingState variant={view === 'table' ? 'table' : 'cards'} label="Loading projects…" />}
    {query.isError && <ErrorState message={getApiErrorMessage(query.error)} onRetry={() => void query.refetch()} />}
    {query.data && query.data.items.length === 0 && <EmptyState title="No projects found" description="Create a project or adjust the filters." action={newProjectButton} />}
    {query.data && query.data.items.length > 0 && view === 'grid' && <Reveal stagger={60} className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">{query.data.items.map((project) => <ProjectCard key={project.id} project={project} />)}</Reveal>}
    {query.data && query.data.items.length > 0 && view === 'table' && <Card flush className="overflow-hidden">
      {/* Bảng tự cuộn ngang trong khung, trang không bị cuộn ngang */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-body-sm">
          <thead className="bg-muted/50 text-caption uppercase text-muted-foreground">
            <tr><th scope="col" className="px-4 py-3 font-medium">Project</th><th scope="col" className="px-4 py-3 font-medium">Status</th><th scope="col" className="px-4 py-3 font-medium">Portfolio</th><th scope="col" className="px-4 py-3 font-medium">Timeline</th><th scope="col" className="px-4 py-3 font-medium">Progress</th></tr>
          </thead>
          <tbody>
            {query.data.items.map((project) => <tr key={project.id} className="border-t transition-colors hover:bg-muted/40">
              <td className="px-4 py-3"><Link href={`/projects/${project.id}/overview`} className="font-medium text-primary hover:underline">{project.name}</Link><p className="mt-1 text-caption text-muted-foreground">{formatStatus(project.methodology)}</p></td>
              <td className="px-4 py-3"><ProjectStatusBadge status={project.status} /></td>
              <td className="px-4 py-3 text-muted-foreground">{project.portfolio_name || 'Standalone'}</td>
              <td className="px-4 py-3 text-muted-foreground">{formatDate(project.start_date)} – {formatDate(project.end_date)}</td>
              <td className="px-4 py-3 tabular-nums">{Math.round(project.progress_percent)}%</td>
            </tr>)}
          </tbody>
        </table>
      </div>
    </Card>}
    <Modal open={creating} onClose={() => setCreating(false)} title="Create project" description="Define the project, choose initial members, and review before creating." className="max-w-3xl"><ProjectWizard portfolios={portfolios.data?.items ?? []} onSubmit={createProject} onCancel={() => setCreating(false)} isLoading={createMutation.isPending} error={createMutation.isError ? getApiErrorMessage(createMutation.error) : null} /></Modal>
    <AIGeneratorModal open={generatingWithAI} onClose={() => setGeneratingWithAI(false)} />
  </div>
}
