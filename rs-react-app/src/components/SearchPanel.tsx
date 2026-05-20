import type { ChangeEvent } from 'react'

interface SearchPanelProps {
  value: string
  isLoading: boolean
  onInputChange: (value: string) => void
  onSearch: () => void
}

export function SearchPanel({ value, isLoading, onInputChange, onSearch }: SearchPanelProps) {
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
    onInputChange(event.target.value)
  }

  return (
    <section className="search-section" aria-label="Search section">
      <h1>Character Search</h1>
      <div className="search-controls">
        <input
          type="text"
          className="search-input"
          value={value}
          onChange={handleInputChange}
          placeholder="Type a character name"
          aria-label="Search characters"
        />
        <button
          type="button"
          className="search-button"
          onClick={onSearch}
          disabled={isLoading}
        >
          Search
        </button>
      </div>
    </section>
  )
}
