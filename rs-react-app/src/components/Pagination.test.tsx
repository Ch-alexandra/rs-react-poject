import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Pagination } from './Pagination'

describe('Pagination', () => {
  it('renders nothing when totalPages is 1', () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={1} onPageChange={vi.fn()} />,
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders prev and next buttons', () => {
    render(<Pagination currentPage={3} totalPages={10} onPageChange={vi.fn()} />)
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Next page' })).toBeInTheDocument()
  })

  it('disables prev button on first page', () => {
    render(<Pagination currentPage={1} totalPages={5} onPageChange={vi.fn()} />)
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled()
  })

  it('disables next button on last page', () => {
    render(<Pagination currentPage={5} totalPages={5} onPageChange={vi.fn()} />)
    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled()
  })

  it('marks the current page button with aria-current="page"', () => {
    render(<Pagination currentPage={2} totalPages={5} onPageChange={vi.fn()} />)
    expect(screen.getByRole('button', { name: '2' })).toHaveAttribute('aria-current', 'page')
  })

  it('calls onPageChange with the next page when next is clicked', async () => {
    const user = userEvent.setup()
    const onPageChange = vi.fn()

    render(<Pagination currentPage={2} totalPages={5} onPageChange={onPageChange} />)
    await user.click(screen.getByRole('button', { name: 'Next page' }))

    expect(onPageChange).toHaveBeenCalledWith(3)
  })

  it('calls onPageChange with the previous page when prev is clicked', async () => {
    const user = userEvent.setup()
    const onPageChange = vi.fn()

    render(<Pagination currentPage={3} totalPages={5} onPageChange={onPageChange} />)
    await user.click(screen.getByRole('button', { name: 'Previous page' }))

    expect(onPageChange).toHaveBeenCalledWith(2)
  })

  it('calls onPageChange with a specific page when a number button is clicked', async () => {
    const user = userEvent.setup()
    const onPageChange = vi.fn()

    render(<Pagination currentPage={1} totalPages={5} onPageChange={onPageChange} />)
    await user.click(screen.getByRole('button', { name: '3' }))

    expect(onPageChange).toHaveBeenCalledWith(3)
  })
})
