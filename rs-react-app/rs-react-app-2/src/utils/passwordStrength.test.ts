import { describe, it, expect } from 'vitest'
import { getPasswordStrength, getPasswordCriteria } from './passwordStrength'

describe('getPasswordCriteria', () => {
  it('detects number', () => {
    expect(getPasswordCriteria('abc1').hasNumber).toBe(true)
    expect(getPasswordCriteria('abc').hasNumber).toBe(false)
  })

  it('detects uppercase', () => {
    expect(getPasswordCriteria('Abc').hasUppercase).toBe(true)
    expect(getPasswordCriteria('abc').hasUppercase).toBe(false)
  })

  it('detects lowercase', () => {
    expect(getPasswordCriteria('ABc').hasLowercase).toBe(true)
    expect(getPasswordCriteria('ABC').hasLowercase).toBe(false)
  })

  it('detects special character', () => {
    expect(getPasswordCriteria('abc!').hasSpecial).toBe(true)
    expect(getPasswordCriteria('abc').hasSpecial).toBe(false)
  })
})

describe('getPasswordStrength', () => {
  it('returns weak for empty string', () => {
    expect(getPasswordStrength('')).toBe('weak')
  })

  it('returns weak for password with 1 criteria met', () => {
    expect(getPasswordStrength('abc')).toBe('weak')
  })

  it('returns medium for password with 2-3 criteria met', () => {
    expect(getPasswordStrength('Abc1')).toBe('medium')
  })

  it('returns strong for password with all 4 criteria met', () => {
    expect(getPasswordStrength('Abc1!')).toBe('strong')
  })
})
