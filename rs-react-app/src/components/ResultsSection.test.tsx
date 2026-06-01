import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { characterListFixture } from '../test/fixtures'
import { ResultsSection } from './ResultsSection'

describe('ResultsSection', () => {
  it('shows the loader while items are loading', () => {
    render(<MemoryRouter><ResultsSection items={[]} isLoading={true} errorMessage={null} /></MemoryRouter>)

    expect(screen.getByRole('status')).toHaveTextContent('Loading items...')
    expect(screen.queryByText('No characters found for this search.')).not.toBeInTheDocument()
  })

  it('shows an error when loading fails', () => {
    render(<MemoryRouter><ResultsSection items={[]} isLoading={false} errorMessage="Unable to load items." /></MemoryRouter>)

    expect(screen.getByText('Unable to load items.')).toBeInTheDocument()
  })

  it('renders the results list when data is available', () => {
    render(<MemoryRouter><ResultsSection items={characterListFixture().results} isLoading={false} errorMessage={null} /></MemoryRouter>)

    expect(screen.getByText('Rick Sanchez')).toBeInTheDocument()
    expect(screen.getByText('Morty Smith')).toBeInTheDocument()
  })
})