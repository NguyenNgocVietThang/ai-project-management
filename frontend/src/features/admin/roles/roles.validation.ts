import { z } from 'zod'

export const roleFormSchema = z.object({
  name: z.string().trim().min(2, 'nameMustBeAtLeast2Characters').max(50, 'max50Characters'),
  description: z.string().max(1000, 'max1000Characters').optional(),
  permission_ids: z.array(z.number()),
})

export type RoleFormValues = z.infer<typeof roleFormSchema>
