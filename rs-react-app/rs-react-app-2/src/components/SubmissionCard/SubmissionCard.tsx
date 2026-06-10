import { useEffect } from 'react'
import { useAppDispatch, clearNewFlag } from '../../store'
import type { FormSubmission } from '../../store'
import styles from './SubmissionCard.module.css'

interface SubmissionCardProps {
  submission: FormSubmission
}

export function SubmissionCard({ submission }: SubmissionCardProps) {
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (!submission.isNew) return
    const timer = setTimeout(() => {
      dispatch(clearNewFlag(submission.id))
    }, 3000)
    return () => clearTimeout(timer)
  }, [submission.id, submission.isNew, dispatch])

  return (
    <div className={`${styles.card} ${submission.isNew ? styles.isNew : ''}`}>
      {submission.imageBase64 && (
        <img
          src={submission.imageBase64}
          alt={`${submission.name}'s profile`}
          className={styles.avatar}
        />
      )}
      <div className={styles.info}>
        <h3 className={styles.name}>{submission.name}</h3>
        <dl className={styles.details}>
          <dt>Age</dt>
          <dd>{submission.age}</dd>
          <dt>Email</dt>
          <dd>{submission.email}</dd>
          <dt>Gender</dt>
          <dd>{submission.gender}</dd>
          <dt>Country</dt>
          <dd>{submission.country}</dd>
          <dt>Password</dt>
          <dd>{'•'.repeat(8)}</dd>
        </dl>
      </div>
    </div>
  )
}
