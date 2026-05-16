import { Component } from 'react'

export class Loader extends Component {
  render() {
    return (
      <div className="loader-wrap" role="status" aria-live="polite">
        <div className="loader" aria-hidden="true" />
        <span>Loading items...</span>
      </div>
    )
  }
}
