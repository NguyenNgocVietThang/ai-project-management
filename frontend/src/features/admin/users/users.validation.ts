import { z } from 'zod'

const usernameSchema = z
  .string()
  .trim()
  .min(3, 'usernameMustBeAtLeast3Characters')
  .max(50, 'max50Characters')
  .regex(/^[a-zA-Z0-9_]+$/, 'onlyLettersNumbersAndUnderscoresAreAllowed')

const passwordSchema = z
  .string()
  .min(12, 'passwordMustBeAtLeast12Characters')
  .max(100, 'max100Characters')
  .refine((value) => /[0-9]/.test(value) || /[^a-zA-Z0-9\s]/.test(value), {
    message: 'passwordMustContainAtLeastOneNumberOrSpecialCharacter',
  })

export const createUserFormSchema = z.object({
  email: z.string().trim().email('enterAValidEmailAddress'),
  username: usernameSchema,
  full_name: z.string().trim().min(2, 'fullNameMustBeAtLeast2Characters').max(100, 'max100Characters'),
  password: passwordSchema,
  is_active: z.boolean(),
  role_ids: z.array(z.number()),
})

export const editUserFormSchema = z.object({
  full_name: z.string().trim().min(2, 'fullNameMustBeAtLeast2Characters').max(100, 'max100Characters'),
  username: usernameSchema,
  phone: z.string().max(20, 'max20Characters').optional(),
  position: z.string().max(100, 'max100Characters').optional(),
  department: z.string().max(100, 'max100Characters').optional(),
  is_active: z.boolean(),
  is_superuser: z.boolean(),
  role_ids: z.array(z.number()),
})

export type CreateUserFormValues = z.infer<typeof createUserFormSchema>
export type EditUserFormValues = z.infer<typeof editUserFormSchema>
