import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  Home,
  Compass,
  Users,
  BookOpen,
  Trophy,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight,
  Zap,
  TrendingUp,
  Target,
  Calendar,
  MessageSquare,
  Award,
  Star,
  BarChart,
  Shield,
  Layout,
} from 'lucide-react'
import { useSelector } from 'react-redux'

import type { RootState } from '@/store/store'
import { cn } from '@/utils/cn'

interface SidebarProps {
  onClose: () => void
  onProfileClick: () => void
  onSettingsClick: () => void
  onLogout: () => void
}

const Sidebar: React.FC<SidebarProps> = ({
  onClose,
  onProfileClick,
  onSettingsClick,
  onLogout,
}) => {
  const { user } = useSelector((state: RootState) => state.auth)
  const { currentLevel, badgesCount } = useSelector(
    (state: RootState) => state.gamification
  )

  const mainNavItems = [
    {
      title: 'Dashboard',
      icon: Home,
      path: '/dashboard',
      description: 'Your learning dashboard',
    },
    {
      title: 'Career Assessment',
      icon: Compass,
      path: '/career/assessment',
      description: 'Find your perfect career',
    },
    {
      title: 'Career Pathways',
      icon: TrendingUp,
      path: '/career/pathways',
      description: 'Explore career options',
    },
    {
      title: 'Skill Gap Analysis',
      icon: Target,
      path: '/career/skill-gap',
      description: 'Identify skill gaps',
    },
  ]

  const mentorshipNavItems = [
    {
      title: 'Mentorship Dashboard',
      icon: Users,
      path: '/mentorship',
      description: 'Connect with mentors',
    },
    {
      title: 'Sessions',
      icon: Calendar,
      path: '/mentorship/sessions',
      description: 'View your sessions',
    },
    {
      title: 'Messages',
      icon: MessageSquare,
      path: '/mentorship/messages',
      description: 'Chat with mentors',
    },
  ]

  const learningNavItems = [
    {
      title: 'Learning Paths',
      icon: BookOpen,
      path: '/learning/paths',
      description: 'Structured learning',
    },
    {
      title: 'Progress',
      icon: BarChart,
      path: '/learning/progress',
      description: 'Track your progress',
    },
  ]

  const gamificationNavItems = [
    {
      title: 'Achievements',
      icon: Trophy,
      path: '/gamification',
      description: 'Your achievements',
    },
    {
      title: 'Badges',
      icon: Award,
      path: '/gamification/badges',
      description: 'Earned badges',
    },
    {
      title: 'Leaderboard',
      icon: Star,
      path: '/gamification/leaderboard',
      description: 'Compare with others',
    },
  ]
  const adminNavItems = [
    {
      title: 'Admin Dashboard',
      icon: Layout,
      path: '/admin',
      description: 'System management',
    },
    {
      title: 'Security',
      icon: Shield,
      path: '/admin/security',
      description: 'Access control',
    },
  ]

  const NavItem = ({ item }: { item: any }) => (
    <NavLink
      to={item.path}
      onClick={onClose}
      className={({ isActive }) =>
        cn(
          'group flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-all hover:bg-gray-100 dark:hover:bg-gray-800',
          isActive
            ? 'bg-primary/10 text-primary font-semibold'
            : 'text-gray-700 dark:text-gray-300'
        )
      }
    >
      {({ isActive }) => (
        <>
          <div className="flex items-center space-x-3">
            <item.icon
              className={cn(
                'h-5 w-5',
                isActive
                  ? 'text-primary'
                  : 'text-gray-400 group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-400'
              )}
            />
            <div className="flex-1">
              <div className="font-medium">{item.title}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {item.description}
              </div>
            </div>
          </div>
          <ChevronRight
            className={cn(
              'h-4 w-4 transition-transform',
              isActive && 'transform rotate-90'
            )}
          />
        </>
      )}
    </NavLink>
  )

  return (
    <div className="flex h-full flex-col">
      {/* User Profile */}
      <div className="border-b border-gray-200 p-4 dark:border-gray-700">
        <button
          onClick={onProfileClick}
          className="flex w-full items-center space-x-3 rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <div className="relative">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <span className="text-lg font-bold text-white">
                {user?.username?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-green-500 dark:border-gray-900">
              <Zap className="h-3 w-3 text-white" />
            </div>
          </div>
          <div className="flex-1 text-left">
            <p className="font-semibold text-gray-900 dark:text-gray-100">
              {user?.fullName || user?.username}
            </p>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-600 dark:text-gray-400">
                Level {currentLevel}
              </span>
              <span className="text-xs text-gray-600 dark:text-gray-400">•</span>
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {badgesCount} badges
              </span>
            </div>
          </div>
        </button>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Main Navigation */}
        <div className="mb-6">
          <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Main
          </h3>
          <div className="space-y-1">
            {mainNavItems.map((item) => (
              <NavItem key={item.path} item={item} />
            ))}
          </div>
        </div>

        {/* Mentorship Navigation */}
        <div className="mb-6">
          <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Mentorship
          </h3>
          <div className="space-y-1">
            {mentorshipNavItems.map((item) => (
              <NavItem key={item.path} item={item} />
            ))}
          </div>
        </div>

        {/* Learning Navigation */}
        <div className="mb-6">
          <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Learning
          </h3>
          <div className="space-y-1">
            {learningNavItems.map((item) => (
              <NavItem key={item.path} item={item} />
            ))}
          </div>
        </div>

        {/* Gamification Navigation */}
        <div className="mb-6">
          <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Gamification
          </h3>
          <div className="space-y-1">
            {gamificationNavItems.map((item) => (
              <NavItem key={item.path} item={item} />
            ))}
          </div>
        </div>

        {/* Admin Navigation */}
        {(user?.role === 'admin' || user?.role === 'mentor') && (
          <div className="mb-6">
            <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Administration
            </h3>
            <div className="space-y-1">
              {adminNavItems.map((item) => (
                <NavItem key={item.path} item={item} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="border-t border-gray-200 p-4 dark:border-gray-700">
        <button
          onClick={onSettingsClick}
          className="flex w-full items-center space-x-3 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          <Settings className="h-5 w-5" />
          <span>Settings</span>
        </button>
        <button
          onClick={() => {
            // Handle help
          }}
          className="flex w-full items-center space-x-3 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          <HelpCircle className="h-5 w-5" />
          <span>Help & Support</span>
        </button>
        <button
          onClick={onLogout}
          className="flex w-full items-center space-x-3 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-gray-100 dark:text-red-400 dark:hover:bg-gray-800"
        >
          <LogOut className="h-5 w-5" />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  )
}

export default Sidebar