import { z } from 'zod'

export const projectFormSchema = z
  .object({
    name: z.string().trim().min(3, 'Name must be at least 3 characters').max(200),
    description: z.string().max(5000).optional(),
    portfolio_id: z.string().optional(),
    start_date: z.string().min(1, 'Start date is required'),
    end_date: z.string().min(1, 'End date is required'),
    budget: z
      .string()
      .refine((value) => value === '' || (!Number.isNaN(Number(value)) && Number(value) >= 0), {
        message: 'Budget must be zero or greater',
      }),
    currency: z.string().trim().min(3).max(10),
    methodology: z.enum(['agile', 'waterfall', 'hybrid']),
    status: z.enum(['PLANNING', 'ACTIVE', 'ON_HOLD', 'COMPLETED', 'CANCELLED']).optional(),
  })
  .refine((values) => values.end_date >= values.start_date, {
    path: ['end_date'],
    message: 'End date must be on or after start date',
  })

export type ProjectFormValues = z.infer<typeof projectFormSchema>
