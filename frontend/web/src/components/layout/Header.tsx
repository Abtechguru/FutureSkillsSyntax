import React from 'react'
import { motion } from 'framer-motion'
import { Menu, Bell, Search, User, Settings, LogOut, Zap, Home } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

import Button from '@/components/ui/Button'
import NotificationBell from '@/components/ui/NotificationBell'
import { RootState } from '@/store/store'
import { cn } from '@/utils/cn'

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
  onSettingsClick,
  onLogout,
}) => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth)
  const navigate = useNavigate()

  return (
    <header className="fixed top-0 z-50 w-full border-b border-gray-200 bg-white/80 dark:border-gray-700 dark:bg-gray-900/80 backdrop-blur-sm">
      <div className="container-custom flex h-16 items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center">
          {/* Mobile Menu Button */}
          <button
            type="button"
            className="lg:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="h-6 w-6 text-gray-600 dark:text-gray-400" />
          </button>

          {/* Logo */}
          <Link to="/" className="ml-4 lg:ml-0">
            <motion.div
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  FutureSkills
                  <span className="text-primary">Syntax</span>
                </h1>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Career Path Advisor
                </p>
              </div>
            </motion.div>
          </Link>

          {/* Navigation Links (Desktop) */}
          <nav className="ml-10 hidden lg:flex items-center space-x-6">
            <Link
              to="/"
              className="text-sm font-medium text-gray-700 transition-colors hover:text-primary dark:text-gray-300 dark:hover:text-primary"
            >
              Home
            </Link>
            <Link
              to="/career/assessment"
              className="text-sm font-medium text-gray-700 transition-colors hover:text-primary dark:text-gray-300 dark:hover:text-primary"
            >
              Career Assessment
            </Link>
            <Link
              to="/mentorship"
              className="text-sm font-medium text-gray-700 transition-colors hover:text-primary dark:text-gray-300 dark:hover:text-primary"
            >
              Mentorship
            </Link>
            <Link
              to="/learning/paths"
              className="text-sm font-medium text-gray-700 transition-colors hover:text-primary dark:text-gray-300 dark:hover:text-primary"
            >
              Learning
            </Link>
            <Link
              to="/gamification"
              className="text-sm font-medium text-gray-700 transition-colors hover:text-primary dark:text-gray-300 dark:hover:text-primary"
            >
              Gamification
            </Link>
          </nav>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Search (Desktop) */}
          <div className="hidden lg:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                placeholder="Search..."
                className="h-10 w-64 rounded-lg border border-gray-300 bg-gray-50 pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-800"
              />
            </div>
          </div>

          {/* Notification Bell */}
          {isAuthenticated && (
            <NotificationBell
              count={5}
              onClick={() => navigate('/notifications')}
            />
          )}

          {/* Auth Buttons */}
          {!isAuthenticated ? (
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/login')}
              >
                Log In
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/register')}
              >
                Sign Up
              </Button>
            </div>
          ) : (
            <div className="relative group">
              <button className="flex items-center space-x-2 rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <span className="text-xs font-bold text-white">
                    {user?.username?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {user?.fullName || user?.username}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Level {currentLevel}
                  </p>
                </div>
              </button>

              {/* Dropdown Menu */}
              <div className="absolute right-0 top-full mt-2 w-48 origin-top-right scale-95 transform rounded-lg bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:scale-100 group-hover:opacity-100 group-hover:visible transition-all duration-200 dark:bg-gray-800">
                <button
                  onClick={onProfileClick}
                  className="flex w-full items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </button>
                <button
                  onClick={onSettingsClick}
                  className="flex w-full items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </button>
                <div className="my-1 border-t border-gray-200 dark:border-gray-700" />
                <button
                  onClick={onLogout}
                  className="flex w-full items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:text-red-400 dark:hover:bg-gray-700"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header