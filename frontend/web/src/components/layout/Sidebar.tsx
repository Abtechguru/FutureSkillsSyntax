import React from 'react'
import { NavLink } from 'react-router-dom'
import { ArrowUpRight, Home, LayoutDashboard, LogOut, ShieldCheck, Sparkles, User, X } from 'lucide-react'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store/store'

interface SidebarProps {
  onClose: () => void
  onProfileClick: () => void
  onSettingsClick: () => void
  onLogout: () => void
}

const Sidebar: React.FC<SidebarProps> = ({ onClose, onLogout }) => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth)
  const accountLinks = [
    ...(isAuthenticated ? [
      { to: '/dashboard', label: 'My dashboard', icon: LayoutDashboard },
      { to: '/profile', label: 'My profile', icon: User },
    ] : []),
    ...(user?.role === 'admin' ? [
      { to: '/admin', label: 'Administration', icon: ShieldCheck },
    ] : []),
  ]

  return (
    <div className="flex min-h-full flex-col p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="inline-flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#4e56ca] text-white">
            <Sparkles className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="text-lg font-extrabold tracking-tight text-[#142536] dark:text-white">Future Syntax.</span>
        </div>
        <button type="button" aria-label="Close navigation" onClick={onClose} className="rounded-xl p-2 text-[#344653] hover:bg-[#eceeff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#4e56ca] dark:text-white dark:hover:bg-slate-800">
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <nav aria-label="Mobile navigation" className="mt-12 space-y-1.5">
        <NavLink to="/" onClick={onClose} end className={({ isActive }) => 'flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-bold ' + (isActive ? 'bg-[#eceeff] text-[#4e56ca] dark:bg-indigo-950 dark:text-indigo-200' : 'text-[#344653] hover:bg-gray-100 dark:text-slate-200 dark:hover:bg-slate-800')}>
          <Home className="h-5 w-5" aria-hidden="true" /> Home
        </NavLink>
        {[
          { href: '/#programme', name: 'Our programme' },
          { href: '/#story', name: 'Our story' },
          { href: '/#approach', name: 'Our approach' },
          { href: '/#safeguarding', name: 'Safeguarding' },
        ].map((item) => (
          <a key={item.href} href={item.href} onClick={onClose} className="flex items-center justify-between rounded-xl px-4 py-3.5 text-sm font-semibold text-[#435360] transition hover:bg-[#eceeff] hover:text-[#4e56ca] dark:text-slate-200 dark:hover:bg-slate-800">
            {item.name} <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>
        ))}
        {accountLinks.length > 0 && (
          <>
            <p className="px-4 pb-2 pt-7 text-[11px] font-bold uppercase tracking-[0.2em] text-[#87929c]">Your account</p>
            {accountLinks.map((item) => (
              <NavLink key={item.to} to={item.to} onClick={onClose} className={({ isActive }) => 'flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-semibold ' + (isActive ? 'bg-[#eceeff] text-[#4e56ca] dark:bg-indigo-950 dark:text-indigo-200' : 'text-[#344653] hover:bg-gray-100 dark:text-slate-200 dark:hover:bg-slate-800')}>
                <item.icon className="h-5 w-5" aria-hidden="true" /> {item.label}
              </NavLink>
            ))}
          </>
        )}
      </nav>

      <div className="mt-auto border-t border-[#e6e9e7] pt-6 dark:border-slate-700">
        {isAuthenticated ? (
          <button type="button" onClick={() => { onLogout(); onClose() }} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-red-700 hover:bg-red-50 dark:text-red-300 dark:hover:bg-slate-800">
            <LogOut className="h-5 w-5" aria-hidden="true" /> Sign out
          </button>
        ) : (
          <NavLink to="/register" onClick={onClose} className="block rounded-xl bg-[#4e56ca] px-4 py-3.5 text-center text-sm font-bold text-white transition hover:bg-[#3e46b7]">Adult registration</NavLink>
        )}
        <p className="mt-4 text-xs leading-6 text-[#7a8791] dark:text-slate-400">
          A community for boys aged 10–15, with guardian-led participation.
        </p>
      </div>
    </div>
  )
}

export default Sidebar
