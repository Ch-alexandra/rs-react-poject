import { useState } from 'react'
import { Outlet, useNavigate, useOutlet, useSearchParams } from 'react-router-dom'
import './App.css'
import { CrashSimulator } from './components/CrashSimulator'
import { ErrorBoundary } from './components/ErrorBoundary'
import { Pagination } from './components/Pagination'
import { ResultsSection } from './components/ResultsSection'
import { SearchPanel } from './components/SearchPanel'
import { useLocalStorage } from './hooks/useLocalStorage'
import { useCharactersQuery } from './hooks/useCharactersQuery'

const STORAGE_KEY = 'character-search-term'

function App() {
  const [searchParams, setSearchParams] = useSearchParams()
  const currentPage = Math.max(1, Number(searchParams.get('page') ?? 1))
  const outlet = useOutlet()
  const hasDetail = Boolean(outlet)
  const navigate = useNavigate()

  const [savedTerm, setSavedTerm] = useLocalStorage<string>(STORAGE_KEY, '')
  const [searchInput, setSearchInput] = useState(savedTerm)
  const [submittedSearch, setSubmittedSearch] = useState(savedTerm)
  const [shouldCrash, setShouldCrash] = useState(false)

  const { data, isFetching, error } = useCharactersQuery(submittedSearch, currentPage)

  const items = data?.results ?? []
  const totalPages = data?.totalPages ?? 1
  const isLoading = isFetching
  const errorMessage = error ? error.message : null

  const handleInputChange = (value: string): void => {
    setSearchInput(value)
  }

  const handleSearch = (): void => {
    const trimmedSearch = searchInput.trim()

    if (trimmedSearch === submittedSearch) {
      return
    }

    setSavedTerm(trimmedSearch)
    setSearchInput(trimmedSearch)
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.set('page', '1')
      return next
    })
    setSubmittedSearch(trimmedSearch)
  }

  const handlePageChange = (page: number): void => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.set('page', String(page))
      return next
    })
  }

  const handleCrashTest = (): void => {
    setShouldCrash(true)
  }

  const handleResetError = (): void => {
    setShouldCrash(false)
  }

  const handleCloseDetail = (): void => {
    navigate({ pathname: '/', search: searchParams.toString() })
  }

  return (
    <ErrorBoundary onReset={handleResetError}>
      <main className={`app-shell${hasDetail ? ' app-shell--split' : ''}`}>
        <div
          className="app-main"
          onClick={hasDetail ? handleCloseDetail : undefined}
          role={hasDetail ? 'button' : undefined}
          aria-label={hasDetail ? 'Close detail panel' : undefined}
          tabIndex={hasDetail ? 0 : undefined}
          onKeyDown={hasDetail ? (e) => e.key === 'Enter' && handleCloseDetail() : undefined}
          style={hasDetail ? { cursor: 'pointer' } : undefined}
        >
          <SearchPanel
            value={searchInput}
            isLoading={isLoading}
            onInputChange={handleInputChange}
            onSearch={handleSearch}
          />

          <ResultsSection items={items} isLoading={isLoading} errorMessage={errorMessage} />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />

          <div className="crash-zone">
            <button type="button" className="danger-button" onClick={handleCrashTest}>
              Trigger Error
            </button>
          </div>

          <CrashSimulator shouldCrash={shouldCrash} />
        </div>

        {hasDetail && <Outlet />}
      </main>
    </ErrorBoundary>
  )
}

export default App
