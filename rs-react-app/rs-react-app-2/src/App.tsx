import { useState } from 'react'
import { Modal } from './components/Modal/Modal'
import { UncontrolledForm } from './components/UncontrolledForm/UncontrolledForm'
import { RHFForm } from './components/RHFForm/RHFForm'
import { SubmissionCard } from './components/SubmissionCard/SubmissionCard'
import { useAppSelector } from './store'
import styles from './App.module.css'

type ModalType = 'uncontrolled' | 'rhf' | null

function App() {
  const [openModal, setOpenModal] = useState<ModalType>(null)
  const submissions = useAppSelector((s) => s.submissions.items)

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.actions}>
          <button type="button" className={styles.btn} onClick={() => setOpenModal('uncontrolled')}>
            Uncontrolled Form
          </button>
          <button type="button" className={styles.btn} onClick={() => setOpenModal('rhf')}>
            RHF Form
          </button>
        </div>
      </header>

      {submissions.length === 0 ? (
        <p className={styles.empty}>No submissions yet. Fill out a form above!</p>
      ) : (
        <ul className={styles.list}>
          {submissions.map((s) => (
            <li key={s.id}>
              <SubmissionCard submission={s} />
            </li>
          ))}
        </ul>
      )}

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
    </div>
  )
}

export default App
