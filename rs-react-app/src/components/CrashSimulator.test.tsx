import { render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { CrashSimulator } from './CrashSimulator'

describe('CrashSimulator', () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleErrorSpy.mockRestore()
  })

  it('renders nothing when crashing is disabled', () => {
    const { container } = render(<CrashSimulator shouldCrash={false} />)

    expect(container).toBeEmptyDOMElement()
  })

  it('throws an error when crashing is enabled', () => {
    expect(() => render(<CrashSimulator shouldCrash={true} />)).toThrow(
      'Crash test triggered by user action.',
    )
  })
})