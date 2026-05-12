import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { characterListFixture } from '../test/fixtures'
import { CardList } from './CardList'

describe('CardList', () => {
  it('shows an empty state when there are no items', () => {
    render(<CardList items={[]} />)

    expect(screen.getByText('No characters found for this search.')).toBeInTheDocument()
  })

  it('renders one result card per item', () => {
    const items = characterListFixture()

    render(<CardList items={items} />)

    expect(screen.getByText('Rick Sanchez')).toBeInTheDocument()
    expect(screen.getByText('Morty Smith')).toBeInTheDocument()
    expect(screen.getAllByRole('article')).toHaveLength(2)
  })
})