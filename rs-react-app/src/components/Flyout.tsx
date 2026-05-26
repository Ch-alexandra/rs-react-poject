import './Flyout.css'
import { useSelectionStore } from '../store/selectedSlice'
import { downloadCsv } from '../utils/csv'

export function Flyout() {
  const selectedItems = useSelectionStore((s) => s.selectedItems)
  const unselectAll = useSelectionStore((s) => s.unselectAll)

  if (selectedItems.length === 0) return null

  const handleDownload = () => {
    downloadCsv(selectedItems)
  }

  return (
    <div className="flyout" role="status" aria-live="polite">
      <span className="flyout__count">
        {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
      </span>
      <div className="flyout__actions">
        <button type="button" className="flyout__btn flyout__btn--unselect" onClick={unselectAll}>
          Unselect all
        </button>
        <button type="button" className="flyout__btn flyout__btn--download" onClick={handleDownload}>
          Download
        </button>
      </div>
    </div>
  )
}
