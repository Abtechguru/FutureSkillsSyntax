import React from 'react'

interface CodePlaygroundProps {
  sessionId: number
  role: 'mentor' | 'mentee'
  userId: number
  initialCode?: string
  initialLanguage?: string
  onCodeChange?: (code: string) => void
  syncEnabled?: boolean
}

/**
 * The previous playground executed untrusted code and connected minors to
 * unsupervised real-time collaboration. It is deliberately offline until a
 * sandboxed, supervised learning environment has passed safeguarding review.
 */
const CodePlayground: React.FC<CodePlaygroundProps> = ({
  initialCode = '',
  initialLanguage = 'javascript',
}) => (
  <section aria-label="Coding activity" className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
    <h2 className="text-xl font-semibold text-gray-950 dark:text-white">Guided coding activity</h2>
    <p role="status" className="mt-3 rounded-lg bg-amber-50 p-4 text-sm leading-6 text-amber-900">
      Live collaboration and code execution are not available until mentor screening, guardian consent,
      supervised communication and an isolated execution sandbox have been verified.
    </p>
    <label htmlFor="guided-code-preview" className="mt-6 block text-sm font-medium text-gray-700 dark:text-gray-200">
      Reference code · {initialLanguage}
    </label>
    <textarea
      id="guided-code-preview"
      className="mt-2 min-h-56 w-full resize-y rounded-xl border border-gray-300 bg-gray-50 p-4 font-mono text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
      value={initialCode}
      readOnly
      aria-readonly="true"
    />
    <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
      This is a read-only reference. It does not transmit code or participant information to another user.
    </p>
  </section>
)

export default CodePlayground
