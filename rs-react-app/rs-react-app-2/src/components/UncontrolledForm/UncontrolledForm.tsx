import { useRef, useState, type FormEvent } from 'react'
import { formSchema } from '../../validation/schema'
import { validateCountry } from '../../validation/schema'
import { imageToBase64 } from '../../utils/imageToBase64'
import { getPasswordStrength, getPasswordCriteria } from '../../utils/passwordStrength'
import { useAppDispatch, useAppSelector, addSubmission } from '../../store'
import styles from './UncontrolledForm.module.css'

interface UncontrolledFormProps {
  onSuccess: () => void
}

type FieldErrors = Partial<Record<string, string>>

export function UncontrolledForm({ onSuccess }: UncontrolledFormProps) {
  const dispatch = useAppDispatch()
  const countries = useAppSelector((s) => s.countries.list)

  const formRef = useRef<HTMLFormElement>(null)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [passwordValue, setPasswordValue] = useState('')

  const strength = getPasswordStrength(passwordValue)
  const criteria = getPasswordCriteria(passwordValue)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = formRef.current!
    const data = new FormData(form)

    const rawAge = data.get('age') as string
    const imageFile = (form.querySelector<HTMLInputElement>('#uc-image'))?.files?.[0]

    const parsed = formSchema.safeParse({
      name: data.get('name'),
      age: rawAge === '' ? NaN : Number(rawAge),
      email: data.get('email'),
      gender: data.get('gender'),
      password: data.get('password'),
      confirmPassword: data.get('confirmPassword'),
      country: data.get('country'),
      terms: (data.get('terms') === 'on') ? true : false,
      image: imageFile ?? undefined,
    })

    if (!parsed.success) {
      const fieldErrors: FieldErrors = {}
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as string
        if (!fieldErrors[key]) fieldErrors[key] = issue.message
      }
      setErrors(fieldErrors)
      return
    }

    const country = parsed.data.country
    if (!validateCountry(country, countries)) {
      setErrors({ country: 'Country must be from the list' })
      return
    }

    const imageBase64 = await imageToBase64(parsed.data.image)

    dispatch(
      addSubmission({
        name: parsed.data.name,
        age: parsed.data.age,
        email: parsed.data.email,
        gender: parsed.data.gender,
        password: parsed.data.password,
        country: parsed.data.country,
        imageBase64,
      })
    )

    form.reset()
    setErrors({})
    setPasswordValue('')
    onSuccess()
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className={styles.form}>
      <div className={styles.field}>
        <label htmlFor="uc-name">Name</label>
        <input id="uc-name" name="name" type="text" autoComplete="name" />
        {errors.name && <span className={styles.error}>{errors.name}</span>}
      </div>

      <div className={styles.field}>
        <label htmlFor="uc-age">Age</label>
        <input id="uc-age" name="age" type="number" min="0" />
        {errors.age && <span className={styles.error}>{errors.age}</span>}
      </div>

      <div className={styles.field}>
        <label htmlFor="uc-email">Email</label>
        <input id="uc-email" name="email" type="email" autoComplete="email" />
        {errors.email && <span className={styles.error}>{errors.email}</span>}
      </div>

      <div className={styles.field}>
        <label htmlFor="uc-gender">Gender</label>
        <select id="uc-gender" name="gender">
          <option value="">— select —</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        {errors.gender && <span className={styles.error}>{errors.gender}</span>}
      </div>

      <div className={styles.field}>
        <label htmlFor="uc-password">Password</label>
        <input
          id="uc-password"
          name="password"
          type="password"
          autoComplete="new-password"
          onChange={(e) => setPasswordValue(e.target.value)}
        />
        {passwordValue && (
          <div className={styles.strength} data-level={strength}>
            <span className={styles.strengthLabel}>Strength: <strong>{strength}</strong></span>
            <ul className={styles.criteriaList}>
              <li data-met={criteria.hasUppercase}>Uppercase letter</li>
              <li data-met={criteria.hasLowercase}>Lowercase letter</li>
              <li data-met={criteria.hasNumber}>Number</li>
              <li data-met={criteria.hasSpecial}>Special character</li>
            </ul>
          </div>
        )}
        {errors.password && <span className={styles.error}>{errors.password}</span>}
      </div>

      <div className={styles.field}>
        <label htmlFor="uc-confirm-password">Confirm Password</label>
        <input
          id="uc-confirm-password"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
        />
        {errors.confirmPassword && <span className={styles.error}>{errors.confirmPassword}</span>}
      </div>

      <div className={styles.field}>
        <label htmlFor="uc-country">Country</label>
        <input
          id="uc-country"
          name="country"
          type="text"
          list="uc-countries-list"
          autoComplete="off"
        />
        <datalist id="uc-countries-list">
          {countries.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
        {errors.country && <span className={styles.error}>{errors.country}</span>}
      </div>

      <div className={styles.field}>
        <label htmlFor="uc-image">Profile Image (PNG or JPEG, max 2 MB)</label>
        <input id="uc-image" name="image" type="file" accept="image/png,image/jpeg" />
        {errors.image && <span className={styles.error}>{errors.image}</span>}
      </div>

      <div className={`${styles.field} ${styles.checkboxField}`}>
        <input id="uc-terms" name="terms" type="checkbox" />
        <label htmlFor="uc-terms">I accept the Terms &amp; Conditions</label>
        {errors.terms && <span className={styles.error}>{errors.terms}</span>}
      </div>

      <button type="submit" className={styles.submitBtn}>Submit</button>
    </form>
  )
}
