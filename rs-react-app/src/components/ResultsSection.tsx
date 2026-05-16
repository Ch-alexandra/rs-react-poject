import type { Character } from '../types/character'
import { CardList } from './CardList'
import { Loader } from './Loader'

interface ResultsSectionProps {
  items: Character[]
  isLoading: boolean
  errorMessage: string | null
}

export function ResultsSection({ items, isLoading, errorMessage }: ResultsSectionProps) {
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
