import { render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import App from './App'
import { fetchCharacters } from './api/charactersApi'
import { characterListFixture } from './test/fixtures'

const renderApp = (initialPath = '/') => {
  const router = createMemoryRouter(
    [{ path: '/', element: <App />, children: [{ path: 'details/:id', element: <div /> }] }],
    { initialEntries: [initialPath] },
  )
  return render(<RouterProvider router={router} />)
}

vi.mock('./api/charactersApi', () => ({
  fetchCharacters: vi.fn(),
}))

const fetchCharactersMock = vi.mocked(fetchCharacters)

const createDeferred = <T,>() => {
  let resolve!: (value: T) => void
  let reject!: (reason?: unknown) => void

  const promise = new Promise<T>((promiseResolve, promiseReject) => {
    resolve = promiseResolve
    reject = promiseReject
  })

  return { promise, resolve, reject }
}

describe('App', () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    fetchCharactersMock.mockReset()
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleErrorSpy.mockRestore()
  })

  it('loads the saved search term from localStorage on mount', async () => {
    localStorage.setItem('character-search-term', '"Morty"')
    fetchCharactersMock.mockResolvedValue(characterListFixture())

    renderApp()

    expect(screen.getByRole('textbox', { name: 'Search characters' })).toHaveValue('Morty')
    await waitFor(() => expect(fetchCharactersMock).toHaveBeenCalledWith('Morty', 1, expect.any(AbortSignal)))
    expect(await screen.findByText('Rick Sanchez')).toBeInTheDocument()
  })

  it('loads initial data when localStorage is empty', async () => {
    fetchCharactersMock.mockResolvedValue({ results: [], totalPages: 1 })

    renderApp()

    await waitFor(() => expect(fetchCharactersMock).toHaveBeenCalledWith('', 1, expect.any(AbortSignal)))
    expect(screen.getByRole('textbox', { name: 'Search characters' })).toHaveValue('')
    expect(await screen.findByText('No characters found for this search.')).toBeInTheDocument()
  })

  it('trims, saves, and searches for a new term when the user clicks search', async () => {
    const user = userEvent.setup()
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem')

    fetchCharactersMock
      .mockResolvedValueOnce({ results: [], totalPages: 1 })
      .mockResolvedValueOnce(characterListFixture())

    renderApp()

    await waitFor(() => expect(fetchCharactersMock).toHaveBeenNthCalledWith(1, '', 1, expect.any(AbortSignal)))

    await user.type(screen.getByRole('textbox', { name: 'Search characters' }), '  Rick  ')
    await user.click(screen.getByRole('button', { name: 'Search' }))

    await waitFor(() => expect(fetchCharactersMock).toHaveBeenNthCalledWith(2, 'Rick', 1, expect.any(AbortSignal)))
    expect(setItemSpy).toHaveBeenCalledWith('character-search-term', '"Rick"')
    expect(screen.getByRole('textbox', { name: 'Search characters' })).toHaveValue('Rick')
    expect(await screen.findByText('Rick Sanchez')).toBeInTheDocument()

    setItemSpy.mockRestore()
  })

  it('does not re-run the same search term', async () => {
    const user = userEvent.setup()

    localStorage.setItem('character-search-term', '"Rick"')
    fetchCharactersMock.mockResolvedValue(characterListFixture())

    renderApp()

    await waitFor(() => expect(fetchCharactersMock).toHaveBeenCalledTimes(1))
    await user.click(screen.getByRole('button', { name: 'Search' }))

    expect(fetchCharactersMock).toHaveBeenCalledTimes(1)
  })

  it('shows and hides the loading state around an in-flight request', async () => {
    const deferred = createDeferred<ReturnType<typeof characterListFixture>>()
    fetchCharactersMock.mockReturnValue(deferred.promise)

    renderApp()

    expect(screen.getByRole('status')).toHaveTextContent('Loading items...')

    deferred.resolve(characterListFixture())

    await waitForElementToBeRemoved(() => screen.queryByRole('status'))
    expect(screen.getByText('Rick Sanchez')).toBeInTheDocument()
  })

  it('shows API errors when loading fails', async () => {
    fetchCharactersMock.mockRejectedValue(new Error('Unable to load characters.'))

    renderApp()

    expect(await screen.findByText('Unable to load characters.')).toBeInTheDocument()
  })

  it('shows the error boundary fallback when the crash button is used and recovers after reset', async () => {
    const user = userEvent.setup()

    fetchCharactersMock.mockResolvedValue({ results: [], totalPages: 1 })

    renderApp()

    await waitFor(() => expect(fetchCharactersMock).toHaveBeenCalledTimes(1))
    await user.click(screen.getByRole('button', { name: 'Trigger Error' }))

    expect(await screen.findByRole('heading', { name: 'Something went wrong.' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Reset App' }))

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Character Search' })).toBeInTheDocument()
    })
  })
})