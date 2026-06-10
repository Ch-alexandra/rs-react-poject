import { useState } from 'react'
import { Modal } from './components/Modal/Modal'
import { UncontrolledForm } from './components/UncontrolledForm/UncontrolledForm'
import { RHFForm } from './components/RHFForm/RHFForm'
import './App.css'

type ModalType = 'uncontrolled' | 'rhf' | null

function App() {
  const [openModal, setOpenModal] = useState<ModalType>(null)

  return (
    <>
      <section id="center">
        <h1>React Forms</h1>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button type="button" onClick={() => setOpenModal('uncontrolled')}>
            Uncontrolled Form
          </button>
          <button type="button" onClick={() => setOpenModal('rhf')}>
            RHF Form
          </button>
        </div>
      </section>

      <Modal
        isOpen={openModal === 'uncontrolled'}
        onClose={() => setOpenModal(null)}
        title="Uncontrolled Form"
      >
        <UncontrolledForm onSuccess={() => setOpenModal(null)} />
      </Modal>

      <Modal
        isOpen={openModal === 'rhf'}
        onClose={() => setOpenModal(null)}
        title="React Hook Form"
      >
        <RHFForm onSuccess={() => setOpenModal(null)} />
      </Modal>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App
