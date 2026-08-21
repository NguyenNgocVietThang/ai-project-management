import { z } from 'zod'

export const roleFormSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(50),
  description: z.string().max(1000).optional(),
  permission_ids: z.array(z.number()),
})

export type RoleFormValues = z.infer<typeof roleFormSchema>
