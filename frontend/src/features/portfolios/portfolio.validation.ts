import { z } from 'zod'

export const portfolioFormSchema = z
  .object({
    name: z.string().trim().min(3, 'Name must be at least 3 characters').max(200),
    description: z.string().max(5000).optional(),
    start_date: z.string().optional(),
    end_date: z.string().optional(),
    budget: z
      .string()
      .refine((value) => value === '' || (!Number.isNaN(Number(value)) && Number(value) >= 0), {
        message: 'Budget must be zero or greater',
      }),
    currency: z.string().trim().min(3).max(10),
    status: z.enum(['PLANNING', 'ACTIVE', 'ARCHIVED']).optional(),
  })
  .refine(
    (values) => !values.start_date || !values.end_date || values.end_date >= values.start_date,
    { path: ['end_date'], message: 'End date must be on or after start date' }
  )

export type PortfolioFormValues = z.infer<typeof portfolioFormSchema>
