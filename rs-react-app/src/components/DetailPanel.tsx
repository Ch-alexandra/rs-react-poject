import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { fetchCharacterById } from '../api/characterDetailApi'
import type { Character } from '../types/character'
import { Loader } from './Loader'
import './DetailPanel.css'

export function DetailPanel() {
  const [searchParams, setSearchParams] = useSearchParams()
  const detailId = searchParams.get('details')

  const [character, setCharacter] = useState<Character | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!detailId) return

    const controller = new AbortController()
    setIsLoading(true)
    setError(null)

    fetchCharacterById(Number(detailId), controller.signal)
      .then((data) => {
        setCharacter(data)
      })
      .catch((err) => {
        if (controller.signal.aborted) return
        setError(err instanceof Error ? err.message : 'Failed to load character.')
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false)
      })

    return () => controller.abort()
  }, [detailId])

  const handleClose = () => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.delete('details')
      return next
    })
  }

  if (!detailId) return null

  return (
    <aside className="detail-panel">
      <button className="detail-close" onClick={handleClose} aria-label="Close detail panel">
        ✕
      </button>

      {isLoading && <Loader />}

      {error && <p className="detail-error">{error}</p>}

      {!isLoading && !error && character && (
        <>
          <img className="detail-image" src={character.image} alt={character.name} />
          <h2 className="detail-name">{character.name}</h2>
          <p className="detail-description">{character.description}</p>
        </>
      )}
    </aside>
  )
}
