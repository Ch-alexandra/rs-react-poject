import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { SearchPanel } from './SearchPanel'

describe('SearchPanel', () => {
  it('renders the search input and button', () => {
    render(
      <SearchPanel value="Rick" isLoading={false} onInputChange={vi.fn()} onSearch={vi.fn()} />,
    )

    expect(screen.getByRole('textbox', { name: 'Search characters' })).toHaveValue('Rick')
    expect(screen.getByRole('button', { name: 'Search' })).toBeEnabled()
  })

  it('forwards input changes to the parent callback', () => {
    const onInputChange = vi.fn()

    render(
      <SearchPanel value="" isLoading={false} onInputChange={onInputChange} onSearch={vi.fn()} />,
    )

    fireEvent.change(screen.getByRole('textbox', { name: 'Search characters' }), {
      target: { value: 'Morty' },
    })

    expect(onInputChange).toHaveBeenLastCalledWith('Morty')
  })

  it('triggers search and disables the button while loading', async () => {
    const user = userEvent.setup()
    const onSearch = vi.fn()

    const { rerender } = render(
      <SearchPanel value="Rick" isLoading={false} onInputChange={vi.fn()} onSearch={onSearch} />,
    )

    await user.click(screen.getByRole('button', { name: 'Search' }))
    expect(onSearch).toHaveBeenCalledTimes(1)

    rerender(
      <SearchPanel value="Rick" isLoading={true} onInputChange={vi.fn()} onSearch={onSearch} />,
    )

    expect(screen.getByRole('button', { name: 'Search' })).toBeDisabled()
  })
})