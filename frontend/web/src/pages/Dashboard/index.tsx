import React, { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { CalendarDays, ClipboardList, ShieldCheck, UserRound } from 'lucide-react'
import type { RootState } from '@/store/store'
import api from '@/services/api'

interface SessionRecord {
  id: number
  title: string
  status: string
  session_date: string
  duration_minutes: number
  week_focus?: string | null
}

const Dashboard: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user)
  const [sessions, setSessions] = useState<SessionRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadCount, setReloadCount] = useState(0)

  const reload = useCallback(() => setReloadCount((count) => count + 1), [])

  useEffect(() => {
    let active = true
    setLoading(true)
    setError(null)
    api.mentorship.getSessions()
      .then(({ data }) => {
        if (!active) return
        if (!Array.isArray(data)) throw new Error('Unexpected sessions response')
        setSessions(data)
      })
      .catch(() => {
        if (active) setError('We could not load your mentorship sessions. Try again later.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => { active = false }
  }, [reloadCount])

  const upcoming = sessions
    .filter((session) => session.status === 'scheduled' && new Date(session.session_date).getTime() >= Date.now())
    .sort((a, b) => new Date(a.session_date).getTime() - new Date(b.session_date).getTime())
  const completedCount = sessions.filter((session) => session.status === 'completed').length

  return (
    <div className="space-y-9 pb-12">
      <header className="rounded-2xl bg-slate-950 p-8 text-white">
        <p className="text-sm font-semibold uppercase tracking-widest text-indigo-300">Future Syntax · My space</p>
        <h1 className="mt-3 text-3xl font-bold">Welcome, {user?.firstName || user?.username || 'learner'}.</h1>
        <p className="mt-3 max-w-2xl leading-7 text-slate-200">
          Your dashboard shows only information associated with your account. Programme enrolment and mentor access require staff approval.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <section className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
          <CalendarDays className="h-6 w-6 text-indigo-700 dark:text-indigo-300" aria-hidden="true" />
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-300">Upcoming sessions</p>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{loading || error ? '—' : upcoming.length}</p>
        </section>
        <section className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
          <ClipboardList className="h-6 w-6 text-indigo-700 dark:text-indigo-300" aria-hidden="true" />
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-300">Completed sessions</p>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{loading || error ? '—' : completedCount}</p>
        </section>
        <section className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
          <UserRound className="h-6 w-6 text-indigo-700 dark:text-indigo-300" aria-hidden="true" />
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-300">Account role</p>
          <p className="mt-2 break-words text-lg font-bold capitalize text-gray-900 dark:text-white">{user?.role?.replace(/_/g, ' ') || '—'}</p>
        </section>
      </div>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-bold text-gray-950 dark:text-white">My mentorship sessions</h2>
          <button type="button" onClick={reload} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50 dark:border-gray-600 dark:text-white dark:hover:bg-gray-800">Refresh</button>
        </div>
        {loading ? (
          <p className="mt-6 text-sm text-gray-600 dark:text-gray-300" role="status">Loading your sessions…</p>
        ) : error ? (
          <p className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-800" role="alert">{error}</p>
        ) : upcoming.length === 0 ? (
          <div className="mt-6 rounded-xl bg-gray-50 p-6 dark:bg-gray-800">
            <p className="font-medium text-gray-900 dark:text-white">No upcoming sessions</p>
            <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
              Sessions will appear here after authorised programme staff complete enrolment and scheduling.
            </p>
          </div>
        ) : (
          <ul className="mt-6 divide-y divide-gray-200 dark:divide-gray-700">
            {upcoming.map((session) => (
              <li key={session.id} className="py-5">
                <p className="font-semibold text-gray-950 dark:text-white">{session.title}</p>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  {new Date(session.session_date).toLocaleString()} · {session.duration_minutes} minutes
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="flex flex-wrap items-center justify-between gap-5 rounded-2xl bg-indigo-50 p-6 dark:bg-indigo-900/20">
        <div className="flex items-start gap-4">
          <ShieldCheck className="mt-1 h-7 w-7 text-indigo-700 dark:text-indigo-300" aria-hidden="true" />
          <div>
            <h2 className="font-semibold text-gray-950 dark:text-white">Guardian consent and safeguarding</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-gray-600 dark:text-gray-300">
              Child enrolment and mentor interactions are subject to documented consent, supervision and approval.
            </p>
          </div>
        </div>
        <Link to="/profile" className="rounded-lg bg-indigo-700 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-800">Review my profile</Link>
      </section>
    </div>
  )
}

export default Dashboard
