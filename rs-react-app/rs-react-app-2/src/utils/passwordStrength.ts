export type PasswordStrength = 'weak' | 'medium' | 'strong'

export interface PasswordCriteria {
  hasNumber: boolean
  hasUppercase: boolean
  hasLowercase: boolean
  hasSpecial: boolean
}

export function getPasswordCriteria(password: string): PasswordCriteria {
  return {
    hasNumber: password.split('').some((c) => c >= '0' && c <= '9'),
    hasUppercase: password.split('').some((c) => c >= 'A' && c <= 'Z'),
    hasLowercase: password.split('').some((c) => c >= 'a' && c <= 'z'),
    hasSpecial: password.split('').some((c) => '!@#$%^&*()_+-=[]{}|;:,.<>?'.includes(c)),
  }
}

export function getPasswordStrength(password: string): PasswordStrength {
  if (!password) return 'weak'
  const { hasNumber, hasUppercase, hasLowercase, hasSpecial } = getPasswordCriteria(password)
  const score = [hasNumber, hasUppercase, hasLowercase, hasSpecial].filter(Boolean).length
  if (score <= 1) return 'weak'
  if (score <= 3) return 'medium'
  return 'strong'
}
