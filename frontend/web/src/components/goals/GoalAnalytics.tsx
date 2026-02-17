import React from 'react'
import { motion } from 'framer-motion'
import {
    TrendingUp,
    Target,
    CheckCircle2,
    Flame,
    Award,
    Calendar,
    BarChart3,
    PieChart,
    Activity,
    Zap,
} from 'lucide-react'
import { cn } from '@/utils/cn'

interface GoalAnalyticsProps {
    analytics: {
        totalGoals: number
        activeGoals: number
        completedGoals: number
        completionRate: number
        averageCompletionDays?: number
        goalsByCategory: Record<string, number>
        goalsByPriority: Record<string, number>
        currentStreak: number
        longestStreak: number
        totalHabits: number
        activeHabits: number
        habitCompletionRate: number
        totalCheckIns: number
        checkInsThisWeek: number
        xpEarned: number
    }
}

const GoalAnalytics: React.FC<GoalAnalyticsProps> = ({ analytics }) => {
    const categoryColors: Record<string, string> = {
        learning: 'from-blue-500 to-cyan-500',
        career: 'from-purple-500 to-pink-500',
        health: 'from-green-500 to-emerald-500',
        finance: 'from-yellow-500 to-orange-500',
        personal: 'from-indigo-500 to-purple-500',
        creativity: 'from-pink-500 to-rose-500',
    }

    const priorityColors: Record<string, string> = {
        low: 'from-gray-400 to-gray-500',
        medium: 'from-blue-500 to-blue-600',
        high: 'from-orange-500 to-orange-600',
        critical: 'from-red-500 to-red-600',
    }

    const totalCategoryGoals = Object.values(analytics.goalsByCategory).reduce((a, b) => a + b, 0)
    const totalPriorityGoals = Object.values(analytics.goalsByPriority).reduce((a, b) => a + b, 0)

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Analytics Dashboard</h2>
                <p className="text-sm text-gray-500">Track your progress and performance</p>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 text-white"
                >
                    <div className="flex items-center justify-between mb-4">
                        <Target className="w-8 h-8 opacity-80" />
                        <div className="text-right">
                            <p className="text-3xl font-bold">{analytics.activeGoals}</p>
                            <p className="text-sm opacity-80">Active Goals</p>
                        </div>
                    </div>
                    <div className="text-xs opacity-80">
                        {analytics.totalGoals} total goals
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-6 text-white"
                >
                    <div className="flex items-center justify-between mb-4">
                        <CheckCircle2 className="w-8 h-8 opacity-80" />
                        <div className="text-right">
                            <p className="text-3xl font-bold">{analytics.completionRate}%</p>
                            <p className="text-sm opacity-80">Success Rate</p>
                        </div>
                    </div>
                    <div className="text-xs opacity-80">
                        {analytics.completedGoals} goals completed
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-6 text-white"
                >
                    <div className="flex items-center justify-between mb-4">
                        <Flame className="w-8 h-8 opacity-80" />
                        <div className="text-right">
                            <p className="text-3xl font-bold">{analytics.currentStreak}</p>
                            <p className="text-sm opacity-80">Day Streak</p>
                        </div>
                    </div>
                    <div className="text-xs opacity-80">
                        Best: {analytics.longestStreak} days
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white"
                >
                    <div className="flex items-center justify-between mb-4">
                        <Zap className="w-8 h-8 opacity-80" />
                        <div className="text-right">
                            <p className="text-3xl font-bold">{analytics.xpEarned}</p>
                            <p className="text-sm opacity-80">XP Earned</p>
                        </div>
                    </div>
                    <div className="text-xs opacity-80">
                        From goals & habits
                    </div>
                </motion.div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Goals by Category */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800"
                >
                    <div className="flex items-center gap-2 mb-6">
                        <PieChart className="w-5 h-5 text-blue-600" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Goals by Category</h3>
                    </div>

                    <div className="space-y-4">
                        {Object.entries(analytics.goalsByCategory).map(([category, count], index) => {
                            const percentage = totalCategoryGoals > 0 ? (count / totalCategoryGoals) * 100 : 0
                            return (
                                <div key={category}>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                                            {category}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            {count} ({percentage.toFixed(0)}%)
                                        </span>
                                    </div>
                                    <div className="relative h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${percentage}%` }}
                                            transition={{ duration: 0.8, delay: 0.4 + index * 0.1 }}
                                            className={cn(
                                                'h-full rounded-full bg-gradient-to-r',
                                                categoryColors[category] || 'from-gray-500 to-gray-600'
                                            )}
                                        />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </motion.div>

                {/* Goals by Priority */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800"
                >
                    <div className="flex items-center gap-2 mb-6">
                        <BarChart3 className="w-5 h-5 text-purple-600" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Goals by Priority</h3>
                    </div>

                    <div className="space-y-4">
                        {Object.entries(analytics.goalsByPriority).map(([priority, count], index) => {
                            const percentage = totalPriorityGoals > 0 ? (count / totalPriorityGoals) * 100 : 0
                            return (
                                <div key={priority}>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                                            {priority}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            {count} ({percentage.toFixed(0)}%)
                                        </span>
                                    </div>
                                    <div className="relative h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${percentage}%` }}
                                            transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
                                            className={cn(
                                                'h-full rounded-full bg-gradient-to-r',
                                                priorityColors[priority] || 'from-gray-500 to-gray-600'
                                            )}
                                        />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </motion.div>
            </div>

            {/* Habits & Check-ins Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Habits Performance */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800"
                >
                    <div className="flex items-center gap-2 mb-6">
                        <Activity className="w-5 h-5 text-green-600" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Habits Performance</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Active Habits</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {analytics.activeHabits}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-500 mb-1">Total</p>
                                <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                                    {analytics.totalHabits}
                                </p>
                            </div>
                        </div>

                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                            <p className="text-sm text-gray-500 mb-2">Average Completion Rate</p>
                            <div className="flex items-center gap-4">
                                <div className="flex-1">
                                    <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${analytics.habitCompletionRate}%` }}
                                            transition={{ duration: 1, delay: 0.6 }}
                                            className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-500"
                                        />
                                    </div>
                                </div>
                                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {analytics.habitCompletionRate}%
                                </span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Check-ins Activity */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800"
                >
                    <div className="flex items-center gap-2 mb-6">
                        <Calendar className="w-5 h-5 text-orange-600" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Check-in Activity</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">This Week</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {analytics.checkInsThisWeek}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-500 mb-1">All Time</p>
                                <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                                    {analytics.totalCheckIns}
                                </p>
                            </div>
                        </div>

                        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                            <div className="flex items-center gap-3 mb-3">
                                <Award className="w-5 h-5 text-purple-600" />
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Consistency Streak
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Flame className="w-6 h-6 text-orange-500" />
                                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {analytics.currentStreak}
                                </span>
                                <span className="text-sm text-gray-500">days</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                                Keep it up! Daily check-ins boost success by 42%
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Insights */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800"
            >
                <div className="flex items-start gap-3">
                    <TrendingUp className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            Performance Insights
                        </h3>
                        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                            <li className="flex items-start gap-2">
                                <span className="text-green-600 mt-1">✓</span>
                                <span>
                                    Your {analytics.completionRate}% success rate is{' '}
                                    {analytics.completionRate > 70 ? 'excellent' : 'good'}! Keep up the momentum.
                                </span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-600 mt-1">✓</span>
                                <span>
                                    {analytics.currentStreak} day streak shows strong consistency. Aim for{' '}
                                    {analytics.longestStreak + 1} days to beat your record!
                                </span>
                            </li>
                            {analytics.habitCompletionRate < 70 && (
                                <li className="flex items-start gap-2">
                                    <span className="text-orange-600 mt-1">!</span>
                                    <span>
                                        Habit completion could be improved. Try setting reminders or reducing daily targets.
                                    </span>
                                </li>
                            )}
                            {analytics.checkInsThisWeek < 5 && (
                                <li className="flex items-start gap-2">
                                    <span className="text-orange-600 mt-1">!</span>
                                    <span>
                                        More frequent check-ins can boost your success rate. Try daily check-ins this week!
                                    </span>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

export default GoalAnalytics
