import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { formSchema, validateCountry, type FormValues } from '../../validation/schema'
import { imageToBase64 } from '../../utils/imageToBase64'
import { getPasswordStrength, getPasswordCriteria } from '../../utils/passwordStrength'
import { useAppDispatch, useAppSelector, addSubmission } from '../../store'
import styles from './RHFForm.module.css'

interface RHFFormProps {
  onSuccess: () => void
}

export function RHFForm({ onSuccess }: RHFFormProps) {
  const dispatch = useAppDispatch()
  const countries = useAppSelector((s) => s.countries.list)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
  })

  const passwordValue = watch('password') ?? ''
  const strength = getPasswordStrength(passwordValue)
  const criteria = getPasswordCriteria(passwordValue)

  async function onSubmit(data: FormValues) {
    if (!validateCountry(data.country, countries)) return

    const imageBase64 = await imageToBase64(data.image)

    dispatch(
      addSubmission({
        name: data.name,
        age: data.age,
        email: data.email,
        gender: data.gender,
        password: data.password,
        country: data.country,
        imageBase64,
      })
    )

    onSuccess()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className={styles.form}>
      <div className={styles.field}>
        <label htmlFor="rhf-name">Name</label>
        <input id="rhf-name" type="text" autoComplete="name" {...register('name')} />
        {errors.name && <span className={styles.error}>{errors.name.message}</span>}
      </div>

      <div className={styles.field}>
        <label htmlFor="rhf-age">Age</label>
        <input
          id="rhf-age"
          type="number"
          min="0"
          {...register('age', { valueAsNumber: true })}
        />
        {errors.age && <span className={styles.error}>{errors.age.message}</span>}
      </div>

      <div className={styles.field}>
        <label htmlFor="rhf-email">Email</label>
        <input id="rhf-email" type="email" autoComplete="email" {...register('email')} />
        {errors.email && <span className={styles.error}>{errors.email.message}</span>}
      </div>

      <div className={styles.field}>
        <label htmlFor="rhf-gender">Gender</label>
        <select id="rhf-gender" {...register('gender')}>
          <option value="">— select —</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        {errors.gender && <span className={styles.error}>{errors.gender.message}</span>}
      </div>

      <div className={styles.field}>
        <label htmlFor="rhf-password">Password</label>
        <input
          id="rhf-password"
          type="password"
          autoComplete="new-password"
          {...register('password')}
        />
        {passwordValue && (
          <div className={styles.strength} data-level={strength}>
            <span className={styles.strengthLabel}>
              Strength: <strong>{strength}</strong>
            </span>
            <ul className={styles.criteriaList}>
              <li data-met={criteria.hasUppercase}>Uppercase letter</li>
              <li data-met={criteria.hasLowercase}>Lowercase letter</li>
              <li data-met={criteria.hasNumber}>Number</li>
              <li data-met={criteria.hasSpecial}>Special character</li>
            </ul>
          </div>
        )}
        {errors.password && <span className={styles.error}>{errors.password.message}</span>}
      </div>

      <div className={styles.field}>
        <label htmlFor="rhf-confirm-password">Confirm Password</label>
        <input
          id="rhf-confirm-password"
          type="password"
          autoComplete="new-password"
          {...register('confirmPassword')}
        />
        {errors.confirmPassword && (
          <span className={styles.error}>{errors.confirmPassword.message}</span>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="rhf-country">Country</label>
        <input
          id="rhf-country"
          type="text"
          list="rhf-countries-list"
          autoComplete="off"
          {...register('country')}
        />
        <datalist id="rhf-countries-list">
          {countries.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
        {errors.country && <span className={styles.error}>{errors.country.message}</span>}
      </div>

      <div className={styles.field}>
        <label htmlFor="rhf-image">Profile Image (PNG or JPEG, max 2 MB)</label>
        <input
          id="rhf-image"
          type="file"
          accept="image/png,image/jpeg"
          onChange={(e) =>
            setValue('image', (e.target.files?.[0] ?? undefined) as File, {
              shouldValidate: true,
            })
          }
        />
        {errors.image && <span className={styles.error}>{errors.image.message}</span>}
      </div>

      <div className={`${styles.field} ${styles.checkboxField}`}>
        <input id="rhf-terms" type="checkbox" {...register('terms')} />
        <label htmlFor="rhf-terms">I accept the Terms &amp; Conditions</label>
        {errors.terms && <span className={styles.error}>{errors.terms.message}</span>}
      </div>

      <button type="submit" className={styles.submitBtn} disabled={!isValid}>
        Submit
      </button>
    </form>
  )
}
