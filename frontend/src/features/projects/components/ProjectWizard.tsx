'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Check, Search, UserPlus, X } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Alert } from '@/components/common/Alert'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { Label } from '@/components/common/Label'
import { ProjectFields } from '@/features/projects/components/ProjectForm'
import { useAssignableRoles, useUserSearch } from '@/features/projects/hooks/useProjectMembers'
import { projectFormSchema, type ProjectFormValues } from '@/features/projects/project.validation'
import type { Portfolio } from '@/types/portfolio.types'
import type { ProjectCreate, RoleSummary, UserSearchResult } from '@/types/project.types'

export interface InitialProjectMember { user: UserSearchResult; role: RoleSummary }

export function ProjectWizard({ portfolios, onSubmit, onCancel, isLoading, error }: { portfolios: Portfolio[]; onSubmit: (body: ProjectCreate, members: InitialProjectMember[]) => Promise<void>; onCancel: () => void; isLoading: boolean; error?: string | null }) {
  const [step, setStep] = useState(1)
  const [search, setSearch] = useState('')
  const [members, setMembers] = useState<InitialProjectMember[]>([])
  const users = useUserSearch(search)
  const roles = useAssignableRoles()
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: { name: '', description: '', portfolio_id: '', start_date: '', end_date: '', budget: '', currency: 'VND', methodology: 'agile' },
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
    currency: values.currency,
    methodology: values.methodology,
  }, members))

  return <form noValidate onSubmit={submit} className="space-y-6">
    <ol className="grid grid-cols-3 gap-2" aria-label="Project creation steps">{['Basic info', 'Members', 'Review'].map((label, index) => <li key={label} className={`rounded-md px-3 py-2 text-center text-xs font-medium ${step === index + 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>{index + 1}. {label}</li>)}</ol>
    {error && <Alert>{error}</Alert>}
    {step === 1 && <ProjectFields register={form.register} setValue={form.setValue} errors={form.formState.errors} portfolios={portfolios} />}
    {step === 2 && <div className="space-y-4">
      <div><Label htmlFor="member-search">Search users</Label><div className="relative"><Search className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" /><Input id="member-search" value={search} onChange={(event) => setSearch(event.target.value)} className="pl-9" placeholder="Name, username, or email" /></div></div>
      {search && <div className="max-h-44 overflow-y-auto rounded-lg border">{users.data?.map((candidate) => <button key={candidate.id} type="button" onClick={() => addMember(candidate)} className="flex w-full items-center justify-between border-b px-4 py-3 text-left last:border-0 hover:bg-accent"><span><span className="block text-sm font-medium">{candidate.full_name}</span><span className="text-xs text-muted-foreground">{candidate.email_hint}</span></span><UserPlus className="h-4 w-4" /></button>)}{users.data?.length === 0 && <p className="p-4 text-sm text-muted-foreground">No users found.</p>}</div>}
      <div className="space-y-2">{members.map((member) => <div key={member.user.id} className="flex flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:items-center"><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{member.user.full_name}</p><p className="truncate text-xs text-muted-foreground">{member.user.email_hint}</p></div><select value={member.role.id} onChange={(event) => { const role = roles.data?.find((item) => item.id === Number(event.target.value)); if (role) setMembers((current) => current.map((item) => item.user.id === member.user.id ? { ...item, role } : item)) }} className="h-10 rounded-md border bg-background px-3 text-sm">{roles.data?.map((role) => <option key={role.id} value={role.id}>{role.name}</option>)}</select><button type="button" onClick={() => setMembers((current) => current.filter((item) => item.user.id !== member.user.id))} className="rounded-md p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive" aria-label={`Remove ${member.user.full_name}`}><X className="h-4 w-4" /></button></div>)}</div>
      {members.length === 0 && <p className="rounded-lg border border-dashed p-5 text-center text-sm text-muted-foreground">Members are optional. You can invite them later.</p>}
    </div>}
    {step === 3 && <div className="space-y-4 rounded-lg border p-5"><div className="flex items-center gap-2 text-sm font-medium text-emerald-600"><Check className="h-4 w-4" />Ready to create</div><dl className="grid gap-4 text-sm sm:grid-cols-2"><div><dt className="text-muted-foreground">Name</dt><dd className="mt-1 font-medium">{form.getValues('name')}</dd></div><div><dt className="text-muted-foreground">Methodology</dt><dd className="mt-1 font-medium capitalize">{form.getValues('methodology')}</dd></div><div><dt className="text-muted-foreground">Timeline</dt><dd className="mt-1 font-medium">{form.getValues('start_date')} – {form.getValues('end_date')}</dd></div><div><dt className="text-muted-foreground">Initial members</dt><dd className="mt-1 font-medium">{members.length}</dd></div></dl></div>}
    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><Button type="button" variant="outline" className="sm:w-auto" onClick={step === 1 ? onCancel : () => setStep((current) => current - 1)}>{step === 1 ? 'Cancel' : 'Back'}</Button>{step < 3 ? <Button type="button" className="sm:w-auto" onClick={async () => { if (step === 1) { const valid = await form.trigger(); if (!valid) return } setStep((current) => current + 1) }}>Continue</Button> : <Button type="submit" className="sm:w-auto" isLoading={isLoading}>Create project</Button>}</div>
  </form>
}
