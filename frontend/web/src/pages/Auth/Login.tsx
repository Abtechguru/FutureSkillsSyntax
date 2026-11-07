import React, { useState } from 'react'
import { hasConfiguredApi, apiUnavailableMessage } from '@/config/runtime'
import { Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

const Login: React.FC = () => {
  const [searchParams] = useSearchParams()
  const [credentials, setCredentials] = useState({ username: '', password: '' })
  const { login, isLoading, error } = useAuth()

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!hasConfiguredApi) return
    try {
      await login(credentials)
    } catch {
      // Display API errors through the hook; avoid an unhandled rejection.
    }
  }

  const fieldStyle = 'mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-950 focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:border-gray-600 dark:bg-gray-800 dark:text-white'

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-16 dark:bg-gray-950">
      <div className="mx-auto w-full max-w-md rounded-2xl bg-white p-8 shadow-lg dark:bg-gray-900">
        <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">Future Syntax</p>
        <h1 className="mt-3 text-3xl font-bold text-gray-950 dark:text-white">Welcome back</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Sign in to your learning and mentorship account.</p>

        {searchParams.has('registered') && (
          <div role="status" className="mt-6 rounded-lg bg-indigo-50 p-3 text-sm text-indigo-900">
            Your account was created. Please follow the verification instructions sent to your email.
          </div>
        )}

        <form onSubmit={submit} className="mt-8 space-y-6">
          <label className="block text-sm font-medium text-gray-800 dark:text-gray-100">
            Username or email
            <input autoComplete="username" required className={fieldStyle} value={credentials.username} onChange={(e) => setCredentials((v) => ({ ...v, username: e.target.value }))} />
          </label>
          <label className="block text-sm font-medium text-gray-800 dark:text-gray-100">
            Password
            <input type="password" autoComplete="current-password" required className={fieldStyle} value={credentials.password} onChange={(e) => setCredentials((v) => ({ ...v, password: e.target.value }))} />
          </label>
          {!hasConfiguredApi && <p role="status" className="mt-5 rounded-lg bg-amber-50 p-4 text-sm text-amber-900">{apiUnavailableMessage}</p>}
          {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <button type="submit" disabled={isLoading || !hasConfiguredApi} className="w-full rounded-lg bg-indigo-700 px-4 py-3 font-semibold text-white hover:bg-indigo-800 disabled:opacity-60">
            {isLoading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <div className="mt-6 flex flex-wrap justify-between gap-3 text-sm">
          <Link to="/forgot-password" className="font-semibold text-indigo-600 hover:underline">Forgot your password?</Link>
          <Link to="/register" className="font-semibold text-indigo-600 hover:underline">Create an account</Link>
        </div>
        <p className="mt-6 text-xs leading-5 text-gray-500 dark:text-gray-400">
          Learners aged 10–15 join through guardian consent and supervised programme enrolment.
          Unverified mentor and child accounts are not available through public signup.
        </p>
      </div>
    </main>
  )
}

export default Login
