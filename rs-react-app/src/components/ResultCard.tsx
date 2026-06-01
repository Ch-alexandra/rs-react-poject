import { useNavigate, useSearchParams } from 'react-router-dom'
import { useSelectionStore } from '../store/selectedSlice'
import type { Character } from '../types/character'

interface ResultCardProps {
  item: Character
}

export function ResultCard({ item }: ResultCardProps) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const selectedItems = useSelectionStore((s) => s.selectedItems)
  const toggleItem = useSelectionStore((s) => s.toggleItem)

  const isSelected = selectedItems.some((s) => s.id === item.id)

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    navigate({ pathname: `/details/${item.id}`, search: searchParams.toString() })
  }

  const handleCardKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.stopPropagation()
      navigate({ pathname: `/details/${item.id}`, search: searchParams.toString() })
    }
  }

  return (
    <article
      className={`result-card${isSelected ? ' result-card--selected' : ''}`}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={handleCardKeyDown}
    >
      <input
        type="checkbox"
        className="result-card-checkbox"
        checked={isSelected}
        onChange={() => toggleItem(item)}
        onClick={(e) => e.stopPropagation()}
        style={{ cursor: 'pointer' }}
        aria-label={`Select ${item.name}`}
      />
      <img className="result-card-image" src={item.image} alt={item.name} loading="lazy" />
      <div className="result-card-body">
        <h3>{item.name}</h3>
        <p>{item.description}</p>
      </div>
    </article>
  )
}