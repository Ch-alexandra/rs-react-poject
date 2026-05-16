import { Component } from 'react'
import type { Character } from '../types/character'
import { CardList } from './CardList'
import { Loader } from './Loader'

interface ResultsSectionProps {
  items: Character[]
  isLoading: boolean
  errorMessage: string | null
}

export class ResultsSection extends Component<ResultsSectionProps> {
  render() {
    const { items, isLoading, errorMessage } = this.props

    return (
      <section className="results-section" aria-label="Results section">
        <header className="results-header">
          <h2>Results</h2>
        </header>

        {isLoading && <Loader />}
        {!isLoading && errorMessage && <p className="error-text">{errorMessage}</p>}
        {!isLoading && !errorMessage && <CardList items={items} />}
      </section>
    )
  }
}
