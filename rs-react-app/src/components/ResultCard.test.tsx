import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { characterFixture } from '../test/fixtures'
import { ResultCard } from './ResultCard'

describe('ResultCard', () => {
  it('renders the character name, description, and image', () => {
    const item = characterFixture()

    render(<ResultCard item={item} />)

    expect(screen.getByRole('heading', { name: item.name })).toBeInTheDocument()
    expect(screen.getByText(item.description)).toBeInTheDocument()
    expect(screen.getByRole('img', { name: item.name })).toHaveAttribute('src', item.image)
  })
})