import { useSearchParams } from 'react-router-dom'
import type { Character } from '../types/character'

interface ResultCardProps {
  item: Character
}

export function ResultCard({ item }: ResultCardProps) {
  const [, setSearchParams] = useSearchParams()

  const handleClick = () => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.set('details', String(item.id))
      return next
    })
  }

  return (
    <article className="result-card" onClick={handleClick} role="button" tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
    >
      <img className="result-card-image" src={item.image} alt={item.name} loading="lazy" />
      <div className="result-card-body">
        <h3>{item.name}</h3>
        <p>{item.description}</p>
      </div>
    </article>
  )
}