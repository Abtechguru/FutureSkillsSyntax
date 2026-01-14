import React from 'react'
import { motion } from 'framer-motion'
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
} from 'recharts'
import { TrendingUp } from 'lucide-react'
import { cn } from '@/utils/cn'

// Mock data for charts
const userGrowthData = [
    { name: 'Jan', users: 400, active: 240 },
    { name: 'Feb', users: 600, active: 400 },
    { name: 'Mar', users: 800, active: 500 },
    { name: 'Apr', users: 1000, active: 650 },
    { name: 'May', users: 1100, active: 800 },
    { name: 'Jun', users: 1284, active: 950 },
]

const courseCompletionData = [
    { name: 'JavaScript', completions: 892 },
    { name: 'Python', completions: 654 },
    { name: 'React', completions: 543 },
    { name: 'Cloud', completions: 421 },
    { name: 'Data Science', completions: 376 },
]

const userDistributionData = [
    { name: 'Mentees', value: 850, color: '#6366f1' },
    { name: 'Mentors', value: 280, color: '#8b5cf6' },
    { name: 'Career Seekers', value: 120, color: '#a855f7' },
    { name: 'Admins', value: 34, color: '#d946ef' },
]

const engagementData = [
    { name: 'Mon', sessions: 120, courses: 45, mentorship: 23 },
    { name: 'Tue', sessions: 150, courses: 52, mentorship: 34 },
    { name: 'Wed', sessions: 180, courses: 61, mentorship: 28 },
    { name: 'Thu', sessions: 165, courses: 48, mentorship: 42 },
    { name: 'Fri', sessions: 140, courses: 55, mentorship: 38 },
    { name: 'Sat', sessions: 90, courses: 32, mentorship: 15 },
    { name: 'Sun', sessions: 75, courses: 28, mentorship: 12 },
]

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                <p className="font-medium text-gray-900 dark:text-white">{label}</p>
                {payload.map((entry: any, index: number) => (
                    <p key={index} className="text-sm" style={{ color: entry.color }}>
                        {entry.name}: {entry.value}
                    </p>
                ))}
            </div>
        )
    }
    return null
}

const AdminAnalytics: React.FC = () => {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Analytics Overview</h2>
                    <p className="text-sm text-gray-500">Platform performance and insights</p>
                </div>
                <select className="px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary outline-none">
                    <option>Last 7 days</option>
                    <option>Last 30 days</option>
                    <option>Last 3 months</option>
                    <option>All time</option>
                </select>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* User Growth Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">User Growth</h3>
                            <p className="text-sm text-gray-500">Monthly active users</p>
                        </div>
                        <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                            <TrendingUp className="w-4 h-4" />
                            +12.5%
                        </div>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={userGrowthData}>
                                <defs>
                                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                                <XAxis dataKey="name" className="text-gray-500" />
                                <YAxis className="text-gray-500" />
                                <Tooltip content={<CustomTooltip />} />
                                <Area
                                    type="monotone"
                                    dataKey="users"
                                    stroke="#6366f1"
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill="url(#colorUsers)"
                                    name="Total Users"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="active"
                                    stroke="#8b5cf6"
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill="url(#colorActive)"
                                    name="Active Users"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Course Completions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">Course Completions</h3>
                            <p className="text-sm text-gray-500">Top performing courses</p>
                        </div>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={courseCompletionData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                                <XAxis type="number" className="text-gray-500" />
                                <YAxis dataKey="name" type="category" width={100} className="text-gray-500" />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar
                                    dataKey="completions"
                                    fill="url(#barGradient)"
                                    radius={[0, 4, 4, 0]}
                                    name="Completions"
                                >
                                    {courseCompletionData.map((_, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={`hsl(${250 + index * 15}, 70%, 55%)`}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* User Distribution */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6"
                >
                    <div className="mb-6">
                        <h3 className="font-semibold text-gray-900 dark:text-white">User Distribution</h3>
                        <p className="text-sm text-gray-500">Breakdown by role</p>
                    </div>
                    <div className="flex items-center">
                        <div className="w-48 h-48">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={userDistributionData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={40}
                                        outerRadius={70}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {userDistributionData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex-1 space-y-3">
                            {userDistributionData.map((item) => (
                                <div key={item.name} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-3 h-3 rounded-full"
                                            style={{ backgroundColor: item.color }}
                                        />
                                        <span className="text-sm text-gray-600 dark:text-gray-400">{item.name}</span>
                                    </div>
                                    <span className="font-medium text-gray-900 dark:text-white">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Weekly Engagement */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">Weekly Engagement</h3>
                            <p className="text-sm text-gray-500">Activity by day</p>
                        </div>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={engagementData}>
                                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                                <XAxis dataKey="name" className="text-gray-500" />
                                <YAxis className="text-gray-500" />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="sessions" fill="#6366f1" name="Sessions" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="courses" fill="#8b5cf6" name="Course Views" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="mentorship" fill="#a855f7" name="Mentorship" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

export default AdminAnalytics
