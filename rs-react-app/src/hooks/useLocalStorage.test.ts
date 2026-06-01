import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { useLocalStorage } from './useLocalStorage'

describe('useLocalStorage', () => {
  afterEach(() => {
    localStorage.clear()
  })

  it('returns the default value when nothing is stored', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'))
    expect(result.current[0]).toBe('default')
  })

  it('returns the stored value when one exists', () => {
    localStorage.setItem('test-key', JSON.stringify('saved'))
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'))
    expect(result.current[0]).toBe('saved')
  })

  it('persists the new value to localStorage when setValue is called', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', ''))

    act(() => {
      result.current[1]('updated')
    })

    expect(result.current[0]).toBe('updated')
    expect(localStorage.getItem('test-key')).toBe(JSON.stringify('updated'))
  })

  it('returns the default value when the stored value is not valid JSON', () => {
    localStorage.setItem('test-key', 'not-json')
    const { result } = renderHook(() => useLocalStorage('test-key', 'fallback'))
    expect(result.current[0]).toBe('fallback')
  })
})
