import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Modal } from './Modal'

describe('Modal', () => {
  it('does not render when isOpen is false', () => {
    render(<Modal isOpen={false} onClose={() => {}} title="Test"><p>content</p></Modal>)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('renders via portal when isOpen is true', () => {
    render(<Modal isOpen={true} onClose={() => {}} title="Test Modal"><p>Modal content</p></Modal>)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Test Modal')).toBeInTheDocument()
    expect(screen.getByText('Modal content')).toBeInTheDocument()
  })

  it('calls onClose when ESC key is pressed', () => {
    const onClose = vi.fn()
    render(<Modal isOpen={true} onClose={onClose} title="Test"><p>content</p></Modal>)
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('calls onClose when clicking the backdrop', async () => {
    const onClose = vi.fn()
    const user = userEvent.setup()
    render(<Modal isOpen={true} onClose={onClose} title="Test"><p>content</p></Modal>)
    const backdrop = screen.getByRole('presentation')
    await user.click(backdrop)
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('does not call onClose when clicking inside the dialog', async () => {
    const onClose = vi.fn()
    const user = userEvent.setup()
    render(<Modal isOpen={true} onClose={onClose} title="Test"><p>content</p></Modal>)
    await user.click(screen.getByRole('dialog'))
    expect(onClose).not.toHaveBeenCalled()
  })

  it('calls onClose when close button is clicked', async () => {
    const onClose = vi.fn()
    const user = userEvent.setup()
    render(<Modal isOpen={true} onClose={onClose} title="Test"><p>content</p></Modal>)
    await user.click(screen.getByRole('button', { name: /close modal/i }))
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('has aria-modal and aria-labelledby attributes', () => {
    render(<Modal isOpen={true} onClose={() => {}} title="Accessible Modal"><p>content</p></Modal>)
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title')
    expect(screen.getByText('Accessible Modal')).toHaveAttribute('id', 'modal-title')
  })

  it('traps focus with Tab key', async () => {
    const user = userEvent.setup()
    render(
      <Modal isOpen={true} onClose={() => {}} title="Test">
        <button>First</button>
        <button>Second</button>
      </Modal>
    )
    const buttons = screen.getAllByRole('button')
    const closeBtn = screen.getByRole('button', { name: /close modal/i })
    closeBtn.focus()
    const lastBtn = buttons[buttons.length - 1]
    lastBtn.focus()
    await user.tab()
    expect(document.activeElement).toBe(closeBtn)
  })

  it('returns focus to trigger element on close', () => {
    const trigger = document.createElement('button')
    document.body.appendChild(trigger)
    trigger.focus()

    const { rerender } = render(
      <Modal isOpen={true} onClose={() => {}} title="Test"><p>content</p></Modal>
    )
    rerender(<Modal isOpen={false} onClose={() => {}} title="Test"><p>content</p></Modal>)
    expect(document.activeElement).toBe(trigger)
    document.body.removeChild(trigger)
  })
})
