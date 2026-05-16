import type { Character } from '../types/character'

interface ResultCardProps {
  item: Character
}

export function ResultCard({ item }: ResultCardProps) {
  return (
    <article className="result-card">
      <img className="result-card-image" src={item.image} alt={item.name} loading="lazy" />
      <div className="result-card-body">
        <h3>{item.name}</h3>
        <p>{item.description}</p>
      </div>
    </article>
  )
}