import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { Layout } from './Layout'
import { ThemeProvider } from '../context/ThemeProvider'

const renderLayout = (initialPath = '/') =>
  render(
    <ThemeProvider>
      <MemoryRouter initialEntries={[initialPath]}>
        <Layout />
      </MemoryRouter>
    </ThemeProvider>,
  )

describe('Layout', () => {
  it('renders navigation links to Home and About', () => {
    renderLayout()

    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'About' })).toBeInTheDocument()
  })

  it('marks Home link as active on root path', () => {
    renderLayout('/')

    expect(screen.getByRole('link', { name: 'Home' })).toHaveClass('active')
    expect(screen.getByRole('link', { name: 'About' })).not.toHaveClass('active')
  })

  it('marks About link as active on /about path', () => {
    renderLayout('/about')

    expect(screen.getByRole('link', { name: 'About' })).toHaveClass('active')
    expect(screen.getByRole('link', { name: 'Home' })).not.toHaveClass('active')
  })
})
