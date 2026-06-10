import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import submissionsReducer from '../../store/submissionsSlice'
import countriesReducer from '../../store/countriesSlice'
import { UncontrolledForm } from './UncontrolledForm'

function renderWithStore(onSuccess = vi.fn()) {
  const store = configureStore({
    reducer: { submissions: submissionsReducer, countries: countriesReducer },
  })
  const utils = render(
    <Provider store={store}>
      <UncontrolledForm onSuccess={onSuccess} />
    </Provider>
  )
  return { ...utils, store, onSuccess }
}

describe('UncontrolledForm', () => {
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

  it('all inputs have htmlFor connected labels', () => {
    renderWithStore()
    const inputs = ['uc-name', 'uc-age', 'uc-email', 'uc-gender', 'uc-password', 'uc-confirm-password', 'uc-country', 'uc-image', 'uc-terms']
    for (const id of inputs) {
      expect(document.getElementById(id)).toBeInTheDocument()
      expect(document.querySelector(`label[for="${id}"]`)).toBeInTheDocument()
    }
  })

  it('shows validation errors on submit with empty form', async () => {
    const user = userEvent.setup()
    renderWithStore()
    await user.click(screen.getByRole('button', { name: /submit/i }))
    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument()
    })
  })

  it('shows error when name does not start with uppercase', async () => {
    const user = userEvent.setup()
    renderWithStore()
    await user.type(screen.getByLabelText(/^name$/i), 'john')
    await user.click(screen.getByRole('button', { name: /submit/i }))
    await waitFor(() => {
      expect(screen.getByText(/first letter must be uppercase/i)).toBeInTheDocument()
    })
  })

  it('shows password strength indicator when typing password', async () => {
    const user = userEvent.setup()
    renderWithStore()
    await user.type(screen.getByLabelText(/^password$/i), 'Abc1!')
    expect(screen.getByText(/strength/i)).toBeInTheDocument()
  })

  it('does not validate before submit (no errors on initial render)', () => {
    renderWithStore()
    expect(screen.queryByText(/required/i)).not.toBeInTheDocument()
  })

  it('calls onSuccess and dispatches submission on valid submit', async () => {
    const user = userEvent.setup()
    const { store, onSuccess } = renderWithStore()

    await user.type(screen.getByLabelText(/^name$/i), 'Alice')
    await user.type(screen.getByLabelText(/^age$/i), '25')
    await user.type(screen.getByLabelText(/email/i), 'alice@example.com')
    await user.selectOptions(screen.getByLabelText(/gender/i), 'female')
    await user.type(screen.getByLabelText(/^password$/i), 'Pass123!')
    await user.type(screen.getByLabelText(/confirm password/i), 'Pass123!')
    await user.type(screen.getByLabelText(/country/i), 'France')

    const file = new File(['image'], 'photo.png', { type: 'image/png' })
    await user.upload(screen.getByLabelText(/profile image/i), file)

    await user.click(screen.getByLabelText(/terms/i))
    await user.click(screen.getByRole('button', { name: /submit/i }))

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledOnce()
    })

    const submissions = store.getState().submissions.items
    expect(submissions).toHaveLength(1)
    expect(submissions[0].name).toBe('Alice')
    expect(submissions[0].email).toBe('alice@example.com')
  })

  it('shows passwords do not match error', async () => {
    const user = userEvent.setup()
    renderWithStore()

    await user.type(screen.getByLabelText(/^name$/i), 'Alice')
    await user.type(screen.getByLabelText(/^age$/i), '25')
    await user.type(screen.getByLabelText(/email/i), 'alice@example.com')
    await user.selectOptions(screen.getByLabelText(/gender/i), 'female')
    await user.type(screen.getByLabelText(/^password$/i), 'Pass123!')
    await user.type(screen.getByLabelText(/confirm password/i), 'Different!')
    await user.type(screen.getByLabelText(/country/i), 'France')
    const file = new File(['image'], 'photo.png', { type: 'image/png' })
    await user.upload(screen.getByLabelText(/profile image/i), file)
    await user.click(screen.getByLabelText(/terms/i))
    await user.click(screen.getByRole('button', { name: /submit/i }))

    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument()
    })
  })
})
