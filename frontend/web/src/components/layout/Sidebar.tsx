import React from 'react'
import { NavLink } from 'react-router-dom'
import { Home, LayoutDashboard, User, ShieldCheck, LogOut, X } from 'lucide-react'
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
  const links = [
    { to: '/', label: 'Programme home', icon: Home },
    ...(isAuthenticated ? [
      { to: '/dashboard', label: 'My dashboard', icon: LayoutDashboard },
      { to: '/profile', label: 'My profile', icon: User },
    ] : []),
    ...(user?.role === 'admin' ? [
      { to: '/admin', label: 'Administration', icon: ShieldCheck },
    ] : []),
  ]

  return (
    <div className="flex min-h-full flex-col p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-950 dark:text-white">Navigation</h2>
        <button type="button" aria-label="Close menu" onClick={onClose} className="rounded-lg p-2 text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800">
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
      <nav aria-label="Sidebar navigation" className="mt-8 space-y-2">
        {links.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.to === '/'} onClick={onClose}
            className={({ isActive }) => 'flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium ' + (
              isActive ? 'bg-indigo-50 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-200' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800'
            )}>
            <item.icon className="h-5 w-5" aria-hidden="true" />{item.label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto border-t border-gray-200 pt-5 dark:border-gray-700">
        {isAuthenticated ? (
          <button type="button" onClick={() => { onLogout(); onClose() }} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 dark:text-red-300 dark:hover:bg-gray-800">
            <LogOut className="h-5 w-5" aria-hidden="true" /> Sign out
          </button>
        ) : (
          <NavLink to="/register" onClick={onClose} className="block rounded-lg bg-indigo-700 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-indigo-800">Guardian registration</NavLink>
        )}
      </div>
    </div>
  )
}

export default Sidebar
