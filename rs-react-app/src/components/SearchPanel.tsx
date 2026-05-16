import { Component, type ChangeEvent } from 'react'

interface SearchPanelProps {
  value: string
  isLoading: boolean
  onInputChange: (value: string) => void
  onSearch: () => void
}

export class SearchPanel extends Component<SearchPanelProps> {
  handleInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
    this.props.onInputChange(event.target.value)
  }

  render() {
    const { value, isLoading, onSearch } = this.props

    return (
      <section className="search-section" aria-label="Search section">
        <h1>Character Search</h1>
        <div className="search-controls">
          <input
            type="text"
            className="search-input"
            value={value}
            onChange={this.handleInputChange}
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
}
