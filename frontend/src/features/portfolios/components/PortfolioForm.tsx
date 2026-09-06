'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Alert } from '@/components/common/Alert'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { Label } from '@/components/common/Label'
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
        <Label htmlFor="portfolio-name">Name</Label>
        <Input id="portfolio-name" hasError={Boolean(errors.name)} {...register('name')} />
        {errors.name && <p id="portfolio-name-error" role="alert" className="mt-1 text-sm text-destructive">{errors.name.message}</p>}
      </div>
      <div>
        <Label htmlFor="portfolio-description">Description</Label>
        <textarea
          id="portfolio-description"
          rows={4}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          {...register('description')}
        />
        {errors.description && <p id="portfolio-description-error" role="alert" className="mt-1 text-sm text-destructive">{errors.description.message}</p>}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="portfolio-start">Start date</Label>
          <Input id="portfolio-start" type="date" {...register('start_date')} />
        </div>
        <div>
          <Label htmlFor="portfolio-end">End date</Label>
          <Input id="portfolio-end" type="date" hasError={Boolean(errors.end_date)} {...register('end_date')} />
          {errors.end_date && <p id="portfolio-start-error" role="alert" className="mt-1 text-sm text-destructive">{errors.end_date.message}</p>}
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="portfolio-budget">Budget</Label>
          <Input id="portfolio-budget" inputMode="decimal" hasError={Boolean(errors.budget)} {...register('budget')} />
          {errors.budget && <p id="portfolio-budget-error" role="alert" className="mt-1 text-sm text-destructive">{errors.budget.message}</p>}
        </div>
        <div>
          <Label htmlFor="portfolio-currency">Currency</Label>
          <Input id="portfolio-currency" maxLength={10} {...register('currency')} />
        </div>
      </div>
      {portfolio && (
        <div>
          <Label htmlFor="portfolio-status">Status</Label>
          <select id="portfolio-status" className="h-11 w-full rounded-md border bg-background px-3" {...register('status')}>
            <option value="PLANNING">Planning</option>
            <option value="ACTIVE">Active</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>
      )}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" className="sm:w-auto" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading} className="sm:w-auto">
          {portfolio ? 'Save changes' : 'Create portfolio'}
        </Button>
      </div>
    </form>
  )
}
