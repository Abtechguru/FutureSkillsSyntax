import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '@/services/api'
import { useAuth } from '@/hooks/useAuth'

interface ProfileRecord {
  id: number
  username: string
  email: string
  role: string
  is_verified: boolean
  full_name: string | null
  bio: string | null
  phone_number: string | null
  country: string | null
  city: string | null
}

interface ProfileFields {
  full_name: string
  bio: string
  phone_number: string
  country: string
  city: string
}

const blank: ProfileFields = { full_name: '', bio: '', phone_number: '', country: '', city: '' }
const style = 'mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-950 focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:border-gray-600 dark:bg-gray-800 dark:text-white'

const UserProfile: React.FC = () => {
  const { refreshProfile } = useAuth()
  const [profile, setProfile] = useState<ProfileRecord | null>(null)
  const [form, setForm] = useState<ProfileFields>(blank)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    let active = true
    api.user.getProfile()
      .then(({ data }) => {
        if (!active) return
        setProfile(data)
        setForm({
          full_name: data.full_name || '',
          bio: data.bio || '',
          phone_number: data.phone_number || '',
          country: data.country || '',
          city: data.city || '',
        })
      })
      .catch(() => { if (active) setError('Your profile could not be loaded.') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  const save = async (event: React.FormEvent) => {
    event.preventDefault()
    setSaving(true)
    setError(null)
    setSaved(false)
    try {
      const { data } = await api.put('/api/v1/user/profile', form)
      setProfile(data)
      setSaved(true)
      await refreshProfile()
    } catch {
      setError('Your changes could not be saved. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p role="status" className="py-10 text-gray-600 dark:text-gray-300">Loading your profile…</p>
  if (!profile) {
    return (
      <div className="rounded-xl bg-white p-8 dark:bg-gray-900">
        <p role="alert" className="text-red-700 dark:text-red-300">{error || 'Profile unavailable.'}</p>
        <Link to="/dashboard" className="mt-4 inline-block font-semibold text-indigo-700 dark:text-indigo-300">Return to dashboard</Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl space-y-7 pb-12">
      <header>
        <p className="text-sm font-semibold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">Your account</p>
        <h1 className="mt-2 text-3xl font-bold text-gray-950 dark:text-white">My profile</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">Only information saved to your account is shown here.</p>
      </header>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900 sm:p-8">
        <h2 className="text-xl font-semibold text-gray-950 dark:text-white">Account details</h2>
        <dl className="mt-4 grid gap-5 sm:grid-cols-2">
          <div><dt className="text-sm text-gray-500 dark:text-gray-300">Username</dt><dd className="mt-1 font-medium text-gray-900 dark:text-white">{profile.username}</dd></div>
          <div><dt className="text-sm text-gray-500 dark:text-gray-300">Email</dt><dd className="mt-1 break-words font-medium text-gray-900 dark:text-white">{profile.email}</dd></div>
          <div><dt className="text-sm text-gray-500 dark:text-gray-300">Role</dt><dd className="mt-1 font-medium capitalize text-gray-900 dark:text-white">{profile.role.replace(/_/g, ' ')}</dd></div>
          <div><dt className="text-sm text-gray-500 dark:text-gray-300">Email verification</dt><dd className="mt-1 font-medium text-gray-900 dark:text-white">{profile.is_verified ? 'Verified' : 'Pending'}</dd></div>
        </dl>
      </section>

      <form onSubmit={save} className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900 sm:p-8">
        <h2 className="text-xl font-semibold text-gray-950 dark:text-white">Edit profile</h2>
        <label className="block text-sm font-medium text-gray-800 dark:text-gray-100">
          Full name
          <input className={style} maxLength={100} autoComplete="name" value={form.full_name} onChange={(e) => setForm((v) => ({ ...v, full_name: e.target.value }))} />
        </label>
        <label className="block text-sm font-medium text-gray-800 dark:text-gray-100">
          Bio
          <textarea rows={4} maxLength={2000} className={style} value={form.bio} onChange={(e) => setForm((v) => ({ ...v, bio: e.target.value }))} />
        </label>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block text-sm font-medium text-gray-800 dark:text-gray-100">
            Phone number
            <input className={style} maxLength={20} autoComplete="tel" value={form.phone_number} onChange={(e) => setForm((v) => ({ ...v, phone_number: e.target.value }))} />
          </label>
          <label className="block text-sm font-medium text-gray-800 dark:text-gray-100">
            City
            <input className={style} maxLength={100} autoComplete="address-level2" value={form.city} onChange={(e) => setForm((v) => ({ ...v, city: e.target.value }))} />
          </label>
          <label className="block text-sm font-medium text-gray-800 dark:text-gray-100">
            Country
            <input className={style} maxLength={100} autoComplete="country-name" value={form.country} onChange={(e) => setForm((v) => ({ ...v, country: e.target.value }))} />
          </label>
        </div>
        {error && <p role="alert" className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</p>}
        {saved && <p role="status" className="rounded-lg bg-green-50 p-4 text-sm text-green-800">Your profile was updated.</p>}
        <button disabled={saving} type="submit" className="rounded-lg bg-indigo-700 px-6 py-3 font-semibold text-white hover:bg-indigo-800 disabled:opacity-50">
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </form>
    </div>
  )
}

export default UserProfile
