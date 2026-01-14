import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Users,
    BookOpen,
    TrendingUp,
    Settings,
    BarChart3,
    Search,
    Bell,
    Plus,
    CheckCircle,
    XCircle,
    Clock,
    Filter,
    Download,
    RefreshCw,
    Eye,
    Edit2,
    Trash2,
    UserCheck,
    AlertTriangle,
} from 'lucide-react'
import { cn } from '@/utils/cn'

// Import admin components
import StatCard from '@/components/admin/StatCard'
import AdminAIAssistant from '@/components/admin/AdminAIAssistant'
import ActivityFeed from '@/components/admin/ActivityFeed'
import QuickActions from '@/components/admin/QuickActions'
import AdminAnalytics from '@/components/admin/AdminAnalytics'

type TabType = 'overview' | 'users' | 'analytics' | 'content' | 'settings'

// Mock data
const stats = [
    {
        label: 'Total Users',
        value: '1,284',
        icon: Users,
        color: 'blue' as const,
        trend: { value: 12.5, isPositive: true },
        sparklineData: [40, 45, 52, 58, 62, 70, 75, 82]
    },
    {
        label: 'Active Courses',
        value: '42',
        icon: BookOpen,
        color: 'purple' as const,
        trend: { value: 8.2, isPositive: true },
        sparklineData: [30, 35, 32, 38, 40, 42]
    },
    {
        label: 'Revenue',
        value: '$24.5k',
        icon: TrendingUp,
        color: 'green' as const,
        trend: { value: 23.1, isPositive: true },
        sparklineData: [1200, 1500, 1400, 1800, 2100, 2450]
    },
    {
        label: 'Pending Reviews',
        value: '12',
        icon: Clock,
        color: 'amber' as const,
        trend: { value: 5, isPositive: false },
        sparklineData: [15, 18, 14, 16, 12]
    },
]

const users = [
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Mentee', status: 'active', joined: '2023-12-01', avatar: null, verified: true },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'Mentor', status: 'active', joined: '2023-11-15', avatar: null, verified: true },
    { id: '3', name: 'Michael Brown', email: 'michael@example.com', role: 'Admin', status: 'active', joined: '2023-10-20', avatar: null, verified: true },
    { id: '4', name: 'Sarah Wilson', email: 'sarah@example.com', role: 'Mentee', status: 'inactive', joined: '2023-12-10', avatar: null, verified: false },
    { id: '5', name: 'Alex Johnson', email: 'alex@example.com', role: 'Career Seeker', status: 'active', joined: '2024-01-05', avatar: null, verified: true },
    { id: '6', name: 'Emily Davis', email: 'emily@example.com', role: 'Mentee', status: 'pending', joined: '2024-01-10', avatar: null, verified: false },
]

const systemAlerts = [
    { id: '1', type: 'warning', message: '3 users awaiting email verification', action: 'Review' },
    { id: '2', type: 'info', message: 'System backup completed successfully', action: 'View Log' },
    { id: '3', type: 'success', message: '15 new course enrollments today', action: 'Details' },
]

const AdminDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabType>('overview')
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedUsers, setSelectedUsers] = useState<string[]>([])

    const tabs: { key: TabType; label: string; icon: React.ElementType }[] = [
        { key: 'overview', label: 'Overview', icon: BarChart3 },
        { key: 'users', label: 'Users', icon: Users },
        { key: 'analytics', label: 'Analytics', icon: TrendingUp },
        { key: 'content', label: 'Content', icon: BookOpen },
        { key: 'settings', label: 'Settings', icon: Settings },
    ]

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleSelectAll = () => {
        if (selectedUsers.length === filteredUsers.length) {
            setSelectedUsers([])
        } else {
            setSelectedUsers(filteredUsers.map(u => u.id))
        }
    }

    const handleSelectUser = (userId: string) => {
        setSelectedUsers(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div>
                            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                                Admin Dashboard
                            </h1>
                            <p className="text-xs text-gray-500">Welcome back, Admin</p>
                        </div>

                        <div className="flex items-center gap-4">
                            {/* Search */}
                            <div className="hidden md:flex items-center px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                                <Search className="w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="ml-2 bg-transparent border-none outline-none text-sm w-40 placeholder-gray-400"
                                />
                            </div>

                            {/* Notifications */}
                            <button className="relative p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                            </button>

                            {/* Refresh */}
                            <button className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                                <RefreshCw className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* System Alerts */}
                {systemAlerts.length > 0 && (
                    <div className="mb-6 space-y-2">
                        {systemAlerts.slice(0, 2).map((alert) => (
                            <motion.div
                                key={alert.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className={cn(
                                    'flex items-center justify-between px-4 py-3 rounded-lg',
                                    alert.type === 'warning' && 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800',
                                    alert.type === 'info' && 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800',
                                    alert.type === 'success' && 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <AlertTriangle className={cn(
                                        'w-5 h-5',
                                        alert.type === 'warning' && 'text-amber-600',
                                        alert.type === 'info' && 'text-blue-600',
                                        alert.type === 'success' && 'text-green-600'
                                    )} />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">{alert.message}</span>
                                </div>
                                <button className="text-sm font-medium text-primary hover:underline">
                                    {alert.action}
                                </button>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Tabs */}
                <div className="flex items-center gap-1 p-1 mb-6 bg-gray-100 dark:bg-gray-800 rounded-xl w-fit">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={cn(
                                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                                activeTab === tab.key
                                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                            )}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <AnimatePresence mode="wait">
                    {activeTab === 'overview' && (
                        <motion.div
                            key="overview"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-6"
                        >
                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {stats.map((stat) => (
                                    <StatCard
                                        key={stat.label}
                                        label={stat.label}
                                        value={stat.value}
                                        icon={stat.icon}
                                        color={stat.color}
                                        trend={stat.trend}
                                        sparklineData={stat.sparklineData}
                                    />
                                ))}
                            </div>

                            {/* Quick Actions */}
                            <QuickActions />

                            {/* Main Content Grid */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2">
                                    <AdminAnalytics />
                                </div>
                                <div>
                                    <ActivityFeed />
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'users' && (
                        <motion.div
                            key="users"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden">
                                {/* Toolbar */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                type="text"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                placeholder="Search users..."
                                                className="pl-10 pr-4 py-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"
                                            />
                                        </div>
                                        <button className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                                            <Filter className="w-4 h-4" />
                                            Filter
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {selectedUsers.length > 0 && (
                                            <span className="text-sm text-gray-500">
                                                {selectedUsers.length} selected
                                            </span>
                                        )}
                                        <button className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                                            <Download className="w-4 h-4" />
                                            Export
                                        </button>
                                        <button className="flex items-center gap-2 px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90">
                                            <Plus className="w-4 h-4" />
                                            Add User
                                        </button>
                                    </div>
                                </div>

                                {/* Table */}
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50 dark:bg-gray-800/50 text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                                            <tr>
                                                <th className="px-6 py-3 text-left">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                                                        onChange={handleSelectAll}
                                                        className="rounded border-gray-300"
                                                    />
                                                </th>
                                                <th className="px-6 py-3 text-left">User</th>
                                                <th className="px-6 py-3 text-left">Role</th>
                                                <th className="px-6 py-3 text-left">Status</th>
                                                <th className="px-6 py-3 text-left">Verified</th>
                                                <th className="px-6 py-3 text-left">Joined</th>
                                                <th className="px-6 py-3 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                            {filteredUsers.map((user) => (
                                                <tr key={user.id} className="group hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedUsers.includes(user.id)}
                                                            onChange={() => handleSelectUser(user.id)}
                                                            className="rounded border-gray-300"
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                                                                {user.name.charAt(0)}
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                                                                <p className="text-xs text-gray-500">{user.email}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={cn(
                                                            'inline-flex px-2.5 py-1 rounded-full text-xs font-medium',
                                                            user.role === 'Admin' && 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
                                                            user.role === 'Mentor' && 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
                                                            user.role === 'Mentee' && 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
                                                            user.role === 'Career Seeker' && 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                        )}>
                                                            {user.role}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={cn(
                                                            'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium',
                                                            user.status === 'active' && 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
                                                            user.status === 'inactive' && 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
                                                            user.status === 'pending' && 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                                        )}>
                                                            {user.status === 'active' && <CheckCircle className="w-3 h-3" />}
                                                            {user.status === 'inactive' && <XCircle className="w-3 h-3" />}
                                                            {user.status === 'pending' && <Clock className="w-3 h-3" />}
                                                            {user.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {user.verified ? (
                                                            <UserCheck className="w-5 h-5 text-green-500" />
                                                        ) : (
                                                            <span className="text-xs text-gray-400">Not verified</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-500">
                                                        {user.joined}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
                                                                <Eye className="w-4 h-4" />
                                                            </button>
                                                            <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
                                                                <Edit2 className="w-4 h-4" />
                                                            </button>
                                                            <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded">
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination */}
                                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                                    <p className="text-sm text-gray-500">
                                        Showing 1 to {filteredUsers.length} of {users.length} users
                                    </p>
                                    <div className="flex gap-2">
                                        <button className="px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg disabled:opacity-50" disabled>
                                            Previous
                                        </button>
                                        <button className="px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                                            Next
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'analytics' && (
                        <motion.div
                            key="analytics"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <AdminAnalytics />
                        </motion.div>
                    )}

                    {activeTab === 'content' && (
                        <motion.div
                            key="content"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="text-center py-20 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700"
                        >
                            <BookOpen className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Content Management</h3>
                            <p className="text-gray-500 max-w-md mx-auto">
                                Manage courses, learning paths, and educational resources. This section will include course creation, editing, and analytics.
                            </p>
                            <button className="mt-6 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
                                Create Course
                            </button>
                        </motion.div>
                    )}

                    {activeTab === 'settings' && (
                        <motion.div
                            key="settings"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="text-center py-20 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700"
                        >
                            <Settings className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Platform Settings</h3>
                            <p className="text-gray-500 max-w-md mx-auto">
                                Configure global settings, integrations, and platform preferences. Manage API keys, email templates, and security settings.
                            </p>
                            <button className="mt-6 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
                                Open Settings
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* AI Assistant */}
            <AdminAIAssistant />
        </div>
    )
}

export default AdminDashboard
