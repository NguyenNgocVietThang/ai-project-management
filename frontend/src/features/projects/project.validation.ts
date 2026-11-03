import { z } from 'zod'

export const projectFormSchema = z
  .object({
    name: z.string().trim().min(3, 'nameMin').max(200, 'nameMax'),
    description: z.string().max(5000, 'descriptionMax').optional(),
    portfolio_id: z.string().optional(),
    start_date: z.string().min(1, 'startRequired'),
    end_date: z.string().min(1, 'endRequired'),
    budget: z
      .string()
      .refine((value) => value === '' || (!Number.isNaN(Number(value)) && Number(value) >= 0), {
        error: 'budgetMin',
      }),
    expected_benefit: z
      .string()
      .refine((value) => value === '' || (!Number.isNaN(Number(value)) && Number(value) >= 0), {
        error: 'benefitMin',
      }),
    currency: z.string().trim().min(3, 'currencyMin').max(10, 'currencyMax'),
    methodology: z.enum(['agile', 'waterfall', 'hybrid']),
    status: z.enum(['PLANNING', 'ACTIVE', 'ON_HOLD', 'COMPLETED', 'CANCELLED']).optional(),
  })
  .refine((values) => values.end_date >= values.start_date, {
    path: ['end_date'],
    error: 'dateOrder',
  })

export type ProjectFormValues = z.infer<typeof projectFormSchema>
