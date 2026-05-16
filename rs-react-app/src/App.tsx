import { useEffect, useState } from 'react'
import './App.css'
import { fetchCharacters } from './api/charactersApi'
import { CrashSimulator } from './components/CrashSimulator'
import { ErrorBoundary } from './components/ErrorBoundary'
import { ResultsSection } from './components/ResultsSection'
import { SearchPanel } from './components/SearchPanel'
import type { Character } from './types/character'

const STORAGE_KEY = 'character-search-term'

function App() {
  const savedTerm = localStorage.getItem(STORAGE_KEY) ?? ''
  const [searchInput, setSearchInput] = useState(savedTerm)
  const [submittedSearch, setSubmittedSearch] = useState(savedTerm)
  const [items, setItems] = useState<Character[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [shouldCrash, setShouldCrash] = useState(false)

  useEffect(() => {
    fetchCharacters(submittedSearch)
      .then((result) => {
        setItems(result)
        setErrorMessage(null)
      })
      .catch((error) => {
        const message =
          error instanceof Error
            ? error.message
            : 'Something unexpected happened while loading results.'
        setItems([])
        setErrorMessage(message)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [submittedSearch])

  const handleInputChange = (value: string): void => {
    setSearchInput(value)
  }

  const handleSearch = (): void => {
    const trimmedSearch = searchInput.trim()

    if (trimmedSearch === submittedSearch) {
      return
    }

    localStorage.setItem(STORAGE_KEY, trimmedSearch)
    setSearchInput(trimmedSearch)
    setIsLoading(true)
    setSubmittedSearch(trimmedSearch)
  }

  const handleCrashTest = (): void => {
    setShouldCrash(true)
  }

  const handleResetError = (): void => {
    setShouldCrash(false)
  }

  return (
    <ErrorBoundary onReset={handleResetError}>
      <main className="app-shell">
        <SearchPanel
          value={searchInput}
          isLoading={isLoading}
          onInputChange={handleInputChange}
          onSearch={handleSearch}
        />

        <ResultsSection items={items} isLoading={isLoading} errorMessage={errorMessage} />

        <div className="crash-zone">
          <button type="button" className="danger-button" onClick={handleCrashTest}>
            Trigger Error
          </button>
        </div>

        <CrashSimulator shouldCrash={shouldCrash} />
      </main>
    </ErrorBoundary>
  )
}

export default App
