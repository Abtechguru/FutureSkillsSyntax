import React from 'react'
import { motion } from 'framer-motion'
import {
    UserPlus,
    BookOpen,
    Megaphone,
    BarChart3,
    Shield,
    Settings,
    Download,
    Mail
} from 'lucide-react'
import { cn } from '@/utils/cn'

interface QuickAction {
    label: string
    description: string
    icon: React.ElementType
    color: string
    gradient: string
    onClick?: () => void
}

const actions: QuickAction[] = [
    {
        label: 'Add User',
        description: 'Create new user account',
        icon: UserPlus,
        color: 'text-blue-600',
        gradient: 'from-blue-500 to-blue-600',
    },
    {
        label: 'Create Course',
        description: 'Add new learning content',
        icon: BookOpen,
        color: 'text-purple-600',
        gradient: 'from-purple-500 to-purple-600',
    },
    {
        label: 'Announcement',
        description: 'Send platform-wide message',
        icon: Megaphone,
        color: 'text-amber-600',
        gradient: 'from-amber-500 to-amber-600',
    },
    {
        label: 'View Reports',
        description: 'Analytics & insights',
        icon: BarChart3,
        color: 'text-green-600',
        gradient: 'from-green-500 to-green-600',
    },
    {
        label: 'Security',
        description: 'Manage access & permissions',
        icon: Shield,
        color: 'text-red-600',
        gradient: 'from-red-500 to-red-600',
    },
    {
        label: 'Settings',
        description: 'Platform configuration',
        icon: Settings,
        color: 'text-gray-600',
        gradient: 'from-gray-500 to-gray-600',
    },
    {
        label: 'Export Data',
        description: 'Download reports & data',
        icon: Download,
        color: 'text-cyan-600',
        gradient: 'from-cyan-500 to-cyan-600',
    },
    {
        label: 'Email Users',
        description: 'Send bulk notifications',
        icon: Mail,
        color: 'text-pink-600',
        gradient: 'from-pink-500 to-pink-600',
    },
]

const QuickActions: React.FC = () => {
    return (
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Quick Actions
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {actions.map((action, index) => (
                    <motion.button
                        key={action.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={action.onClick}
                        className={cn(
                            'group relative overflow-hidden rounded-xl p-4',
                            'bg-gray-50 dark:bg-gray-800/50',
                            'border border-gray-200/50 dark:border-gray-700/50',
                            'hover:border-gray-300 dark:hover:border-gray-600',
                            'transition-all duration-200',
                            'text-left'
                        )}
                    >
                        {/* Hover gradient overlay */}
                        <div className={cn(
                            'absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity',
                            'bg-gradient-to-br',
                            action.gradient
                        )} />

                        <div className="relative">
                            <div className={cn(
                                'w-10 h-10 rounded-lg mb-3',
                                'bg-white dark:bg-gray-700',
                                'flex items-center justify-center',
                                'shadow-sm'
                            )}>
                                <action.icon className={cn('w-5 h-5', action.color)} />
                            </div>

                            <p className="font-medium text-sm text-gray-900 dark:text-white">
                                {action.label}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                {action.description}
                            </p>
                        </div>
                    </motion.button>
                ))}
            </div>
        </div>
    )
}

export default QuickActions
