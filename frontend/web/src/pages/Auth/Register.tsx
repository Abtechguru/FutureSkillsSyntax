import React, { useState } from 'react'
import { hasConfiguredApi, apiUnavailableMessage } from '@/config/runtime'
import { Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import type { RegisterData } from '@/store/slices/authSlice'

/**
 * Public signup is only for adult applicants and parents/guardians.
 * Minors and mentors must be onboarded by authorised programme staff.
 */
const Register: React.FC = () => {
  const { register, isLoading, error } = useAuth()
  const [values, setValues] = useState<RegisterData>({
    email: '',
    isAdult: false,
    username: '',
    password: '',
    fullName: '',
    role: 'parent_guardian',
  })
  const [confirmation, setConfirmation] = useState('')
  const [localError, setLocalError] = useState('')

  const setField = <K extends keyof RegisterData>(field: K, value: RegisterData[K]) => {
    setValues((current) => ({ ...current, [field]: value }))
  }

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!hasConfiguredApi) return
    setLocalError('')
    if (values.password !== confirmation) {
      setLocalError('Passwords do not match.')
      return
    }
    if (values.password.length < 8) {
      setLocalError('Use a password with at least 8 characters.')
      return
    }
    try {
      await register(values)
    } catch {
      // Errors are displayed by the authentication state.
    }
  }

  const fieldStyle = 'mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:border-gray-600 dark:bg-gray-800 dark:text-white'

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12 dark:bg-gray-950">
      <div className="mx-auto max-w-lg rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-900 sm:p-9">
        <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">Future Syntax · MCN 2026</p>
        <h1 className="mt-3 text-3xl font-bold text-gray-950 dark:text-white">Apply to join the community</h1>
        <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300">
          Future Syntax offers supervised digital-skills learning and mentorship for boys aged 10–15.
          This form creates an adult account. A child is enrolled only through a separate guardian-consent and programme approval process.
        </p>

        <form onSubmit={submit} className="mt-8 space-y-5">
          <fieldset>
            <legend className="mb-2 font-medium text-gray-900 dark:text-white">I am registering as</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 p-3 dark:border-gray-700">
                <input type="radio" name="role" checked={values.role === 'parent_guardian'} onChange={() => setField('role', 'parent_guardian')} />
                <span className="text-sm text-gray-800 dark:text-gray-100">Parent / guardian</span>
              </label>
              <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 p-3 dark:border-gray-700">
                <input type="radio" name="role" checked={values.role === 'career_seeker'} onChange={() => setField('role', 'career_seeker')} />
                <span className="text-sm text-gray-800 dark:text-gray-100">Adult learner</span>
              </label>
            </div>
          </fieldset>

          <label className="block text-sm font-medium text-gray-800 dark:text-gray-100">
            Full name
            <input required autoComplete="name" maxLength={100} className={fieldStyle} value={values.fullName} onChange={(e) => setField('fullName', e.target.value)} />
          </label>
          <label className="block text-sm font-medium text-gray-800 dark:text-gray-100">
            Username
            <input required autoComplete="username" minLength={3} maxLength={50} pattern="[A-Za-z0-9_.-]+" title="Use letters, digits, underscores, periods or hyphens" className={fieldStyle} value={values.username} onChange={(e) => setField('username', e.target.value)} />
          </label>
          <label className="block text-sm font-medium text-gray-800 dark:text-gray-100">
            Email address
            <input required type="email" autoComplete="email" className={fieldStyle} value={values.email} onChange={(e) => setField('email', e.target.value)} />
          </label>
          <label className="block text-sm font-medium text-gray-800 dark:text-gray-100">
            Password
            <input required type="password" autoComplete="new-password" minLength={8} className={fieldStyle} value={values.password} onChange={(e) => setField('password', e.target.value)} />
          </label>
          <label className="block text-sm font-medium text-gray-800 dark:text-gray-100">
            Confirm password
            <input required type="password" autoComplete="new-password" minLength={8} className={fieldStyle} value={confirmation} onChange={(e) => setConfirmation(e.target.value)} />
          </label>
          <label className="flex items-start gap-3 text-sm leading-6 text-gray-700 dark:text-gray-300">
            <input type="checkbox" required checked={values.isAdult} onChange={(e) => setField('isAdult', e.target.checked)} className="mt-1 h-4 w-4" />
            <span>I confirm that I am at least 18 years old. I understand that creating an adult account does not enrol a child or provide guardian consent for programme participation.</span>
          </label>
          {!hasConfiguredApi && <p role="status" className="rounded-lg bg-amber-50 p-4 text-sm text-amber-900">{apiUnavailableMessage}</p>}
          {(localError || error) && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{localError || error}</p>}
          <button type="submit" disabled={isLoading || !hasConfiguredApi} className="w-full rounded-lg bg-indigo-700 px-4 py-3 font-semibold text-white hover:bg-indigo-800 disabled:opacity-60">
            {isLoading ? 'Creating account…' : 'Create adult account'}
          </button>
        </form>

        <p className="mt-5 text-sm text-gray-600 dark:text-gray-300">
          Want to mentor? Mentor access requires identity verification, safeguarding checks and administrator approval. Contact the programme team to apply.
        </p>
        <p className="mt-5 text-center text-sm text-gray-600 dark:text-gray-300">
          Already registered? <Link to="/login" className="font-semibold text-indigo-600 hover:underline">Sign in</Link>
        </p>
      </div>
    </main>
  )
}

export default Register
