import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { AboutPage } from './AboutPage'

describe('AboutPage', () => {
  it('renders author info and course link', () => {
    render(
      <MemoryRouter>
        <AboutPage />
      </MemoryRouter>,
    )

    expect(screen.getByRole('link', { name: /RS School React Course/i })).toHaveAttribute(
      'href',
      'https://rs.school/courses/reactjs',
    )
    expect(screen.getByRole('link', { name: /Ch-alexandra/i })).toHaveAttribute(
      'href',
      'https://github.com/Ch-alexandra',
    )
  })
})
