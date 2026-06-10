import { z } from 'zod'

const MAX_IMAGE_SIZE = 2 * 1024 * 1024
const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg']

function validateEmail(email: string): boolean {
  const atIndex = email.indexOf('@')
  const lastAtIndex = email.lastIndexOf('@')
  
  if (atIndex === -1 || atIndex !== lastAtIndex) return false
  const localPart = email.slice(0, atIndex)
  const domain = email.slice(atIndex + 1)

  if (localPart.length === 0) return false

  if (!domain.includes('.')) return false

  const dotIndex = domain.lastIndexOf('.')
  if (dotIndex === 0 || dotIndex === domain.length - 1) return false
  return true
}

export const formSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Name is required')
      .refine((val) => val[0] === val[0]?.toUpperCase(), {
        message: 'First letter must be uppercase',
      }),
    age: z
      .number({ message: 'Age must be a number' })
      .int('Age must be a whole number')
      .nonnegative('Age must be 0 or greater'),
    email: z
      .string()
      .min(1, 'Email is required')
      .refine(validateEmail, { message: 'Enter a valid email address' }),
    gender: z.enum(['male', 'female', 'other'], { message: 'Please select a gender' }),
    password: z.string().min(1, 'Password is required'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    country: z.string().min(1, 'Country is required'),
    terms: z.literal(true, { message: 'You must accept the Terms & Conditions' }),
    image: z
      .instanceof(File, { message: 'Image is required' })
      .refine((file) => ALLOWED_IMAGE_TYPES.includes(file.type), {
        message: 'Only PNG or JPEG images are allowed',
      })
      .refine((file) => file.size <= MAX_IMAGE_SIZE, {
        message: 'Image must be 2 MB or smaller',
      }),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Passwords do not match',
        path: ['confirmPassword'],
      })
    }
  })

export type FormValues = z.infer<typeof formSchema>

export function validateCountry(country: string, countriesList: string[]): boolean {
  return countriesList.includes(country)
}
