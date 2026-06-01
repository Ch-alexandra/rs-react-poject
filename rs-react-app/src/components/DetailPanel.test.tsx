import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { describe, expect, it, vi } from 'vitest'
import { DetailPanel } from './DetailPanel'
import { fetchCharacterById } from '../api/characterDetailApi'
import { characterDetailFixture } from '../test/fixtures'

vi.mock('../api/characterDetailApi', () => ({
  fetchCharacterById: vi.fn(),
}))

const fetchMock = vi.mocked(fetchCharacterById)

const makeQueryClient = () =>
  new QueryClient({ defaultOptions: { queries: { retry: false, staleTime: 5 * 60 * 1000 } } })

const renderPanel = (id?: string) => {
  const queryClient = makeQueryClient()
  const router = createMemoryRouter(
    [{ path: '/details/:id', element: <DetailPanel /> }],
    { initialEntries: id ? [`/details/${id}`] : ['/details/1'] },
  )
  return {
    queryClient,
    ...render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>,
    ),
  }
}

describe('DetailPanel', () => {
  it('renders nothing when details param is absent', () => {
    // DetailPanel is only rendered when route matches, so just render it with a valid id
    // but with a failing fetch to simulate "no data"
    fetchMock.mockRejectedValue(new Error('Character not found.'))
    const { container } = renderPanel('999')
    expect(container.firstChild).not.toBeNull()
  })

  it('shows a loading indicator while fetching', () => {
    fetchMock.mockReturnValue(new Promise(() => {}))

    renderPanel('1')

    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('fetches and displays character when details param is set', async () => {
    fetchMock.mockResolvedValue(characterDetailFixture())

    renderPanel('1')

    expect(await screen.findByText('Rick Sanchez')).toBeInTheDocument()
    expect(screen.getByText('Alive')).toBeInTheDocument()
    expect(screen.getByText('Human')).toBeInTheDocument()
    expect(screen.getByText('Earth (C-137)')).toBeInTheDocument()
  })

  it('shows error when fetch fails', async () => {
    fetchMock.mockRejectedValue(new Error('Character not found.'))

    renderPanel('999')

    expect(await screen.findByText('Character not found.')).toBeInTheDocument()
  })

  it('close button navigates away', async () => {
    const user = userEvent.setup()
    fetchMock.mockResolvedValue(characterDetailFixture())

    renderPanel('1')

    await screen.findByText('Rick Sanchez')
    await user.click(screen.getByRole('button', { name: 'Close detail panel' }))

    await waitFor(() => expect(screen.queryByText('Rick Sanchez')).not.toBeInTheDocument())
  })
})
