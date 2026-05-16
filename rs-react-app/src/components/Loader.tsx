export function Loader() {
  return (
    <div className="loader-wrap" role="status" aria-live="polite">
      <div className="loader" aria-hidden="true" />
      <span>Loading items...</span>
    </div>
  )
}
