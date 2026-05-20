import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import './App.css'
import { fetchCharacters } from './api/charactersApi'
import { CrashSimulator } from './components/CrashSimulator'
import { DetailPanel } from './components/DetailPanel'
import { ErrorBoundary } from './components/ErrorBoundary'
import { Pagination } from './components/Pagination'
import { ResultsSection } from './components/ResultsSection'
import { SearchPanel } from './components/SearchPanel'
import { useLocalStorage } from './hooks/useLocalStorage'
import type { Character } from './types/character'

const STORAGE_KEY = 'character-search-term'

function App() {
  const [searchParams, setSearchParams] = useSearchParams()
  const currentPage = Math.max(1, Number(searchParams.get('page') ?? 1))
  const hasDetail = Boolean(searchParams.get('details'))

  const [savedTerm, setSavedTerm] = useLocalStorage<string>(STORAGE_KEY, '')
  const [searchInput, setSearchInput] = useState(savedTerm)
  const [submittedSearch, setSubmittedSearch] = useState(savedTerm)
  const [items, setItems] = useState<Character[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [shouldCrash, setShouldCrash] = useState(false)

  useEffect(() => {
    const controller = new AbortController()

    fetchCharacters(submittedSearch, currentPage, controller.signal)
      .then((result) => {
        setItems(result.results)
        setTotalPages(result.totalPages)
        setErrorMessage(null)
      })
      .catch((error) => {
        if (controller.signal.aborted) return
        const message =
          error instanceof Error
            ? error.message
            : 'Something unexpected happened while loading results.'
        setItems([])
        setTotalPages(1)
        setErrorMessage(message)
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false)
      })

    return () => controller.abort()
  }, [submittedSearch, currentPage])

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
    setIsLoading(true)
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.set('page', '1')
      return next
    })
    setSubmittedSearch(trimmedSearch)
  }

  const handlePageChange = (page: number): void => {
    setIsLoading(true)
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

  return (
    <ErrorBoundary onReset={handleResetError}>
      <main className={`app-shell${hasDetail ? ' app-shell--split' : ''}`}>
        <div className="app-main">
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

        {hasDetail && <DetailPanel />}
      </main>
    </ErrorBoundary>
  )
}

export default App
