import { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { fetchCharacterById } from '../api/characterDetailApi'
import type { CharacterDetail } from '../types/character'
import { Loader } from './Loader'
import './DetailPanel.css'

export function DetailPanel() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [character, setCharacter] = useState<CharacterDetail | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    const controller = new AbortController()
    setIsLoading(true)
    setError(null)

    fetchCharacterById(Number(id), controller.signal)
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
  }, [id])

  const handleClose = () => {
    navigate({ pathname: '/', search: searchParams.toString() })
  }

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
          <div className="detail-info">
            <div className="detail-row"><span className="detail-label">Status</span><span>{character.status}</span></div>
            <div className="detail-row"><span className="detail-label">Species</span><span>{character.species}</span></div>
            {character.type && <div className="detail-row"><span className="detail-label">Type</span><span>{character.type}</span></div>}
            <div className="detail-row"><span className="detail-label">Gender</span><span>{character.gender}</span></div>
            <div className="detail-row"><span className="detail-label">Origin</span><span>{character.origin}</span></div>
            <div className="detail-row"><span className="detail-label">Location</span><span>{character.location}</span></div>
            <div className="detail-row"><span className="detail-label">Episodes</span><span>{character.episodeCount}</span></div>
          </div>
        </>
      )}
    </aside>
  )
}
