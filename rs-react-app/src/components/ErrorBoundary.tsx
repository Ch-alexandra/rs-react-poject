import { Component, type ErrorInfo, type ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
  onReset?: () => void
}

interface ErrorBoundaryState {
  hasError: boolean
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Application error caught by boundary:', error, errorInfo)
  }

  handleReset = (): void => {
    this.setState({ hasError: false })
    if (this.props.onReset) {
      this.props.onReset()
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="app-shell">
          <section className="fallback-panel" aria-live="assertive">
            <h2>Something went wrong.</h2>
            <p>The app hit an unexpected error. Please reset and try again.</p>
            <button type="button" className="search-button" onClick={this.handleReset}>
              Reset App
            </button>
          </section>
        </main>
      )
    }

    return this.props.children
  }
}
