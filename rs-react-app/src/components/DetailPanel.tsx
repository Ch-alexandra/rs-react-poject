import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useCharacterDetailQuery } from '../hooks/useCharacterDetailQuery'
import { Loader } from './Loader'
import './DetailPanel.css'

export function DetailPanel() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const numericId = id ? Number(id) : undefined
  const { data: character, isFetching, error } = useCharacterDetailQuery(numericId)

  const isLoading = isFetching
  const errorMessage = error ? error.message : null

  const handleClose = () => {
    navigate({ pathname: '/', search: searchParams.toString() })
  }

  return (
    <aside className="detail-panel">
      <button className="detail-close" onClick={handleClose} aria-label="Close detail panel">
        ✕
      </button>

      {isLoading && <Loader />}

      {errorMessage && <p className="detail-error">{errorMessage}</p>}

      {!isLoading && !errorMessage && character && (
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
