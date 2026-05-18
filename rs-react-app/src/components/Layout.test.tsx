import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { Layout } from './Layout'

describe('Layout', () => {
  it('renders navigation links to Home and About', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Layout />
      </MemoryRouter>,
    )

    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'About' })).toBeInTheDocument()
  })

  it('marks Home link as active on root path', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Layout />
      </MemoryRouter>,
    )

    expect(screen.getByRole('link', { name: 'Home' })).toHaveClass('active')
    expect(screen.getByRole('link', { name: 'About' })).not.toHaveClass('active')
  })

  it('marks About link as active on /about path', () => {
    render(
      <MemoryRouter initialEntries={['/about']}>
        <Layout />
      </MemoryRouter>,
    )

    expect(screen.getByRole('link', { name: 'About' })).toHaveClass('active')
    expect(screen.getByRole('link', { name: 'Home' })).not.toHaveClass('active')
  })
})
