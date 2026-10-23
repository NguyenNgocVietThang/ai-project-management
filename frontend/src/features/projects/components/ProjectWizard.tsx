'use client'

import { useLocale, useTranslations } from 'next-intl'

import { zodResolver } from '@hookform/resolvers/zod'
import { Check, Search, UserPlus, X } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Alert } from '@/components/common/Alert'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { Label } from '@/components/common/Label'
import { Badge } from '@/components/ui/Badge'
import { Select } from '@/components/ui/Select'
import { ProjectFields } from '@/features/projects/components/ProjectForm'
import { useAssignableRoles, useUserSearch } from '@/features/projects/hooks/useProjectMembers'
import { projectFormSchema, type ProjectFormValues } from '@/features/projects/project.validation'
import type { Portfolio } from '@/types/portfolio.types'
import type { ProjectCreate, RoleSummary, UserSearchResult } from '@/types/project.types'
import { formatDate, formatRoleName, formatStatus } from '@/lib/format'
import { cn } from '@/lib/utils'

export interface InitialProjectMember { user: UserSearchResult; role: RoleSummary }

export function ProjectWizard({ portfolios, onSubmit, onCancel, isLoading, error }: { portfolios: Portfolio[]; onSubmit: (body: ProjectCreate, members: InitialProjectMember[]) => Promise<void>; onCancel: () => void; isLoading: boolean; error?: string | null }) {
  const locale = useLocale()
  const tw = useTranslations('workspaceUi')
  const [step, setStep] = useState(1)
  const [search, setSearch] = useState('')
  const [members, setMembers] = useState<InitialProjectMember[]>([])
  const users = useUserSearch(search)
  const roles = useAssignableRoles()
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: { name: '', description: '', portfolio_id: '', start_date: '', end_date: '', budget: '', expected_benefit: '', currency: 'VND', methodology: 'agile' },
  })

  const addMember = (candidate: UserSearchResult) => {
    if (members.some((item) => item.user.id === candidate.id)) return
    const defaultRole = roles.data?.find((role) => role.name === 'Member') ?? roles.data?.[0]
    if (defaultRole) setMembers((current) => [...current, { user: candidate, role: defaultRole }])
  }

  const submit = form.handleSubmit(async (values) => onSubmit({
    name: values.name,
    description: values.description?.trim() || null,
    portfolio_id: values.portfolio_id ? Number(values.portfolio_id) : null,
    start_date: values.start_date,
    end_date: values.end_date,
    budget: values.budget === '' ? null : Number(values.budget),
    expected_benefit: values.expected_benefit === '' ? null : Number(values.expected_benefit),
    currency: values.currency,
    methodology: values.methodology,
  }, members))

  return <form noValidate onSubmit={submit} className="space-y-6">
    <ol className="grid grid-cols-3 gap-2" aria-label={tw('projectCreationSteps')}>{[tw('basicInfo'), tw('members'), tw('review')].map((label, index) => <li key={label} aria-current={step === index + 1 ? 'step' : undefined} className={cn('rounded-lg px-2 py-2 text-center text-caption font-medium transition-colors duration-200 sm:px-3', step === index + 1 ? 'bg-primary text-primary-foreground' : step > index + 1 ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground')}>{index + 1}. {label}</li>)}</ol>
    {error && <Alert>{error}</Alert>}
    {step === 1 && <ProjectFields register={form.register} setValue={form.setValue} errors={form.formState.errors} portfolios={portfolios} />}
    {step === 2 && <div className="space-y-4">
      <div><Label htmlFor="member-search">{tw('searchUsers')}</Label><div className="relative"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" /><Input id="member-search" value={search} onChange={(event) => setSearch(event.target.value)} className="pl-9" placeholder={tw('nameUsernameOrEmail')} /></div></div>
      {search && <div className="max-h-44 overflow-y-auto rounded-lg border">{users.data?.map((candidate) => <button key={candidate.id} type="button" onClick={() => addMember(candidate)} className="flex min-h-11 w-full items-center justify-between gap-3 border-b px-4 py-3 text-left transition-colors last:border-0 hover:bg-accent"><span className="min-w-0"><span className="block truncate text-body-sm font-medium">{candidate.full_name}</span><span className="block truncate text-caption text-muted-foreground">{candidate.email_hint}</span></span><UserPlus className="h-4 w-4 shrink-0" aria-hidden="true" /></button>)}{users.data?.length === 0 && <p className="p-4 text-body-sm text-muted-foreground">{tw('noUsersFound')}</p>}</div>}
      <div className="space-y-2">{members.map((member) => <div key={member.user.id} className="flex flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:items-center"><div className="min-w-0 flex-1"><p className="truncate text-body-sm font-medium">{member.user.full_name}</p><p className="truncate text-caption text-muted-foreground">{member.user.email_hint}</p></div><Select aria-label={tw('roleFor', { name: member.user.full_name })} wrapperClassName="sm:w-44" value={member.role.id} onChange={(event) => { const role = roles.data?.find((item) => item.id === Number(event.target.value)); if (role) setMembers((current) => current.map((item) => item.user.id === member.user.id ? { ...item, role } : item)) }} >{roles.data?.map((role) => <option key={role.id} value={role.id}>{formatRoleName(role.name, locale)}</option>)}</Select><Button type="button" variant="ghost" size="icon" fullWidth={false} onClick={() => setMembers((current) => current.filter((item) => item.user.id !== member.user.id))} className="self-end text-muted-foreground hover:bg-destructive/10 hover:text-destructive sm:self-auto" aria-label={tw('removeNamed', { name: member.user.full_name })}><X className="h-4 w-4" aria-hidden="true" /></Button></div>)}</div>
      {members.length === 0 && <p className="rounded-lg border border-dashed p-6 text-center text-body-sm text-muted-foreground">{tw('membersAreOptionalYouCanInviteThemLater')}</p>}
    </div>}
    {step === 3 && <div className="space-y-4 rounded-xl border bg-muted/30 p-4 sm:p-6"><Badge tone="success"><Check className="h-3 w-3" aria-hidden="true" />{tw('readyToCreate')}</Badge><dl className="grid gap-4 text-body-sm sm:grid-cols-2"><div><dt className="text-muted-foreground">{tw('name')}</dt><dd className="mt-1 font-medium">{form.getValues('name')}</dd></div><div><dt className="text-muted-foreground">{tw('methodology')}</dt><dd className="mt-1 font-medium capitalize">{formatStatus(form.getValues('methodology'), locale)}</dd></div><div><dt className="text-muted-foreground">{tw('timeline')}</dt><dd className="mt-1 font-medium">{formatDate(form.getValues('start_date'), locale)} – {formatDate(form.getValues('end_date'), locale)}</dd></div><div><dt className="text-muted-foreground">{tw('initialMembers')}</dt><dd className="mt-1 font-medium">{members.length}</dd></div></dl></div>}
    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><Button type="button" variant="outline" className="sm:w-auto" onClick={step === 1 ? onCancel : () => setStep((current) => current - 1)}>{step === 1 ? tw('cancel') : tw('back')}</Button>{step < 3 ? <Button type="button" className="sm:w-auto" onClick={async () => { if (step === 1) { const valid = await form.trigger(); if (!valid) return } setStep((current) => current + 1) }}>{tw('continue')}</Button> : <Button type="submit" className="sm:w-auto" isLoading={isLoading}>{tw('createProject')}</Button>}</div>
  </form>
}
