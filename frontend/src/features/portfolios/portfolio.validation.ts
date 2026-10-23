import { z } from 'zod'

export const portfolioFormSchema = z
  .object({
    name: z.string().trim().min(3, 'nameMin').max(200, 'nameMax'),
    description: z.string().max(5000, 'descriptionMax').optional(),
    start_date: z.string().optional(),
    end_date: z.string().optional(),
    budget: z
      .string()
      .refine((value) => value === '' || (!Number.isNaN(Number(value)) && Number(value) >= 0), {
        message: 'budgetMin',
      }),
    currency: z.string().trim().min(3, 'currencyMin').max(10, 'currencyMax'),
    status: z.enum(['PLANNING', 'ACTIVE', 'ARCHIVED']).optional(),
  })
  .refine(
    (values) => !values.start_date || !values.end_date || values.end_date >= values.start_date,
    { path: ['end_date'], message: 'dateOrder' }
  )

export type PortfolioFormValues = z.infer<typeof portfolioFormSchema>
