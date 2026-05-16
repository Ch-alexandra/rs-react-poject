import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ErrorBoundary } from './ErrorBoundary'

class ThrowOnRender extends Error {
  constructor() {
    super('Boom')
  }
}

const CrashingChild = (): never => {
  throw new ThrowOnRender()
}

describe('ErrorBoundary', () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleErrorSpy.mockRestore()
  })

  it('renders fallback UI when a child throws', () => {
    render(
      <ErrorBoundary>
        <CrashingChild />
      </ErrorBoundary>,
    )

    expect(screen.getByRole('heading', { name: 'Something went wrong.' })).toBeInTheDocument()
    expect(screen.getByText('The app hit an unexpected error. Please reset and try again.')).toBeInTheDocument()
  })

  it('calls onReset when the fallback reset button is clicked', async () => {
    const user = userEvent.setup()
    const onReset = vi.fn()

    render(
      <ErrorBoundary onReset={onReset}>
        <CrashingChild />
      </ErrorBoundary>,
    )

    await user.click(screen.getByRole('button', { name: 'Reset App' }))

    expect(onReset).toHaveBeenCalledTimes(1)
  })
})