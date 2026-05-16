import type { Character } from '../types/character'
import { ResultCard } from './ResultCard'

interface CardListProps {
  items: Character[]
}

export function CardList({ items }: CardListProps) {
  if (items.length === 0) {
    return <p className="empty-state">No characters found for this search.</p>
  }

  return (
    <div className="card-list">
      {items.map((item) => (
        <ResultCard key={item.id} item={item} />
      ))}
    </div>
  )
}
