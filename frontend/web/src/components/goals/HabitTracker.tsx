import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
    CheckCircle2,
    Circle,
    Flame,
    TrendingUp,
    Calendar,
    Target,
    Award,
    Clock,
    Repeat,
    MoreVertical,
    Edit2,
    Trash2,
    Pause,
    Play,
} from 'lucide-react'
import { cn } from '@/utils/cn'

interface Habit {
    id: string
    title: string
    description?: string
    category: string
    frequency: 'daily' | 'weekly' | 'monthly'
    targetCount: number
    currentStreak: number
    longestStreak: number
    completionRate: number
    thisWeekCompletions: number
    thisMonthCompletions: number
    isActive: boolean
    completedToday?: boolean
}

interface HabitTrackerProps {
    habits: Habit[]
    onComplete: (habitId: string) => void
    onEdit: (habitId: string) => void
    onDelete: (habitId: string) => void
    onToggleActive: (habitId: string) => void
}

const HabitTracker: React.FC<HabitTrackerProps> = ({
    habits,
    onComplete,
    onEdit,
    onDelete,
    onToggleActive,
}) => {
    const [selectedHabit, setSelectedHabit] = useState<string | null>(null)
    const [showMenu, setShowMenu] = useState<string | null>(null)

    const categoryColors: Record<string, string> = {
        learning: 'from-blue-500 to-cyan-500',
        health: 'from-green-500 to-emerald-500',
        career: 'from-purple-500 to-pink-500',
        personal: 'from-indigo-500 to-purple-500',
        creativity: 'from-pink-500 to-rose-500',
        finance: 'from-yellow-500 to-orange-500',
    }

    const frequencyLabels: Record<string, string> = {
        daily: 'Daily',
        weekly: 'Weekly',
        monthly: 'Monthly',
    }

    const getCompletionProgress = (habit: Habit) => {
        if (habit.frequency === 'daily') {
            return (habit.thisWeekCompletions / 7) * 100
        } else if (habit.frequency === 'weekly') {
            return (habit.thisWeekCompletions / habit.targetCount) * 100
        } else {
            return (habit.thisMonthCompletions / habit.targetCount) * 100
        }
    }

    return (
        <div className="space-y-4">
            {habits.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
                    <Repeat className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No habits yet</h3>
                    <p className="text-gray-500 max-w-md mx-auto mb-6">
                        Start building consistency by creating your first habit
                    </p>
                    <button className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors">
                        Create Your First Habit
                    </button>
                </div>
            ) : (
                habits.map((habit, index) => (
                    <motion.div
                        key={habit.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={cn(
                            'bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden transition-all',
                            !habit.isActive && 'opacity-60'
                        )}
                    >
                        <div className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-start gap-4 flex-1">
                                    {/* Completion Button */}
                                    <button
                                        onClick={() => onComplete(habit.id)}
                                        disabled={!habit.isActive || habit.completedToday}
                                        className={cn(
                                            'flex-shrink-0 w-12 h-12 rounded-full border-2 transition-all',
                                            habit.completedToday
                                                ? 'bg-green-500 border-green-500 text-white'
                                                : 'border-gray-300 dark:border-gray-700 hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20',
                                            !habit.isActive && 'cursor-not-allowed'
                                        )}
                                    >
                                        {habit.completedToday ? (
                                            <CheckCircle2 className="w-7 h-7 mx-auto" />
                                        ) : (
                                            <Circle className="w-7 h-7 mx-auto text-gray-400" />
                                        )}
                                    </button>

                                    {/* Habit Info */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                {habit.title}
                                            </h3>
                                            <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                                                {frequencyLabels[habit.frequency]}
                                            </span>
                                        </div>
                                        {habit.description && (
                                            <p className="text-sm text-gray-500 mb-3">{habit.description}</p>
                                        )}

                                        {/* Stats */}
                                        <div className="flex items-center gap-6 text-sm">
                                            <div className="flex items-center gap-2">
                                                <div className="flex items-center gap-1 text-orange-500">
                                                    <Flame className="w-4 h-4" />
                                                    <span className="font-bold">{habit.currentStreak}</span>
                                                </div>
                                                <span className="text-gray-500">day streak</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Award className="w-4 h-4 text-purple-500" />
                                                <span className="text-gray-500">
                                                    Best: <span className="font-medium text-gray-900 dark:text-white">{habit.longestStreak}</span>
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <TrendingUp className="w-4 h-4 text-green-500" />
                                                <span className="text-gray-500">
                                                    <span className="font-medium text-gray-900 dark:text-white">{habit.completionRate}%</span> success
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Menu */}
                                <div className="relative">
                                    <button
                                        onClick={() => setShowMenu(showMenu === habit.id ? null : habit.id)}
                                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                    >
                                        <MoreVertical className="w-5 h-5" />
                                    </button>

                                    {showMenu === habit.id && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-10"
                                        >
                                            <button
                                                onClick={() => {
                                                    onEdit(habit.id)
                                                    setShowMenu(null)
                                                }}
                                                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                                Edit Habit
                                            </button>
                                            <button
                                                onClick={() => {
                                                    onToggleActive(habit.id)
                                                    setShowMenu(null)
                                                }}
                                                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                            >
                                                {habit.isActive ? (
                                                    <>
                                                        <Pause className="w-4 h-4" />
                                                        Pause Habit
                                                    </>
                                                ) : (
                                                    <>
                                                        <Play className="w-4 h-4" />
                                                        Resume Habit
                                                    </>
                                                )}
                                            </button>
                                            <button
                                                onClick={() => {
                                                    onDelete(habit.id)
                                                    setShowMenu(null)
                                                }}
                                                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                Delete Habit
                                            </button>
                                        </motion.div>
                                    )}
                                </div>
                            </div>

                            {/* Progress Section */}
                            <div className="space-y-3">
                                {/* This Week/Month Progress */}
                                <div>
                                    <div className="flex items-center justify-between text-sm mb-2">
                                        <span className="text-gray-500">
                                            {habit.frequency === 'daily' ? 'This Week' : habit.frequency === 'weekly' ? 'This Week' : 'This Month'}
                                        </span>
                                        <span className="font-medium text-gray-900 dark:text-white">
                                            {habit.frequency === 'daily'
                                                ? `${habit.thisWeekCompletions}/7`
                                                : habit.frequency === 'weekly'
                                                    ? `${habit.thisWeekCompletions}/${habit.targetCount}`
                                                    : `${habit.thisMonthCompletions}/${habit.targetCount}`}
                                        </span>
                                    </div>
                                    <div className="relative h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${Math.min(getCompletionProgress(habit), 100)}%` }}
                                            transition={{ duration: 0.5, delay: index * 0.05 }}
                                            className={cn('h-full rounded-full bg-gradient-to-r', categoryColors[habit.category] || 'from-blue-500 to-purple-500')}
                                        />
                                    </div>
                                </div>

                                {/* Weekly Calendar View (for daily habits) */}
                                {habit.frequency === 'daily' && (
                                    <div className="flex gap-2">
                                        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                                            <div
                                                key={i}
                                                className={cn(
                                                    'flex-1 aspect-square rounded-lg flex flex-col items-center justify-center text-xs',
                                                    i < habit.thisWeekCompletions
                                                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                                                )}
                                            >
                                                <span className="font-medium">{day}</span>
                                                {i < habit.thisWeekCompletions && (
                                                    <CheckCircle2 className="w-3 h-3 mt-0.5" />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Streak Milestone */}
                            {habit.currentStreak > 0 && habit.currentStreak % 7 === 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-4 p-3 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg border border-orange-200 dark:border-orange-800"
                                >
                                    <div className="flex items-center gap-2 text-sm">
                                        <Flame className="w-4 h-4 text-orange-500" />
                                        <span className="font-medium text-orange-900 dark:text-orange-300">
                                            🎉 {habit.currentStreak} day streak milestone! Keep it up!
                                        </span>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                ))
            )}
        </div>
    )
}

export default HabitTracker
