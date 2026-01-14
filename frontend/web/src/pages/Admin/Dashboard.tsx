import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
    Users,
    BookOpen,
    Settings,
    Shield,
    Search,
    Plus,
    MoreVertical,
    CheckCircle,
    XCircle,
    Clock,
    ExternalLink,
} from 'lucide-react'
import { cn } from '@/utils/cn'

const AdminDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'users' | 'content' | 'settings'>('users')

    const stats = [
        { label: 'Total Users', value: '1,284', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
        { label: 'Active Courses', value: '42', icon: BookOpen, color: 'text-purple-600', bg: 'bg-purple-100' },
        { label: 'Pending Reviews', value: '12', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100' },
        { label: 'System Health', value: '98%', icon: Shield, color: 'text-green-600', bg: 'bg-green-100' },
    ]

    const users = [
        { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Mentee', status: 'active', joined: '2023-12-01' },
        { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'Mentor', status: 'active', joined: '2023-11-15' },
        { id: '3', name: 'Michael Brown', email: 'michael@example.com', role: 'Admin', status: 'active', joined: '2023-10-20' },
        { id: '4', name: 'Sarah Wilson', email: 'sarah@example.com', role: 'Mentee', status: 'inactive', joined: '2023-12-10' },
    ]

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
                    <p className="text-gray-500 dark:text-gray-400">Manage your platform and users</p>
                </div>
                <div className="flex space-x-3">
                    <button className="flex items-center space-x-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors">
                        <Plus className="h-4 w-4" />
                        <span>Add New</span>
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <motion.div
                        key={stat.label}
                        whileHover={{ y: -5 }}
                        className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all dark:border-gray-800 dark:bg-gray-900"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
                                <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">{stat.value}</p>
                            </div>
                            <div className={cn('rounded-full p-3', stat.bg)}>
                                <stat.icon className={cn('h-6 w-6', stat.color)} />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-800">
                <nav className="-mb-px flex space-x-8">
                    {(['users', 'content', 'settings'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={cn(
                                'whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium transition-colors',
                                activeTab === tab
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                            )}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Tab Content */}
            <div className="mt-6">
                {activeTab === 'users' && (
                    <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 overflow-hidden">
                        <div className="border-b border-gray-200 p-4 dark:border-gray-800 flex items-center justify-between bg-gray-50 dark:bg-gray-900/50">
                            <div className="relative max-w-sm w-full">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search users..."
                                    className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                />
                            </div>
                            <div className="flex space-x-2">
                                <button className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
                                    Filter
                                </button>
                                <button className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
                                    Export
                                </button>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-xs font-medium uppercase text-gray-500 dark:bg-gray-800/50 dark:text-gray-400">
                                    <tr>
                                        <th className="px-6 py-3">User</th>
                                        <th className="px-6 py-3">Role</th>
                                        <th className="px-6 py-3">Status</th>
                                        <th className="px-6 py-3">Joined</th>
                                        <th className="px-6 py-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                                    {users.map((user) => (
                                        <tr key={user.id} className="group hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-xs">
                                                        {user.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</div>
                                                        <div className="text-xs text-gray-500">{user.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={cn(
                                                    'inline-flex items-center space-x-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
                                                    user.status === 'active'
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                                )}>
                                                    {user.status === 'active' ? (
                                                        <CheckCircle className="h-3 w-3" />
                                                    ) : (
                                                        <XCircle className="h-3 w-3" />
                                                    )}
                                                    <span>{user.status}</span>
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                                {user.joined}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                                                    <MoreVertical className="h-5 w-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="border-t border-gray-200 p-4 dark:border-gray-800 flex items-center justify-between">
                            <span className="text-sm text-gray-500">Showing 1 to 4 of 1,284 results</span>
                            <div className="flex space-x-2">
                                <button className="rounded border border-gray-300 px-3 py-1 text-sm disabled:opacity-50 dark:border-gray-700" disabled>Previous</button>
                                <button className="rounded border border-gray-300 px-3 py-1 text-sm dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">Next</button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'content' && (
                    <div className="text-center py-20 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-800">
                        <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Content Management</h3>
                        <p className="text-gray-500 dark:text-gray-400">Manage courses, paths, and learning resources here.</p>
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div className="text-center py-20 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-800">
                        <Settings className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Platform Settings</h3>
                        <p className="text-gray-500 dark:text-gray-400">Configure global platform settings and integrations.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AdminDashboard
