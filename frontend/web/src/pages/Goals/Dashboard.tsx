import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Target,
    TrendingUp,
    Calendar,
    CheckCircle2,
    Plus,
    Sparkles,
    Users,
    BarChart3,
    Flame,
    Heart,
    MessageCircle,
    Share2,
    ChevronRight,
    Zap,
    Activity,
    Repeat,
    Loader2,
    AlertCircle,
} from 'lucide-react'
import { cn } from '@/utils/cn'
import CreateGoalModal from '@/components/goals/CreateGoalModal'
import DailyCheckIn from '@/components/goals/DailyCheckIn'
import HabitTracker from '@/components/goals/HabitTracker'
import CommunitySupportFeed from '@/components/goals/CommunitySupportFeed'
import GoalAnalytics from '@/components/goals/GoalAnalytics'

type TabType = 'overview' | 'goals' | 'habits' | 'check-ins' | 'metrics' | 'community'

interface Goal {
    id: string
    title: string
    description: string
    category: string
    priority: 'low' | 'medium' | 'high' | 'critical'
    status: 'active' | 'completed' | 'paused'
    progress_percentage: number
    target_date: string
    streak_days: number
    supporters_count: number
}

interface Habit {
    id: string
    title: string
    description?: string
    category: string
    frequency: 'daily' | 'weekly' | 'monthly'
    current_streak: number
    longest_streak: number
    completion_rate: number
    this_week_completions: number
    target_count: number
    is_active: boolean
    completed_today?: boolean
}

interface CheckIn {
    id: string
    goal_id?: string
    mood: 'excellent' | 'good' | 'neutral' | 'struggling' | 'need_help'
    progress_note: string
    wins: string
    challenges: string
    created_at: string
    supporters_count: number
    comments_count: number
}

interface Stats {
    activeGoals: number
    completedGoals: number
    currentStreak: number
    totalSupport: number
    completionRate: number
    xpEarned: number
}

const GoalsDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabType>('overview')
    const [showCreateGoal, setShowCreateGoal] = useState(false)
    const [showCheckIn, setShowCheckIn] = useState(false)
    const [showAIAssistant, setShowAIAssistant] = useState(false)

    // Data states
    const [stats, setStats] = useState<Stats | null>(null)
    const [goals, setGoals] = useState<Goal[]>([])
    const [habits, setHabits] = useState<Habit[]>([])
    const [checkIns, setCheckIns] = useState<CheckIn[]>([])
    const [analytics, setAnalytics] = useState<any>(null)

    // Loading and error states
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1'

    // Fetch data on mount
    useEffect(() => {
        fetchDashboardData()
    }, [])

    const fetchDashboardData = async () => {
        setLoading(true)
        setError(null)

        try {
            const token = localStorage.getItem('access_token')
            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }

            // Fetch all data in parallel
            const [goalsRes, habitsRes, checkInsRes, analyticsRes] = await Promise.all([
                fetch(`${API_BASE_URL}/goals/?status=active`, { headers }),
                fetch(`${API_BASE_URL}/goals/habits?is_active=true`, { headers }),
                fetch(`${API_BASE_URL}/goals/check-ins?limit=5`, { headers }),
                fetch(`${API_BASE_URL}/goals/analytics/overview`, { headers })
            ])

            if (!goalsRes.ok || !habitsRes.ok || !checkInsRes.ok) {
                throw new Error('Failed to fetch data')
            }

            const goalsData = await goalsRes.json()
            const habitsData = await habitsRes.json()
            const checkInsData = await checkInsRes.json()

            setGoals(goalsData)
            setHabits(habitsData)
            setCheckIns(checkInsData)

            // Try to fetch analytics (might not be implemented yet)
            if (analyticsRes.ok) {
                const analyticsData = await analyticsRes.json()
                setAnalytics(analyticsData)

                // Extract stats from analytics
                setStats({
                    activeGoals: analyticsData.goals_analytics?.active_goals || 0,
                    completedGoals: analyticsData.goals_analytics?.completed_goals || 0,
                    currentStreak: analyticsData.goals_analytics?.current_streak_days || 0,
                    totalSupport: analyticsData.total_supporters || 0,
                    completionRate: analyticsData.goals_analytics?.completion_rate || 0,
                    xpEarned: analyticsData.xp_earned_from_goals || 0,
                })
            } else {
                // Calculate stats from fetched data
                const completedGoals = goalsData.filter((g: Goal) => g.status === 'completed').length
                setStats({
                    activeGoals: goalsData.length,
                    completedGoals,
                    currentStreak: goalsData[0]?.streak_days || 0,
                    totalSupport: goalsData.reduce((sum: number, g: Goal) => sum + g.supporters_count, 0),
                    completionRate: goalsData.length > 0 ? Math.round((completedGoals / goalsData.length) * 100) : 0,
                    xpEarned: 0,
                })
            }
        } catch (err) {
            console.error('Error fetching dashboard data:', err)
            setError(err instanceof Error ? err.message : 'Failed to load dashboard data')
            // Set empty defaults
            setStats({
                activeGoals: 0,
                completedGoals: 0,
                currentStreak: 0,
                totalSupport: 0,
                completionRate: 0,
                xpEarned: 0,
            })
        } finally {
            setLoading(false)
        }
    }

    const handleCreateGoal = async (goalData: any) => {
        try {
            const token = localStorage.getItem('access_token')
            const response = await fetch(`${API_BASE_URL}/goals/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(goalData)
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.detail || 'Failed to create goal')
            }

            const newGoal = await response.json()
            setGoals([newGoal, ...goals])
            setShowCreateGoal(false)

            // Refresh stats
            fetchDashboardData()
        } catch (err) {
            console.error('Error creating goal:', err)
            alert(err instanceof Error ? err.message : 'Failed to create goal')
        }
    }

    const handleCheckIn = async (checkInData: any) => {
        try {
            const token = localStorage.getItem('access_token')
            const response = await fetch(`${API_BASE_URL}/goals/check-ins`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(checkInData)
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.detail || 'Failed to create check-in')
            }

            const newCheckIn = await response.json()
            setCheckIns([newCheckIn, ...checkIns])
            setShowCheckIn(false)

            // Refresh data
            fetchDashboardData()
        } catch (err) {
            console.error('Error creating check-in:', err)
            alert(err instanceof Error ? err.message : 'Failed to create check-in')
        }
    }

    const handleCompleteHabit = async (habitId: string) => {
        try {
            const token = localStorage.getItem('access_token')
            const response = await fetch(`${API_BASE_URL}/goals/habits/${habitId}/complete`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.detail || 'Failed to complete habit')
            }

            // Refresh habits
            fetchDashboardData()
        } catch (err) {
            console.error('Error completing habit:', err)
            alert(err instanceof Error ? err.message : 'Failed to complete habit')
        }
    }

    const tabs = [
        { key: 'overview' as TabType, label: 'Overview', icon: BarChart3 },
        { key: 'goals' as TabType, label: 'Goals', icon: Target },
        { key: 'habits' as TabType, label: 'Habits', icon: Repeat },
        { key: 'check-ins' as TabType, label: 'Check-ins', icon: CheckCircle2 },
        { key: 'metrics' as TabType, label: 'Metrics', icon: Activity },
        { key: 'community' as TabType, label: 'Community', icon: Users },
    ]

    const categoryColors: Record<string, string> = {
        learning: 'from-blue-500 to-cyan-500',
        career: 'from-purple-500 to-pink-500',
        health: 'from-green-500 to-emerald-500',
        finance: 'from-yellow-500 to-orange-500',
        personal: 'from-indigo-500 to-purple-500',
        creativity: 'from-pink-500 to-rose-500',
    }

    const priorityColors: Record<string, string> = {
        low: 'text-gray-500 bg-gray-100 dark:bg-gray-800',
        medium: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30',
        high: 'text-orange-600 bg-orange-100 dark:bg-orange-900/30',
        critical: 'text-red-600 bg-red-100 dark:bg-red-900/30',
    }

    const moodEmojis: Record<string, string> = {
        excellent: '🚀',
        good: '😊',
        neutral: '😐',
        struggling: '😓',
        need_help: '🆘',
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">Loading your goals...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950 flex items-center justify-center">
                <div className="text-center max-w-md">
                    <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Failed to Load Dashboard</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
                    <button
                        onClick={fetchDashboardData}
                        className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                                Goal Tracker
                            </h1>
                            <p className="text-xs text-gray-500">Turn your dreams into reality</p>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setShowCheckIn(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all"
                            >
                                <CheckCircle2 className="w-4 h-4" />
                                <span className="hidden sm:inline">Check-in</span>
                            </button>
                            <button
                                onClick={() => setShowAIAssistant(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all"
                            >
                                <Sparkles className="w-4 h-4" />
                                <span className="hidden sm:inline">AI Assistant</span>
                            </button>
                            <button
                                onClick={() => setShowCreateGoal(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                <span className="hidden sm:inline">New Goal</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Overview */}
                {stats && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow"
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <Target className="w-5 h-5 text-blue-600" />
                                <span className="text-xs text-gray-500">Active Goals</span>
                            </div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.activeGoals}</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow"
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <CheckCircle2 className="w-5 h-5 text-green-600" />
                                <span className="text-xs text-gray-500">Completed</span>
                            </div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.completedGoals}</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-4 text-white hover:shadow-lg transition-shadow"
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <Flame className="w-5 h-5" />
                                <span className="text-xs opacity-90">Streak</span>
                            </div>
                            <p className="text-2xl font-bold">{stats.currentStreak} days</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow"
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <Heart className="w-5 h-5 text-pink-600" />
                                <span className="text-xs text-gray-500">Support</span>
                            </div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalSupport}</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow"
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <TrendingUp className="w-5 h-5 text-purple-600" />
                                <span className="text-xs text-gray-500">Success Rate</span>
                            </div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.completionRate}%</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl p-4 text-white hover:shadow-lg transition-shadow"
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <Zap className="w-5 h-5" />
                                <span className="text-xs opacity-90">XP Earned</span>
                            </div>
                            <p className="text-2xl font-bold">{stats.xpEarned}</p>
                        </motion.div>
                    </div>
                )}

                {/* Tabs */}
                <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={cn(
                                'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap',
                                activeTab === tab.key
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                                    : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-gray-800'
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
                            {/* Active Goals */}
                            {goals.length > 0 ? (
                                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Active Goals</h2>
                                        <button
                                            onClick={() => setActiveTab('goals')}
                                            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                                        >
                                            View All <ChevronRight className="w-4 h-4 inline" />
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        {goals.slice(0, 3).map((goal, index) => (
                                            <motion.div
                                                key={goal.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                className="group p-4 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-lg transition-all cursor-pointer"
                                            >
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                                                                {goal.title}
                                                            </h3>
                                                            <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', priorityColors[goal.priority])}>
                                                                {goal.priority}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-gray-500 mb-2">{goal.description}</p>
                                                        <div className="flex items-center gap-4 text-xs text-gray-500">
                                                            {goal.target_date && (
                                                                <span className="flex items-center gap-1">
                                                                    <Calendar className="w-3 h-3" />
                                                                    {new Date(goal.target_date).toLocaleDateString()}
                                                                </span>
                                                            )}
                                                            <span className="flex items-center gap-1">
                                                                <Flame className="w-3 h-3 text-orange-500" />
                                                                {goal.streak_days} day streak
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <Heart className="w-3 h-3 text-pink-500" />
                                                                {goal.supporters_count} supporters
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                                            {Math.round(goal.progress_percentage)}%
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Progress Bar */}
                                                <div className="relative h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${goal.progress_percentage}%` }}
                                                        transition={{ duration: 1, delay: index * 0.1 }}
                                                        className={cn('h-full rounded-full bg-gradient-to-r', categoryColors[goal.category] || 'from-blue-500 to-purple-500')}
                                                    />
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-white dark:bg-gray-900 rounded-2xl p-12 border border-gray-200 dark:border-gray-800 text-center">
                                    <Target className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Goals Yet</h3>
                                    <p className="text-gray-500 mb-6">Start your journey by creating your first goal</p>
                                    <button
                                        onClick={() => setShowCreateGoal(true)}
                                        className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                                    >
                                        Create Your First Goal
                                    </button>
                                </div>
                            )}

                            {/* Habits & Check-ins Grid */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Today's Habits */}
                                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Today's Habits</h2>
                                    {habits.length > 0 ? (
                                        <div className="space-y-3">
                                            {habits.slice(0, 3).map((habit) => (
                                                <div
                                                    key={habit.id}
                                                    className="flex items-center justify-between p-3 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-green-300 dark:hover:border-green-700 transition-colors"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <button
                                                            onClick={() => handleCompleteHabit(habit.id)}
                                                            disabled={habit.completed_today}
                                                            className={cn(
                                                                "w-8 h-8 rounded-full border-2 transition-colors",
                                                                habit.completed_today
                                                                    ? "border-green-500 bg-green-500"
                                                                    : "border-gray-300 dark:border-gray-700 hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20"
                                                            )}
                                                        >
                                                            {habit.completed_today && (
                                                                <CheckCircle2 className="w-5 h-5 mx-auto text-white" />
                                                            )}
                                                        </button>
                                                        <div>
                                                            <p className="font-medium text-gray-900 dark:text-white">{habit.title}</p>
                                                            <p className="text-xs text-gray-500">
                                                                {habit.this_week_completions}/{habit.target_count} this week
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-1 text-orange-500">
                                                        <Flame className="w-4 h-4" />
                                                        <span className="text-sm font-bold">{habit.current_streak}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <Repeat className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                                            <p className="text-sm text-gray-500">No habits yet</p>
                                        </div>
                                    )}
                                </div>

                                {/* Recent Check-in */}
                                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Latest Check-in</h2>
                                    {checkIns.length > 0 ? (
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <div className="text-3xl">{moodEmojis[checkIns[0].mood]}</div>
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white">Daily Check-in</p>
                                                    <p className="text-xs text-gray-500">
                                                        {new Date(checkIns[0].created_at).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                            {checkIns[0].wins && (
                                                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                                    <p className="text-xs font-medium text-green-700 dark:text-green-400 mb-1">🎉 Wins</p>
                                                    <p className="text-sm text-gray-700 dark:text-gray-300">{checkIns[0].wins}</p>
                                                </div>
                                            )}
                                            {checkIns[0].progress_note && (
                                                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                                    <p className="text-xs font-medium text-blue-700 dark:text-blue-400 mb-1">💪 Progress</p>
                                                    <p className="text-sm text-gray-700 dark:text-gray-300">{checkIns[0].progress_note}</p>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-4 pt-2">
                                                <span className="flex items-center gap-1 text-sm text-gray-500">
                                                    <Heart className="w-4 h-4" />
                                                    {checkIns[0].supporters_count}
                                                </span>
                                                <span className="flex items-center gap-1 text-sm text-gray-500">
                                                    <MessageCircle className="w-4 h-4" />
                                                    {checkIns[0].comments_count}
                                                </span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <CheckCircle2 className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                                            <p className="text-sm text-gray-500 mb-4">No check-ins yet</p>
                                            <button
                                                onClick={() => setShowCheckIn(true)}
                                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                                            >
                                                Create Check-in
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Analytics */}
                            {analytics && (
                                <GoalAnalytics analytics={analytics} />
                            )}
                        </motion.div>
                    )}

                    {activeTab === 'habits' && (
                        <motion.div
                            key="habits"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <HabitTracker
                                habits={habits}
                                onComplete={handleCompleteHabit}
                                onEdit={(id) => console.log('Edit habit:', id)}
                                onDelete={(id) => console.log('Delete habit:', id)}
                                onToggleActive={(id) => console.log('Toggle habit:', id)}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Modals */}
            <CreateGoalModal
                isOpen={showCreateGoal}
                onClose={() => setShowCreateGoal(false)}
                onSubmit={handleCreateGoal}
            />

            <DailyCheckIn
                isOpen={showCheckIn}
                onClose={() => setShowCheckIn(false)}
                onSubmit={handleCheckIn}
                goals={goals.map(g => ({ id: g.id, title: g.title }))}
            />

            {/* AI Assistant Modal - Placeholder */}
            {showAIAssistant && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={() => setShowAIAssistant(false)}
                >
                    <div
                        className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-md w-full"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">AI Assistant</h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            AI-powered goal suggestions coming soon!
                        </p>
                        <button
                            onClick={() => setShowAIAssistant(false)}
                            className="w-full px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default GoalsDashboard
