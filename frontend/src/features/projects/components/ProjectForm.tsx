'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { type FieldErrors, type UseFormRegister, type UseFormSetValue, useForm } from 'react-hook-form'
import { Alert } from '@/components/common/Alert'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { Label } from '@/components/common/Label'
import { Select } from '@/components/ui/Select'
import { projectFormSchema, type ProjectFormValues } from '@/features/projects/project.validation'
import type { Portfolio } from '@/types/portfolio.types'
import type { Project, ProjectUpdate } from '@/types/project.types'

export function ProjectForm({ project, portfolios, onSubmit, isLoading, error }: { project: Project; portfolios: Portfolio[]; onSubmit: (body: ProjectUpdate) => Promise<void>; isLoading: boolean; error?: string | null }) {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      name: project.name,
      description: project.description ?? '',
      portfolio_id: project.portfolio_id?.toString() ?? '',
      start_date: project.start_date ?? '',
      end_date: project.end_date ?? '',
      budget: project.budget?.toString() ?? '',
      currency: project.currency,
      methodology: project.methodology,
      status: project.status,
    },
  })

  return (
    <form className="space-y-5" noValidate onSubmit={handleSubmit(async (values) => onSubmit({
      name: values.name,
      description: values.description?.trim() || null,
      portfolio_id: values.portfolio_id ? Number(values.portfolio_id) : null,
      start_date: values.start_date,
      end_date: values.end_date,
      budget: values.budget === '' ? null : Number(values.budget),
      currency: values.currency,
      methodology: values.methodology,
      status: values.status,
    }))}>
      {error && <Alert>{error}</Alert>}
      <ProjectFields register={register} setValue={setValue} errors={errors} portfolios={portfolios} includeStatus />
      <div className="flex justify-end"><Button type="submit" isLoading={isLoading} className="sm:w-auto">Save changes</Button></div>
    </form>
  )
}

export function ProjectFields({ register, setValue, errors, portfolios, includeStatus = false }: { register: UseFormRegister<ProjectFormValues>; setValue: UseFormSetValue<ProjectFormValues>; errors: FieldErrors<ProjectFormValues>; portfolios: Portfolio[]; includeStatus?: boolean }) {
  const startDate = register('start_date')
  const endDate = register('end_date')

  return <>
    <div><Label htmlFor="project-name">Name</Label><Input id="project-name" hasError={Boolean(errors.name)} {...register('name')} />{errors.name && <p id="project-name-error" role="alert" className="mt-1 text-body-sm text-destructive">{errors.name.message}</p>}</div>
    <div><Label htmlFor="project-description">Description</Label><textarea id="project-description" rows={4} className="w-full rounded-lg border border-input bg-card px-3 py-2 text-body shadow-xs transition-[border-color,box-shadow] duration-150 placeholder:text-muted-foreground hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:text-body-sm" {...register('description')} /></div>
    <div className="grid gap-4 sm:grid-cols-2">
      <div><Label htmlFor="project-portfolio">Portfolio</Label><Select id="project-portfolio" {...register('portfolio_id')}><option value="">Standalone project</option>{portfolios.map((portfolio) => <option key={portfolio.id} value={portfolio.id}>{portfolio.name}</option>)}</Select></div>
      <div><Label htmlFor="project-methodology">Methodology</Label><Select id="project-methodology" {...register('methodology')}><option value="agile">Agile</option><option value="waterfall">Waterfall</option><option value="hybrid">Hybrid</option></Select></div>
    </div>
    <div className="grid gap-4 sm:grid-cols-2">
      <div><Label htmlFor="project-start">Start date</Label><Input id="project-start" type="date" hasError={Boolean(errors.start_date)} {...startDate} onInput={(event) => setValue('start_date', event.currentTarget.value, { shouldDirty: true })} />{errors.start_date && <p id="project-start-error" role="alert" className="mt-1 text-body-sm text-destructive">{errors.start_date.message}</p>}</div>
      <div><Label htmlFor="project-end">End date</Label><Input id="project-end" type="date" hasError={Boolean(errors.end_date)} {...endDate} onInput={(event) => setValue('end_date', event.currentTarget.value, { shouldDirty: true })} />{errors.end_date && <p id="project-end-error" role="alert" className="mt-1 text-body-sm text-destructive">{errors.end_date.message}</p>}</div>
    </div>
    <div className="grid gap-4 sm:grid-cols-2">
      <div><Label htmlFor="project-budget">Budget</Label><Input id="project-budget" inputMode="decimal" hasError={Boolean(errors.budget)} {...register('budget')} />{errors.budget && <p id="project-budget-error" role="alert" className="mt-1 text-body-sm text-destructive">{errors.budget.message}</p>}</div>
      <div><Label htmlFor="project-currency">Currency</Label><Input id="project-currency" {...register('currency')} /></div>
    </div>
    {includeStatus && <div><Label htmlFor="project-status">Status</Label><Select id="project-status" {...register('status')}><option value="PLANNING">Planning</option><option value="ACTIVE">Active</option><option value="ON_HOLD">On hold</option><option value="COMPLETED">Completed</option><option value="CANCELLED">Cancelled</option></Select></div>}
  </>
}
