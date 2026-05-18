import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { characterListFixture } from '../test/fixtures'
import { CardList } from './CardList'

describe('CardList', () => {
  it('shows an empty state when there are no items', () => {
    render(<MemoryRouter><CardList items={[]} /></MemoryRouter>)

    expect(screen.getByText('No characters found for this search.')).toBeInTheDocument()
  })

  it('renders one result card per item', () => {
    const { results } = characterListFixture()

    render(<MemoryRouter><CardList items={results} /></MemoryRouter>)

    expect(screen.getByText('Rick Sanchez')).toBeInTheDocument()
    expect(screen.getByText('Morty Smith')).toBeInTheDocument()
    expect(screen.getAllByRole('button')).toHaveLength(2)
  })
})