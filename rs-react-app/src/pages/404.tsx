import { Link } from 'react-router-dom'
import './404.css'

export function NotFoundPage() {
  return (
    <main className="not-found-page">
      <div className="not-found-portal">
        <span className="not-found-number">4</span>
        <span className="not-found-portal-icon" aria-hidden="true">🌀</span>
        <span className="not-found-number">4</span>
      </div>
      <h1 className="not-found-title">Page not found</h1>
      <p className="not-found-subtitle">
        This page got lost somewhere in the multiverse.<br />
        Even Rick can&apos;t find it.
      </p>
      <Link to="/" className="not-found-link">
        Back to Home
      </Link>
    </main>
  )
}
