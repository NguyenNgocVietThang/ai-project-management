'use client'

import { Grid2X2, List, Plus, Search } from 'lucide-react'
import { useState } from 'react'
import { Alert } from '@/components/common/Alert'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { Modal } from '@/components/common/Modal'
import { EmptyState, ErrorState, LoadingState } from '@/components/common/PageState'
import { usePortfolios } from '@/features/portfolios/hooks/usePortfolios'
import { ProjectCard } from '@/features/projects/components/ProjectCard'
import { ProjectWizard, type InitialProjectMember } from '@/features/projects/components/ProjectWizard'
import { useCreateProject, useProjects } from '@/features/projects/hooks/useProjects'
import { formatDate, formatStatus } from '@/lib/format'
import { projectService } from '@/services/project.service'
import { getApiErrorMessage } from '@/types/api.types'
import type { ProjectCreate, ProjectMethodology, ProjectStatus } from '@/types/project.types'

export default function ProjectsPage() {
  const [view, setView] = useState<'grid' | 'table'>('grid')
  const [creating, setCreating] = useState(false)
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

  return <div className="space-y-6">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm font-medium text-primary">Project workspace</p><h1 className="mt-1 text-3xl font-semibold tracking-tight">Projects</h1><p className="mt-2 text-sm text-muted-foreground">Plan, staff, and monitor projects across portfolios.</p></div><Button className="sm:w-auto" onClick={() => setCreating(true)}><Plus className="h-4 w-4" />New project</Button></div>
    {inviteFailures.length > 0 && <Alert>Project created, but invitations failed for: {inviteFailures.join(', ')}. You can retry from the Members page.</Alert>}
    <div className="grid gap-3 rounded-xl border bg-card p-4 md:grid-cols-2 xl:grid-cols-4"><div className="relative"><Search className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" /><Input value={search} onChange={(event) => setSearch(event.target.value)} className="pl-9" placeholder="Search projects" aria-label="Search projects" /></div><select aria-label="Status filter" value={status} onChange={(event) => setStatus(event.target.value as ProjectStatus | '')} className="h-11 rounded-md border bg-background px-3 text-sm"><option value="">All statuses</option><option value="PLANNING">Planning</option><option value="ACTIVE">Active</option><option value="ON_HOLD">On hold</option><option value="COMPLETED">Completed</option><option value="CANCELLED">Cancelled</option></select><select aria-label="Methodology filter" value={methodology} onChange={(event) => setMethodology(event.target.value as ProjectMethodology | '')} className="h-11 rounded-md border bg-background px-3 text-sm"><option value="">All methods</option><option value="agile">Agile</option><option value="waterfall">Waterfall</option><option value="hybrid">Hybrid</option></select><select aria-label="Portfolio filter" value={portfolioId} onChange={(event) => setPortfolioId(event.target.value)} className="h-11 rounded-md border bg-background px-3 text-sm"><option value="">All portfolios</option>{portfolios.data?.items.map((portfolio) => <option key={portfolio.id} value={portfolio.id}>{portfolio.name}</option>)}</select><div><label htmlFor="projects-start-after" className="mb-1 block text-xs text-muted-foreground">Starts on/after</label><Input id="projects-start-after" type="date" value={startDateFrom} onChange={(event) => setStartDateFrom(event.target.value)} /></div><div><label htmlFor="projects-end-before" className="mb-1 block text-xs text-muted-foreground">Ends on/before</label><Input id="projects-end-before" type="date" value={endDateTo} onChange={(event) => setEndDateTo(event.target.value)} /></div><div className="flex items-end"><div className="flex rounded-md border p-1"><button type="button" onClick={() => setView('grid')} className={`flex h-9 w-10 items-center justify-center rounded ${view === 'grid' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`} aria-label="Grid view"><Grid2X2 className="h-4 w-4" /></button><button type="button" onClick={() => setView('table')} className={`flex h-9 w-10 items-center justify-center rounded ${view === 'table' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`} aria-label="Table view"><List className="h-4 w-4" /></button></div></div></div>
    {query.isLoading && <LoadingState label="Loading projects…" />}{query.isError && <ErrorState message={getApiErrorMessage(query.error)} />}
    {query.data && query.data.items.length === 0 && <EmptyState title="No projects found" description="Create a project or adjust the filters." />}
    {query.data && query.data.items.length > 0 && view === 'grid' && <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{query.data.items.map((project) => <ProjectCard key={project.id} project={project} />)}</div>}
    {query.data && query.data.items.length > 0 && view === 'table' && <div className="overflow-x-auto rounded-xl border"><table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-muted/60 text-xs uppercase text-muted-foreground"><tr><th className="px-4 py-3">Project</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Portfolio</th><th className="px-4 py-3">Timeline</th><th className="px-4 py-3">Progress</th></tr></thead><tbody>{query.data.items.map((project) => <tr key={project.id} className="border-t hover:bg-muted/30"><td className="px-4 py-3"><a href={`/projects/${project.id}/overview`} className="font-medium text-primary hover:underline">{project.name}</a><p className="mt-0.5 text-xs text-muted-foreground">{formatStatus(project.methodology)}</p></td><td className="px-4 py-3">{formatStatus(project.status)}</td><td className="px-4 py-3 text-muted-foreground">{project.portfolio_name || 'Standalone'}</td><td className="px-4 py-3 text-muted-foreground">{formatDate(project.start_date)} – {formatDate(project.end_date)}</td><td className="px-4 py-3">{Math.round(project.progress_percent)}%</td></tr>)}</tbody></table></div>}
    <Modal open={creating} onClose={() => setCreating(false)} title="Create project" description="Define the project, choose initial members, and review before creating." className="max-w-3xl"><ProjectWizard portfolios={portfolios.data?.items ?? []} onSubmit={createProject} onCancel={() => setCreating(false)} isLoading={createMutation.isPending} error={createMutation.isError ? getApiErrorMessage(createMutation.error) : null} /></Modal>
  </div>
}
