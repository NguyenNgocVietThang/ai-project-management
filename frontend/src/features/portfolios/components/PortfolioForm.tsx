'use client'

import { useTranslations } from 'next-intl'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Alert } from '@/components/common/Alert'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { Label } from '@/components/common/Label'
import { Select } from '@/components/ui/Select'
import {
  portfolioFormSchema,
  type PortfolioFormValues,
} from '@/features/portfolios/portfolio.validation'
import type { Portfolio, PortfolioCreate, PortfolioUpdate } from '@/types/portfolio.types'

interface PortfolioFormProps {
  portfolio?: Portfolio
  onSubmit: (body: PortfolioCreate | PortfolioUpdate) => Promise<void>
  onCancel: () => void
  isLoading: boolean
  error?: string | null
}

export function PortfolioForm({ portfolio, onSubmit, onCancel, isLoading, error }: PortfolioFormProps) {
  const tw = useTranslations('workspaceUi')
  const tv = useTranslations('validation')
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PortfolioFormValues>({
    resolver: zodResolver(portfolioFormSchema),
    defaultValues: {
      name: portfolio?.name ?? '',
      description: portfolio?.description ?? '',
      start_date: portfolio?.start_date ?? '',
      end_date: portfolio?.end_date ?? '',
      budget: portfolio?.budget?.toString() ?? '',
      currency: portfolio?.currency ?? 'VND',
      status: portfolio?.status,
    },
  })

  return (
    <form
      noValidate
      className="space-y-5"
      onSubmit={handleSubmit(async (values) => {
        await onSubmit({
          name: values.name,
          description: values.description?.trim() || null,
          start_date: values.start_date || null,
          end_date: values.end_date || null,
          budget: values.budget === '' ? null : Number(values.budget),
          currency: values.currency,
          ...(portfolio && values.status ? { status: values.status } : {}),
        })
      })}
    >
      {error && <Alert>{error}</Alert>}
      <div>
        <Label htmlFor="portfolio-name">{tw('name')}</Label>
        <Input id="portfolio-name" hasError={Boolean(errors.name)} {...register('name')} />
        {errors.name && <p id="portfolio-name-error" role="alert" className="mt-1 text-body-sm text-destructive">{tv(errors.name.message || 'invalidChoice')}</p>}
      </div>
      <div>
        <Label htmlFor="portfolio-description">{tw('description')}</Label>
        <textarea
          id="portfolio-description"
          rows={4}
          aria-invalid={Boolean(errors.description) || undefined}
          aria-describedby={errors.description ? "portfolio-description-error" : undefined}
          className="w-full rounded-lg border border-input bg-card px-3 py-2 text-body shadow-xs transition-[border-color,box-shadow] duration-150 placeholder:text-muted-foreground hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:text-body-sm"
          {...register('description')}
        />
        {errors.description && <p id="portfolio-description-error" role="alert" className="mt-1 text-body-sm text-destructive">{tv(errors.description.message || 'invalidChoice')}</p>}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="portfolio-start">{tw('startDate')}</Label>
          <Input id="portfolio-start" type="date" {...register('start_date')} />
        </div>
        <div>
          <Label htmlFor="portfolio-end">{tw('endDate')}</Label>
          <Input id="portfolio-end" type="date" hasError={Boolean(errors.end_date)} {...register('end_date')} />
          {errors.end_date && <p id="portfolio-end-error" role="alert" className="mt-1 text-body-sm text-destructive">{tv(errors.end_date.message || 'invalidChoice')}</p>}
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="portfolio-budget">{tw('budget')}</Label>
          <Input id="portfolio-budget" inputMode="decimal" hasError={Boolean(errors.budget)} {...register('budget')} />
          {errors.budget && <p id="portfolio-budget-error" role="alert" className="mt-1 text-body-sm text-destructive">{tv(errors.budget.message || 'invalidChoice')}</p>}
        </div>
        <div>
          <Label htmlFor="portfolio-currency">{tw('currency')}</Label>
          <Input id="portfolio-currency" hasError={Boolean(errors.currency)} maxLength={10} {...register('currency')} />
          {errors.currency && <p id="portfolio-currency-error" role="alert" className="mt-1 text-body-sm text-destructive">{tv(errors.currency.message || 'invalidChoice')}</p>}
        </div>
      </div>
      {portfolio && (
        <div>
          <Label htmlFor="portfolio-status">{tw('status')}</Label>
          <Select id="portfolio-status" {...register('status')}>
            <option value="PLANNING">{tw('planning')}</option>
            <option value="ACTIVE">{tw('active')}</option>
            <option value="ARCHIVED">{tw('archived')}</option>
          </Select>
        </div>
      )}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" className="sm:w-auto" onClick={onCancel}>
          {tw('cancel')} </Button>
        <Button type="submit" isLoading={isLoading} className="sm:w-auto">
          {portfolio ? tw('saveChanges') : tw('createPortfolio')}
        </Button>
      </div>
    </form>
  )
}
