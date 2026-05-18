import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { DetailPanel } from './DetailPanel'
import { fetchCharacterById } from '../api/characterDetailApi'
import { characterFixture } from '../test/fixtures'

vi.mock('../api/characterDetailApi', () => ({
  fetchCharacterById: vi.fn(),
}))

const fetchMock = vi.mocked(fetchCharacterById)

const renderPanel = (search = '') =>
  render(
    <MemoryRouter initialEntries={[`/${search}`]}>
      <DetailPanel />
    </MemoryRouter>,
  )

describe('DetailPanel', () => {
  it('renders nothing when details param is absent', () => {
    const { container } = renderPanel()
    expect(container.firstChild).toBeNull()
  })

  it('fetches and displays character when details param is set', async () => {
    fetchMock.mockResolvedValue(characterFixture())

    renderPanel('?details=1')

    expect(await screen.findByText('Rick Sanchez')).toBeInTheDocument()
    expect(screen.getByText('Human, Alive, Male')).toBeInTheDocument()
  })

  it('shows error when fetch fails', async () => {
    fetchMock.mockRejectedValue(new Error('Character not found.'))

    renderPanel('?details=999')

    expect(await screen.findByText('Character not found.')).toBeInTheDocument()
  })

  it('close button removes details param', async () => {
    const user = userEvent.setup()
    fetchMock.mockResolvedValue(characterFixture())

    renderPanel('?details=1')

    await screen.findByText('Rick Sanchez')
    await user.click(screen.getByRole('button', { name: 'Close detail panel' }))

    await waitFor(() => expect(screen.queryByText('Rick Sanchez')).not.toBeInTheDocument())
  })
})
