import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Bell,
    X,
    Check,
    CheckCheck,
    Trash2,
    Settings,
    MessageSquare,
    Calendar,
    Award,
    Users,
    AlertCircle,
    ChevronRight,
} from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'

import Button from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { RootState, AppDispatch } from '@/store/store'
import {
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    Notification,
} from '@/store/slices/notificationSlice'
import { cn } from '@/utils/cn'

const notificationTypeConfig = {
    session_reminder: {
        icon: Calendar,
        color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30',
    },
    mentorship_request: {
        icon: Users,
        color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30',
    },
    message: {
        icon: MessageSquare,
        color: 'bg-green-100 text-green-600 dark:bg-green-900/30',
    },
    achievement: {
        icon: Award,
        color: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30',
    },
    forum_reply: {
        icon: MessageSquare,
        color: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30',
    },
    group_invite: {
        icon: Users,
        color: 'bg-pink-100 text-pink-600 dark:bg-pink-900/30',
    },
    system: {
        icon: AlertCircle,
        color: 'bg-gray-100 text-gray-600 dark:bg-gray-800',
    },
}

const NotificationCenter: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate()
    const dropdownRef = useRef<HTMLDivElement>(null)

    const { notifications, unreadCount, loading } = useSelector(
        (state: RootState) => state.notifications
    )

    const [isOpen, setIsOpen] = useState(false)
    const [filter, setFilter] = useState<'all' | 'unread'>('all')

    useEffect(() => {
        dispatch(fetchNotifications())
    }, [dispatch])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleNotificationClick = (notification: Notification) => {
        if (!notification.read) {
            dispatch(markAsRead(notification.id))
        }
        if (notification.actionUrl) {
            navigate(notification.actionUrl)
            setIsOpen(false)
        }
    }

    const handleMarkAllRead = () => {
        dispatch(markAllAsRead())
    }

    const handleDelete = (e: React.MouseEvent, notificationId: string) => {
        e.stopPropagation()
        dispatch(deleteNotification(notificationId))
    }

    const formatTime = (dateString: string) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffMs = now.getTime() - date.getTime()
        const diffMins = Math.floor(diffMs / 60000)
        const diffHours = Math.floor(diffMs / 3600000)
        const diffDays = Math.floor(diffMs / 86400000)

        if (diffMins < 1) return 'Just now'
        if (diffMins < 60) return `${diffMins}m ago`
        if (diffHours < 24) return `${diffHours}h ago`
        if (diffDays < 7) return `${diffDays}d ago`
        return date.toLocaleDateString()
    }

    const filteredNotifications = filter === 'unread'
        ? notifications.filter(n => !n.read)
        : notifications

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-96 max-h-[80vh] bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                    Notifications
                                </h3>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={handleMarkAllRead}
                                        className="text-sm text-primary hover:underline flex items-center gap-1"
                                    >
                                        <CheckCheck className="w-4 h-4" />
                                        Mark all read
                                    </button>
                                    <Link
                                        to="/settings/notifications"
                                        onClick={() => setIsOpen(false)}
                                        className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                        <Settings className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>

                            {/* Filter */}
                            <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                <button
                                    onClick={() => setFilter('all')}
                                    className={cn(
                                        'flex-1 py-1.5 text-sm rounded-md transition-colors',
                                        filter === 'all'
                                            ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                                            : 'text-gray-600 dark:text-gray-400'
                                    )}
                                >
                                    All
                                </button>
                                <button
                                    onClick={() => setFilter('unread')}
                                    className={cn(
                                        'flex-1 py-1.5 text-sm rounded-md transition-colors flex items-center justify-center gap-1',
                                        filter === 'unread'
                                            ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                                            : 'text-gray-600 dark:text-gray-400'
                                    )}
                                >
                                    Unread
                                    {unreadCount > 0 && (
                                        <Badge variant="danger" className="text-xs">
                                            {unreadCount}
                                        </Badge>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Notification List */}
                        <div className="overflow-y-auto max-h-96">
                            {loading ? (
                                <div className="p-4 space-y-4">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="flex gap-3 animate-pulse">
                                            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full" />
                                            <div className="flex-1">
                                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
                                                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : filteredNotifications.length === 0 ? (
                                <div className="p-8 text-center">
                                    <Bell className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                                    <p className="text-gray-500 dark:text-gray-400">
                                        {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
                                    </p>
                                </div>
                            ) : (
                                <div>
                                    {filteredNotifications.map((notification) => {
                                        const config = notificationTypeConfig[notification.type]
                                        const Icon = config.icon
                                        return (
                                            <motion.div
                                                key={notification.id}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                onClick={() => handleNotificationClick(notification)}
                                                className={cn(
                                                    'flex gap-3 p-4 cursor-pointer border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group',
                                                    !notification.read && 'bg-primary/5'
                                                )}
                                            >
                                                {/* Icon or Avatar */}
                                                <div className="flex-shrink-0">
                                                    {notification.avatar ? (
                                                        <Avatar src={notification.avatar} alt="" size="md" />
                                                    ) : (
                                                        <div className={cn('p-2 rounded-full', config.color)}>
                                                            <Icon className="w-5 h-5" />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <h4 className={cn(
                                                            'text-sm font-medium text-gray-900 dark:text-white truncate',
                                                            !notification.read && 'font-semibold'
                                                        )}>
                                                            {notification.title}
                                                        </h4>
                                                        {!notification.read && (
                                                            <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1.5" />
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-0.5">
                                                        {notification.message}
                                                    </p>
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        {formatTime(notification.createdAt)}
                                                    </p>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={(e) => handleDelete(e, notification.id)}
                                                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                            <Link
                                to="/notifications"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center justify-center gap-1 text-sm text-primary hover:underline"
                            >
                                View all notifications
                                <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default NotificationCenter
