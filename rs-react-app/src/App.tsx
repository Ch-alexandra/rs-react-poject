import { Component } from 'react'
import './App.css'
import { fetchCharacters } from './api/charactersApi'
import { CrashSimulator } from './components/CrashSimulator'
import { ErrorBoundary } from './components/ErrorBoundary'
import { ResultsSection } from './components/ResultsSection'
import { SearchPanel } from './components/SearchPanel'
import type { Character } from './types/character'

interface AppState {
  searchInput: string
  submittedSearch: string
  items: Character[]
  isLoading: boolean
  errorMessage: string | null
  shouldCrash: boolean
}

const STORAGE_KEY = 'character-search-term'

class App extends Component<object, AppState> {
    handleResetError = (): void => {
      this.setState({ shouldCrash: false })
    }
  state: AppState = {
    searchInput: '',
    submittedSearch: '',
    items: [],
    isLoading: false,
    errorMessage: null,
    shouldCrash: false,
  }

  componentDidMount(): void {
    const savedTerm = localStorage.getItem(STORAGE_KEY) ?? ''

    this.setState(
      {
        searchInput: savedTerm,
        submittedSearch: savedTerm,
      },
      () => {
        this.loadItems(savedTerm)
      },
    )
  }

  handleInputChange = (value: string): void => {
    this.setState({ searchInput: value })
  }

  handleSearch = (): void => {
    const trimmedSearch = this.state.searchInput.trim()

    if (trimmedSearch === this.state.submittedSearch) {
      return
    }

    localStorage.setItem(STORAGE_KEY, trimmedSearch)

    this.setState(
      {
        searchInput: trimmedSearch,
        submittedSearch: trimmedSearch,
      },
      () => {
        this.loadItems(trimmedSearch)
      },
    )
  }

  handleCrashTest = (): void => {
    this.setState({ shouldCrash: true })
  }

  loadItems = async (term: string): Promise<void> => {
    this.setState({ isLoading: true, errorMessage: null })

    try {
      const items = await fetchCharacters(term)
      this.setState({ items })
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Something unexpected happened while loading results.'

      this.setState({ items: [], errorMessage: message })
    } finally {
      this.setState({ isLoading: false })
    }
  }

  render() {
    const { searchInput, isLoading, items, errorMessage, shouldCrash } = this.state

    return (
      <ErrorBoundary onReset={this.handleResetError}>
        <main className="app-shell">
          <SearchPanel
            value={searchInput}
            isLoading={isLoading}
            onInputChange={this.handleInputChange}
            onSearch={this.handleSearch}
          />

          <ResultsSection items={items} isLoading={isLoading} errorMessage={errorMessage} />

          <div className="crash-zone">
            <button type="button" className="danger-button" onClick={this.handleCrashTest}>
              Trigger Error
            </button>
          </div>

          <CrashSimulator shouldCrash={shouldCrash} />
        </main>
      </ErrorBoundary>
    )
  }
}

export default App
