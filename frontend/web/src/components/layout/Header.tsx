import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, LogOut, Menu, Sparkles, User } from 'lucide-react'
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
    <header className="fixed top-0 z-40 w-full border-b border-[#e9eae7] bg-[#faf9f6]/95 backdrop-blur-xl dark:border-slate-800 dark:bg-[#0d1520]/95">
      <div className="container-custom flex h-16 min-w-0 items-center justify-between gap-3 lg:h-[76px]">
        <Link to="/" className="flex min-w-0 shrink items-center gap-2.5" aria-label="Future Syntax home">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[0.9rem] bg-[#4e56ca] text-white shadow-sm">
            <Sparkles className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-base font-extrabold tracking-[-0.045em] text-[#142536] sm:text-lg dark:text-white">Future Syntax<span className="text-[#f5ae4e]">.</span></span>
            <span className="hidden text-[10px] font-semibold uppercase tracking-[0.12em] text-[#7a858c] sm:block dark:text-slate-400">Mentorship • Digital skills</span>
          </span>
        </Link>

        <nav aria-label="Primary navigation" className="hidden items-center gap-6 text-sm font-semibold text-[#435360] dark:text-slate-200 lg:flex xl:gap-9">
          <Link to="/" className="transition-colors hover:text-[#4e56ca] dark:hover:text-indigo-300">Home</Link>
          <a href="/#programme" className="transition-colors hover:text-[#4e56ca] dark:hover:text-indigo-300">Programme</a>
          <a href="/#story" className="transition-colors hover:text-[#4e56ca] dark:hover:text-indigo-300">Our story</a>
          <a href="/#approach" className="transition-colors hover:text-[#4e56ca] dark:hover:text-indigo-300">Our approach</a>
          {isAuthenticated && <Link to="/dashboard" className="transition-colors hover:text-[#4e56ca] dark:hover:text-indigo-300">Dashboard</Link>}
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="hidden rounded-xl px-3 py-2 text-sm font-bold text-[#435360] transition hover:text-[#4e56ca] dark:text-slate-200 sm:inline-flex">Sign in</Link>
              <a href="/#join" className="hidden h-10 items-center gap-1.5 rounded-xl bg-[#4e56ca] px-3 text-xs font-bold text-white transition hover:bg-[#3e46b7] min-[380px]:inline-flex sm:h-11 sm:gap-2 sm:px-4 sm:text-sm">
                Get involved <ArrowUpRight aria-hidden="true" className="hidden h-4 w-4 sm:block" />
              </a>
            </>
          ) : (
            <div className="group relative">
              <button type="button" aria-label="Account menu" className="flex items-center gap-2 rounded-xl px-2 py-1 text-sm text-[#344554] hover:bg-[#eeeff4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4e56ca] dark:text-white dark:hover:bg-slate-800">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#4e56ca] font-bold text-white">
                  {(user?.username || '?').charAt(0).toUpperCase()}
                </span>
                <span className="hidden max-w-24 truncate sm:inline">{user?.username || 'Account'}</span>
              </button>
              <div className="invisible absolute right-0 top-full mt-2 w-44 rounded-2xl border border-[#e7e9ec] bg-white p-2 opacity-0 shadow-xl transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100 dark:border-slate-700 dark:bg-[#1a2635]">
                <button type="button" onClick={onProfileClick} className="flex w-full items-center gap-2 rounded-xl px-3 py-3 text-sm text-[#263646] hover:bg-slate-50 dark:text-white dark:hover:bg-slate-800">
                  <User className="h-4 w-4" aria-hidden="true" /> Profile
                </button>
                <button type="button" onClick={onLogout} className="flex w-full items-center gap-2 rounded-xl px-3 py-3 text-sm text-red-700 hover:bg-red-50 dark:text-red-300 dark:hover:bg-slate-800">
                  <LogOut className="h-4 w-4" aria-hidden="true" /> Sign out
                </button>
              </div>
            </div>
          )}
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label={sidebarOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={sidebarOpen}
            aria-controls="mobile-navigation"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#e3e5e4] bg-white text-[#273948] transition hover:bg-[#eff0fb] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4e56ca] dark:border-slate-700 dark:bg-slate-900 dark:text-white lg:hidden"
          >
            <Menu aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
