import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import submissionsReducer from '../../store/submissionsSlice'
import countriesReducer from '../../store/countriesSlice'
import { RHFForm } from './RHFForm'

function renderWithStore(onSuccess = vi.fn()) {
  const store = configureStore({
    reducer: { submissions: submissionsReducer, countries: countriesReducer },
  })
  const utils = render(
    <Provider store={store}>
      <RHFForm onSuccess={onSuccess} />
    </Provider>
  )
  return { ...utils, store, onSuccess }
}

describe('RHFForm', () => {
  it('renders all required fields', () => {
    renderWithStore()
    expect(screen.getByLabelText(/^name$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^age$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^email$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^gender$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^country$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/profile image/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/terms/i)).toBeInTheDocument()
  })

  it('submit button is disabled initially (no values)', () => {
    renderWithStore()
    expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled()
  })

  it('shows live validation error for invalid name', async () => {
    const user = userEvent.setup()
    renderWithStore()
    await user.type(screen.getByLabelText(/^name$/i), 'john')
    await user.tab()
    await waitFor(() => {
      expect(screen.getByText(/first letter must be uppercase/i)).toBeInTheDocument()
    })
  })

  it('submit button disabled when there are validation errors', async () => {
    const user = userEvent.setup()
    renderWithStore()
    await user.type(screen.getByLabelText(/^name$/i), 'john')
    await user.tab()
    expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled()
  })

  it('shows password strength indicator when typing', async () => {
    const user = userEvent.setup()
    renderWithStore()
    await user.type(screen.getByLabelText(/^password$/i), 'Abc1!')
    expect(screen.getByText(/strength/i)).toBeInTheDocument()
  })

  it('submit button stays disabled when passwords do not match', async () => {
    const user = userEvent.setup()
    renderWithStore()
    await user.type(screen.getByLabelText(/^name$/i), 'Alice')
    await user.type(screen.getByLabelText(/^age$/i), '25')
    await user.type(screen.getByLabelText(/^email$/i), 'alice@example.com')
    await user.selectOptions(screen.getByLabelText(/^gender$/i), 'female')
    await user.type(screen.getByLabelText(/^password$/i), 'Pass123!')
    await user.type(screen.getByLabelText(/confirm password/i), 'Other123!')
    await user.type(screen.getByLabelText(/^country$/i), 'France')
    const file = new File(['image'], 'photo.png', { type: 'image/png' })
    await user.upload(screen.getByLabelText(/profile image/i), file)
    await user.click(screen.getByLabelText(/terms/i))
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled()
    })
  })

  it('all inputs have htmlFor connected labels', () => {
    renderWithStore()
    const ids = ['rhf-name', 'rhf-age', 'rhf-email', 'rhf-gender', 'rhf-password', 'rhf-confirm-password', 'rhf-country', 'rhf-image', 'rhf-terms']
    for (const id of ids) {
      expect(document.getElementById(id)).toBeInTheDocument()
      expect(document.querySelector(`label[for="${id}"]`)).toBeInTheDocument()
    }
  })

  it('calls onSuccess and dispatches on valid submit', async () => {
    const user = userEvent.setup()
    const { store, onSuccess } = renderWithStore()

    await user.type(screen.getByLabelText(/^name$/i), 'Alice')
    await user.type(screen.getByLabelText(/^age$/i), '25')
    await user.type(screen.getByLabelText(/^email$/i), 'alice@example.com')
    await user.selectOptions(screen.getByLabelText(/^gender$/i), 'female')
    await user.type(screen.getByLabelText(/^password$/i), 'Pass123!')
    await user.type(screen.getByLabelText(/confirm password/i), 'Pass123!')
    await user.type(screen.getByLabelText(/^country$/i), 'France')

    const file = new File(['image'], 'photo.png', { type: 'image/png' })
    await user.upload(screen.getByLabelText(/profile image/i), file)
    // RHF file input uses onChange via setValue, trigger via fireEvent
    fireEvent.change(screen.getByLabelText(/profile image/i), { target: { files: [file] } })

    await user.click(screen.getByLabelText(/terms/i))

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /submit/i })).not.toBeDisabled()
    })

    await user.click(screen.getByRole('button', { name: /submit/i }))

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledOnce()
    })

    const submissions = store.getState().submissions.items
    expect(submissions).toHaveLength(1)
    expect(submissions[0].name).toBe('Alice')
  })
})
