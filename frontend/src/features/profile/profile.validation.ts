import { z } from 'zod'
import { passwordSchema } from '@/features/auth/auth.validation'

const optionalText = (max: number) =>
  z
    .string()
    .max(max, `max${max}Characters`)
    .transform((value) => value.trim())

export const profileSchema = z.object({
  full_name: z.string().trim().min(2, 'fullNameMustBeAtLeast2Characters').max(100, 'max100Characters'),
  username: z
    .string()
    .trim()
    .min(3, 'usernameMustBeAtLeast3Characters')
    .max(50, 'usernameMustBeAtMost50Characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'useOnlyLettersNumbersAndUnderscores'),
  phone: optionalText(20),
  position: optionalText(100),
  department: optionalText(100),
})

export const passwordFormSchema = z
  .object({
    current_password: z.string(),
    new_password: passwordSchema,
    confirm_password: z.string().min(1, 'pleaseConfirmYourNewPassword'),
  })
  .refine((values) => values.new_password === values.confirm_password, {
    message: 'passwordsDoNotMatch',
    path: ['confirm_password'],
  })

export const deleteAccountSchema = z.object({
  username: z.string().min(1, 'enterYourUsernameToConfirm'),
})

export type ProfileFormValues = z.infer<typeof profileSchema>
export type PasswordFormValues = z.infer<typeof passwordFormSchema>
export type DeleteAccountFormValues = z.infer<typeof deleteAccountSchema>
