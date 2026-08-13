import { z } from 'zod'
import { passwordSchema } from '@/features/auth/auth.validation'

const optionalText = (max: number) =>
  z
    .string()
    .max(max, `Must be at most ${max} characters`)
    .transform((value) => value.trim())

export const profileSchema = z.object({
  full_name: z.string().trim().min(2, 'Full name must be at least 2 characters').max(100),
  username: z
    .string()
    .trim()
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must be at most 50 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Use only letters, numbers, and underscores'),
  phone: optionalText(20),
  position: optionalText(100),
  department: optionalText(100),
})

export const passwordFormSchema = z
  .object({
    current_password: z.string(),
    new_password: passwordSchema,
    confirm_password: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((values) => values.new_password === values.confirm_password, {
    message: 'Passwords do not match',
    path: ['confirm_password'],
  })

export const deleteAccountSchema = z.object({
  username: z.string().min(1, 'Enter your username to confirm'),
})

export type ProfileFormValues = z.infer<typeof profileSchema>
export type PasswordFormValues = z.infer<typeof passwordFormSchema>
export type DeleteAccountFormValues = z.infer<typeof deleteAccountSchema>
