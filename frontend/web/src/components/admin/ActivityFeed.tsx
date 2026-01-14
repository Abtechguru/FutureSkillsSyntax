import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    UserPlus,
    CheckCircle,
    MessageSquare,
    Star,
    AlertCircle,
    BookOpen,
    Award,
    Clock
} from 'lucide-react'
import { cn } from '@/utils/cn'

interface Activity {
    id: string
    type: 'registration' | 'completion' | 'review' | 'achievement' | 'system'
    message: string
    user?: string
    timestamp: Date
}

const activityIcons = {
    registration: { icon: UserPlus, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' },
    completion: { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/30' },
    review: { icon: Star, color: 'text-amber-500', bg: 'bg-amber-100 dark:bg-amber-900/30' },
    achievement: { icon: Award, color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/30' },
    system: { icon: AlertCircle, color: 'text-gray-500', bg: 'bg-gray-100 dark:bg-gray-800' },
}

const mockActivities: Activity[] = [
    { id: '1', type: 'registration', message: 'New user registered', user: 'Sarah Johnson', timestamp: new Date(Date.now() - 2 * 60000) },
    { id: '2', type: 'completion', message: 'Completed JavaScript Basics', user: 'Mike Chen', timestamp: new Date(Date.now() - 5 * 60000) },
    { id: '3', type: 'achievement', message: 'Earned "Quick Learner" badge', user: 'Emma Wilson', timestamp: new Date(Date.now() - 8 * 60000) },
    { id: '4', type: 'review', message: 'Left 5-star review on Python course', user: 'Alex Brown', timestamp: new Date(Date.now() - 15 * 60000) },
    { id: '5', type: 'system', message: 'System backup completed successfully', timestamp: new Date(Date.now() - 30 * 60000) },
    { id: '6', type: 'registration', message: 'New mentor joined', user: 'Dr. James Lee', timestamp: new Date(Date.now() - 45 * 60000) },
    { id: '7', type: 'completion', message: 'Completed mentorship session', user: 'Lisa Park', timestamp: new Date(Date.now() - 60 * 60000) },
]

const formatTimeAgo = (date: Date): string => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000)

    if (seconds < 60) return 'Just now'
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    return `${Math.floor(seconds / 86400)}d ago`
}

const ActivityFeed: React.FC = () => {
    const [activities, setActivities] = useState<Activity[]>(mockActivities)
    const [isLive, setIsLive] = useState(true)

    // Simulate real-time updates
    useEffect(() => {
        if (!isLive) return

        const interval = setInterval(() => {
            const newActivityTypes: Activity['type'][] = ['registration', 'completion', 'review', 'achievement']
            const randomType = newActivityTypes[Math.floor(Math.random() * newActivityTypes.length)]
            const names = ['John Doe', 'Jane Smith', 'Alex Johnson', 'Maria Garcia', 'Chris Lee']
            const courses = ['React Mastery', 'Python Basics', 'Cloud Computing', 'Data Science']

            const newActivity: Activity = {
                id: Date.now().toString(),
                type: randomType,
                message: randomType === 'registration'
                    ? 'New user registered'
                    : randomType === 'completion'
                        ? `Completed ${courses[Math.floor(Math.random() * courses.length)]}`
                        : randomType === 'achievement'
                            ? 'Earned a new badge'
                            : 'Left a course review',
                user: names[Math.floor(Math.random() * names.length)],
                timestamp: new Date(),
            }

            setActivities(prev => [newActivity, ...prev.slice(0, 9)])
        }, 15000) // New activity every 15 seconds

        return () => clearInterval(interval)
    }, [isLive])

    return (
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center">
                        <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">Activity Feed</h3>
                        <p className="text-xs text-gray-500">Real-time platform updates</p>
                    </div>
                </div>
                <button
                    onClick={() => setIsLive(!isLive)}
                    className={cn(
                        'flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-colors',
                        isLive
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                    )}
                >
                    <span className={cn(
                        'w-2 h-2 rounded-full',
                        isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                    )} />
                    {isLive ? 'Live' : 'Paused'}
                </button>
            </div>

            <div className="divide-y divide-gray-100 dark:divide-gray-800 max-h-96 overflow-y-auto">
                <AnimatePresence mode="popLayout">
                    {activities.map((activity) => {
                        const config = activityIcons[activity.type]
                        const Icon = config.icon

                        return (
                            <motion.div
                                key={activity.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="flex items-start gap-4 px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                            >
                                <div className={cn('rounded-full p-2', config.bg)}>
                                    <Icon className={cn('w-4 h-4', config.color)} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-gray-900 dark:text-white">
                                        {activity.user && (
                                            <span className="font-medium">{activity.user} </span>
                                        )}
                                        <span className="text-gray-600 dark:text-gray-400">
                                            {activity.message}
                                        </span>
                                    </p>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                        {formatTimeAgo(activity.timestamp)}
                                    </p>
                                </div>
                            </motion.div>
                        )
                    })}
                </AnimatePresence>
            </div>
        </div>
    )
}

export default ActivityFeed
