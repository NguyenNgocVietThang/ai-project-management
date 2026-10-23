'use client'

import { useLocale, useTranslations } from 'next-intl'


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
import { useApiErrorMessage } from '@/i18n/useApiErrorMessage'
import type { ProjectCreate, ProjectMethodology, ProjectStatus } from '@/types/project.types'

export default function ProjectsPage() {
  const locale = useLocale()
  const getApiErrorMessage = useApiErrorMessage()
  const tw = useTranslations('workspaceUi')
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
      {tw('newProject')} </Button>
  )

  return <div className="space-y-8">
    <PageHeader
      eyebrow={tw('projectWorkspace')}
      title={tw('projects')}
      description={tw('planStaffAndMonitorProjectsAcrossPortfolios')}
      actions={<>
        <Button variant="outline" fullWidth={false} onClick={() => setGeneratingWithAI(true)}>
          <Sparkles className="h-4 w-4" aria-hidden="true" />
          {tw('generateWithAI')} </Button>
        {newProjectButton}
      </>}
    />
    {inviteFailures.length > 0 && <Alert>{tw('invitationFailure', { names: inviteFailures.join(', ') })}</Alert>}
    {/* Thanh bộ lọc: 1 cột trên mobile, 2 cột tablet, 4 cột desktop */}
    <Card className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      <div className="relative self-end">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <Input value={search} onChange={(event) => setSearch(event.target.value)} className="pl-9" placeholder={tw('searchProjects')} aria-label={tw('searchProjects')} />
      </div>
      <Select aria-label={tw('statusFilter')} wrapperClassName="self-end" value={status} onChange={(event) => setStatus(event.target.value as ProjectStatus | '')}>
        <option value="">{tw('allStatuses')}</option>
        <option value="PLANNING">{tw('planning')}</option>
        <option value="ACTIVE">{tw('active')}</option>
        <option value="ON_HOLD">{tw('onHold')}</option>
        <option value="COMPLETED">{tw('completed')}</option>
        <option value="CANCELLED">{tw('cancelled')}</option>
      </Select>
      <Select aria-label={tw('methodologyFilter')} wrapperClassName="self-end" value={methodology} onChange={(event) => setMethodology(event.target.value as ProjectMethodology | '')}>
        <option value="">{tw('allMethods')}</option>
        <option value="agile">{tw('agile')}</option>
        <option value="waterfall">{tw('waterfall')}</option>
        <option value="hybrid">{tw('hybrid')}</option>
      </Select>
      <Select aria-label={tw('portfolioFilter')} wrapperClassName="self-end" value={portfolioId} onChange={(event) => setPortfolioId(event.target.value)}>
        <option value="">{tw('allPortfolios')}</option>
        {portfolios.data?.items.map((portfolio) => <option key={portfolio.id} value={portfolio.id}>{portfolio.name}</option>)}
      </Select>
      <div><label htmlFor="projects-start-after" className="mb-1 block text-caption text-muted-foreground">{tw('startsOnAfter')}</label><Input id="projects-start-after" type="date" value={startDateFrom} onChange={(event) => setStartDateFrom(event.target.value)} /></div>
      <div><label htmlFor="projects-end-before" className="mb-1 block text-caption text-muted-foreground">{tw('endsOnBefore')}</label><Input id="projects-end-before" type="date" value={endDateTo} onChange={(event) => setEndDateTo(event.target.value)} /></div>
      <div className="flex items-end xl:col-start-4 xl:justify-end">
        <SegmentedControl
          label={tw('viewMode')}
          value={view}
          onChange={setView}
          options={[
            { value: 'grid', label: tw('gridView'), icon: Grid2X2, iconOnly: true },
            { value: 'table', label: tw('tableView'), icon: List, iconOnly: true },
          ]}
        />
      </div>
    </Card>
    {query.isLoading && <LoadingState variant={view === 'table' ? 'table' : 'cards'} label={tw('loadingProjects')} />}
    {query.isError && <ErrorState message={getApiErrorMessage(query.error)} onRetry={() => void query.refetch()} />}
    {query.data && query.data.items.length === 0 && <EmptyState title={tw('noProjectsFound')} description={tw('createAProjectOrAdjustTheFilters')} action={newProjectButton} />}
    {query.data && query.data.items.length > 0 && view === 'grid' && <Reveal stagger={60} className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">{query.data.items.map((project) => <ProjectCard key={project.id} project={project} />)}</Reveal>}
    {query.data && query.data.items.length > 0 && view === 'table' && <Card flush className="overflow-hidden">
      {/* Bảng tự cuộn ngang trong khung, trang không bị cuộn ngang */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-body-sm">
          <thead className="bg-muted/50 text-caption uppercase text-muted-foreground">
            <tr><th scope="col" className="px-4 py-3 font-medium">{tw('project')}</th><th scope="col" className="px-4 py-3 font-medium">{tw('status')}</th><th scope="col" className="px-4 py-3 font-medium">{tw('portfolioLabel')}</th><th scope="col" className="px-4 py-3 font-medium">{tw('timeline')}</th><th scope="col" className="px-4 py-3 font-medium">{tw('progress')}</th></tr>
          </thead>
          <tbody>
            {query.data.items.map((project) => <tr key={project.id} className="border-t transition-colors hover:bg-muted/40">
              <td className="px-4 py-3"><Link href={`/projects/${project.id}/overview`} className="font-medium text-primary hover:underline">{project.name}</Link><p className="mt-1 text-caption text-muted-foreground">{formatStatus(project.methodology, locale)}</p></td>
              <td className="px-4 py-3"><ProjectStatusBadge status={project.status} /></td>
              <td className="px-4 py-3 text-muted-foreground">{project.portfolio_name || tw('standalone')}</td>
              <td className="px-4 py-3 text-muted-foreground">{formatDate(project.start_date, locale)} – {formatDate(project.end_date, locale)}</td>
              <td className="px-4 py-3 tabular-nums">{Math.round(project.progress_percent)}%</td>
            </tr>)}
          </tbody>
        </table>
      </div>
    </Card>}
    <Modal open={creating} onClose={() => setCreating(false)} title={tw('createProject')} description={tw('defineTheProjectChooseInitialMembersAndReviewBeforeCreating')} className="max-w-3xl"><ProjectWizard portfolios={portfolios.data?.items ?? []} onSubmit={createProject} onCancel={() => setCreating(false)} isLoading={createMutation.isPending} error={createMutation.isError ? getApiErrorMessage(createMutation.error) : null} /></Modal>
    <AIGeneratorModal open={generatingWithAI} onClose={() => setGeneratingWithAI(false)} />
  </div>
}
