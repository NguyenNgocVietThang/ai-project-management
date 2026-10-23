'use client'

import { useTranslations } from 'next-intl'

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
  const tw = useTranslations('workspaceUi')
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      name: project.name,
      description: project.description ?? '',
      portfolio_id: project.portfolio_id?.toString() ?? '',
      start_date: project.start_date ?? '',
      end_date: project.end_date ?? '',
      budget: project.budget?.toString() ?? '',
      expected_benefit: project.expected_benefit?.toString() ?? '',
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
      expected_benefit: values.expected_benefit === '' ? null : Number(values.expected_benefit),
      currency: values.currency,
      methodology: values.methodology,
      status: values.status,
    }))}>
      {error && <Alert>{error}</Alert>}
      <ProjectFields register={register} setValue={setValue} errors={errors} portfolios={portfolios} includeStatus />
      <div className="flex justify-end"><Button type="submit" isLoading={isLoading} className="sm:w-auto">{tw('saveChanges')}</Button></div>
    </form>
  )
}

export function ProjectFields({ register, setValue, errors, portfolios, includeStatus = false }: { register: UseFormRegister<ProjectFormValues>; setValue: UseFormSetValue<ProjectFormValues>; errors: FieldErrors<ProjectFormValues>; portfolios: Portfolio[]; includeStatus?: boolean }) {
  const tw = useTranslations('workspaceUi')
  const tv = useTranslations('validation')
  const startDate = register('start_date')
  const endDate = register('end_date')

  return <>
    <div><Label htmlFor="project-name">{tw('name')}</Label><Input id="project-name" hasError={Boolean(errors.name)} {...register('name')} />{errors.name && <p id="project-name-error" role="alert" className="mt-1 text-body-sm text-destructive">{tv(errors.name.message || 'invalidChoice')}</p>}</div>
    <div><Label htmlFor="project-description">{tw('description')}</Label><textarea id="project-description" rows={4} aria-invalid={Boolean(errors.description) || undefined} aria-describedby={errors.description ? "project-description-error" : undefined} className="w-full rounded-lg border border-input bg-card px-3 py-2 text-body shadow-xs transition-[border-color,box-shadow] duration-150 placeholder:text-muted-foreground hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:text-body-sm" {...register('description')} />{errors.description && <p id="project-description-error" role="alert" className="mt-1 text-body-sm text-destructive">{tv(errors.description.message || 'invalidChoice')}</p>}</div>
    <div className="grid gap-4 sm:grid-cols-2">
      <div><Label htmlFor="project-portfolio">{tw('portfolioLabel')}</Label><Select id="project-portfolio" {...register('portfolio_id')}><option value="">{tw('standaloneProject')}</option>{portfolios.map((portfolio) => <option key={portfolio.id} value={portfolio.id}>{portfolio.name}</option>)}</Select></div>
      <div><Label htmlFor="project-methodology">{tw('methodology')}</Label><Select id="project-methodology" {...register('methodology')}><option value="agile">{tw('agile')}</option><option value="waterfall">{tw('waterfall')}</option><option value="hybrid">{tw('hybrid')}</option></Select></div>
    </div>
    <div className="grid gap-4 sm:grid-cols-2">
      <div><Label htmlFor="project-start">{tw('startDate')}</Label><Input id="project-start" type="date" hasError={Boolean(errors.start_date)} {...startDate} onInput={(event) => setValue('start_date', event.currentTarget.value, { shouldDirty: true })} />{errors.start_date && <p id="project-start-error" role="alert" className="mt-1 text-body-sm text-destructive">{tv(errors.start_date.message || 'invalidChoice')}</p>}</div>
      <div><Label htmlFor="project-end">{tw('endDate')}</Label><Input id="project-end" type="date" hasError={Boolean(errors.end_date)} {...endDate} onInput={(event) => setValue('end_date', event.currentTarget.value, { shouldDirty: true })} />{errors.end_date && <p id="project-end-error" role="alert" className="mt-1 text-body-sm text-destructive">{tv(errors.end_date.message || 'invalidChoice')}</p>}</div>
    </div>
    <div className="grid gap-4 sm:grid-cols-3">
      <div><Label htmlFor="project-budget">{tw('budget')}</Label><Input id="project-budget" inputMode="decimal" hasError={Boolean(errors.budget)} {...register('budget')} />{errors.budget && <p id="project-budget-error" role="alert" className="mt-1 text-body-sm text-destructive">{tv(errors.budget.message || 'invalidChoice')}</p>}</div>
      <div><Label htmlFor="project-expected-benefit">{tw('expectedBenefit')}</Label><Input id="project-expected-benefit" inputMode="decimal" hasError={Boolean(errors.expected_benefit)} {...register('expected_benefit')} />{errors.expected_benefit && <p id="project-expected-benefit-error" role="alert" className="mt-1 text-body-sm text-destructive">{tv(errors.expected_benefit.message || 'invalidChoice')}</p>}</div>
      <div><Label htmlFor="project-currency">{tw('currency')}</Label><Input id="project-currency" hasError={Boolean(errors.currency)} {...register('currency')} />{errors.currency && <p id="project-currency-error" role="alert" className="mt-1 text-body-sm text-destructive">{tv(errors.currency.message || 'invalidChoice')}</p>}</div>
    </div>
    {includeStatus && <div><Label htmlFor="project-status">{tw('status')}</Label><Select id="project-status" {...register('status')}><option value="PLANNING">{tw('planning')}</option><option value="ACTIVE">{tw('active')}</option><option value="ON_HOLD">{tw('onHold')}</option><option value="COMPLETED">{tw('completed')}</option><option value="CANCELLED">{tw('cancelled')}</option></Select></div>}
  </>
}
