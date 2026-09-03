import { z } from 'zod'

const usernameSchema = z
  .string()
  .trim()
  .min(3, 'Username must be at least 3 characters')
  .max(50)
  .regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, and underscores are allowed')

const passwordSchema = z
  .string()
  .min(12, 'Password must be at least 12 characters')
  .max(100)
  .refine((value) => /[0-9]/.test(value) || /[^a-zA-Z0-9\s]/.test(value), {
    message: 'Password must contain at least one number or special character',
  })

export const createUserFormSchema = z.object({
  email: z.string().trim().email('Enter a valid email address'),
  username: usernameSchema,
  full_name: z.string().trim().min(2, 'Full name must be at least 2 characters').max(100),
  password: passwordSchema,
  is_active: z.boolean(),
  role_ids: z.array(z.number()),
})

export const editUserFormSchema = z.object({
  full_name: z.string().trim().min(2, 'Full name must be at least 2 characters').max(100),
  username: usernameSchema,
  phone: z.string().max(20).optional(),
  position: z.string().max(100).optional(),
  department: z.string().max(100).optional(),
  is_active: z.boolean(),
  is_superuser: z.boolean(),
  role_ids: z.array(z.number()),
})

export type CreateUserFormValues = z.infer<typeof createUserFormSchema>
export type EditUserFormValues = z.infer<typeof editUserFormSchema>
