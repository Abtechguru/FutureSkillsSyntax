/**
 * API connectivity contract.
 *
 * Builds may publish an informational website without a backend, but cannot
 * silently send visitors' credentials to localhost or an unapproved host.
 */
const configured = String(import.meta.env.VITE_API_URL ?? '').trim().replace(/\/$/, '')

function validateApiUrl(value: string): boolean {
  if (!value) return false
  try {
    const parsed = new URL(value)
    const localDevelopment = import.meta.env.DEV
      && parsed.protocol === 'http:'
      && ['localhost', '127.0.0.1'].includes(parsed.hostname)
    return (parsed.protocol === 'https:' || localDevelopment)
      && !parsed.username
      && !parsed.password
      && parsed.pathname === '/'
      && !parsed.search
      && !parsed.hash
  } catch {
    return false
  }
}

export const hasConfiguredApi = validateApiUrl(configured)
export const apiBaseUrl = hasConfiguredApi ? configured : ''
export const apiUnavailableMessage =
  'Account services are temporarily unavailable. Registration and sign-in will reopen after the secure backend is connected.'
