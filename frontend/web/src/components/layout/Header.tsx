import React from 'react'
import { Link } from 'react-router-dom'
import { Menu, LogOut, User, Zap } from 'lucide-react'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store/store'

interface HeaderProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  onProfileClick: () => void
  onSettingsClick: () => void
  onLogout: () => void
}

const Header: React.FC<HeaderProps> = ({
  sidebarOpen,
  setSidebarOpen,
  onProfileClick,
  onLogout,
}) => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth)

  return (
    <header className="fixed top-0 z-40 w-full border-b border-gray-200 bg-white/95 backdrop-blur-md dark:border-gray-700 dark:bg-gray-950/95">
      <div className="container-custom flex h-16 items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-4">
          <button type="button" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Toggle navigation" aria-expanded={sidebarOpen} className="rounded-lg p-2 text-gray-800 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:text-white dark:hover:bg-gray-800">
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>
          <Link to="/" className="flex min-w-0 items-center gap-3" aria-label="Future Syntax home">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-700 text-white">
              <Zap className="h-6 w-6" aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-lg font-bold text-gray-950 dark:text-white">Future Syntax</span>
              <span className="block text-xs text-gray-600 dark:text-gray-300">Mentorship and digital skills</span>
            </span>
          </Link>
        </div>

        <nav aria-label="Main navigation" className="hidden items-center gap-6 text-sm font-medium text-gray-700 dark:text-gray-200 lg:flex">
          <Link to="/" className="hover:text-indigo-700 dark:hover:text-indigo-300">Home</Link>
          <a href="/#programme" className="hover:text-indigo-700 dark:hover:text-indigo-300">Programme</a>
          <a href="/#approach" className="hover:text-indigo-700 dark:hover:text-indigo-300">Our approach</a>
          {isAuthenticated && <Link to="/dashboard" className="hover:text-indigo-700 dark:hover:text-indigo-300">Dashboard</Link>}
        </nav>

        {!isAuthenticated ? (
          <div className="flex shrink-0 items-center gap-3 text-sm">
            <Link to="/login" className="font-semibold text-gray-700 hover:text-indigo-700 dark:text-white">Sign in</Link>
            <Link to="/register" className="rounded-lg bg-indigo-700 px-3 py-2 font-semibold text-white hover:bg-indigo-800">Join</Link>
          </div>
        ) : (
          <div className="group relative">
            <button type="button" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:text-white dark:hover:bg-gray-800">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-700 font-bold text-white">
                {(user?.username || '?').charAt(0).toUpperCase()}
              </span>
              <span className="hidden max-w-32 truncate sm:inline">{user?.username || 'Account'}</span>
            </button>
            <div className="invisible absolute right-0 top-full mt-1 w-44 rounded-xl border border-gray-200 bg-white p-1 opacity-0 shadow-lg transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100 dark:border-gray-700 dark:bg-gray-800">
              <button type="button" onClick={onProfileClick} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-800 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
                <User className="h-4 w-4" aria-hidden="true" /> Profile
              </button>
              <button type="button" onClick={onLogout} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-700 hover:bg-gray-100 dark:text-red-300 dark:hover:bg-gray-700">
                <LogOut className="h-4 w-4" aria-hidden="true" /> Sign out
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
