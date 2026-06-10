import { useState } from 'react'
import { Modal } from './components/Modal/Modal'
import './App.css'

function App() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <section id="center">
        <h1>React Forms</h1>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button type="button" onClick={() => setModalOpen(true)}>
            Uncontrolled Form
          </button>
          <button type="button" onClick={() => setModalOpen(true)}>
            RHF Form
          </button>
        </div>
      </section>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Modal">
        <p>Pressing <kbd>ESC</kbd> or clicking outside to close.</p>
      </Modal>
      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App
