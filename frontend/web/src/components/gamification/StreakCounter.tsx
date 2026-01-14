import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Flame, Calendar, Trophy, Zap } from 'lucide-react'
import { cn } from '@/utils/cn'
import { Streak } from '@/services/gamification'

interface StreakCounterProps {
    streak: Streak
    compact?: boolean
    showMilestones?: boolean
    className?: string
}

const StreakCounter: React.FC<StreakCounterProps> = ({
    streak,
    compact = false,
    showMilestones = true,
    className,
}) => {
    const [isAnimating, setIsAnimating] = useState(false)
    const nextMilestone = streak.milestones.find(m => m > streak.current) || streak.milestones[streak.milestones.length - 1]
    const milestoneProgress = streak.current / nextMilestone * 100

    useEffect(() => {
        setIsAnimating(true)
        const timer = setTimeout(() => setIsAnimating(false), 1000)
        return () => clearTimeout(timer)
    }, [streak.current])

    const getStreakColor = () => {
        if (streak.current >= 30) return 'from-red-500 to-orange-500'
        if (streak.current >= 14) return 'from-orange-500 to-yellow-500'
        if (streak.current >= 7) return 'from-yellow-500 to-amber-400'
        return 'from-amber-400 to-yellow-300'
    }

    const getStreakStatus = () => {
        const lastActivity = new Date(streak.lastActivity)
        const today = new Date()
        const diffHours = (today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60)

        if (diffHours < 24) return { status: 'active', message: 'Streak active!' }
        if (diffHours < 48) return { status: 'warning', message: 'Complete today to keep streak!' }
        return { status: 'lost', message: 'Streak ended' }
    }

    const streakStatus = getStreakStatus()

    if (compact) {
        return (
            <motion.div
                whileHover={{ scale: 1.05 }}
                className={cn(
                    'inline-flex items-center gap-2 px-3 py-2 rounded-full',
                    'bg-gradient-to-r',
                    getStreakColor(),
                    'text-white shadow-lg cursor-pointer',
                    className
                )}
            >
                <motion.div
                    animate={isAnimating ? { scale: [1, 1.3, 1], rotate: [0, 10, -10, 0] } : {}}
                >
                    <Flame className="w-5 h-5" />
                </motion.div>
                <span className="font-bold">{streak.current}</span>
                <span className="text-sm opacity-90">day streak</span>
            </motion.div>
        )
    }

    return (
        <div className={cn('bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg', className)}>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Daily Streak
                </h3>
                <div className={cn(
                    'px-3 py-1 rounded-full text-xs font-semibold',
                    streakStatus.status === 'active' && 'bg-green-100 text-green-700',
                    streakStatus.status === 'warning' && 'bg-yellow-100 text-yellow-700',
                    streakStatus.status === 'lost' && 'bg-red-100 text-red-700',
                )}>
                    {streakStatus.message}
                </div>
            </div>

            {/* Streak Counter */}
            <div className="flex items-center gap-6">
                <motion.div
                    animate={isAnimating ? { scale: [1, 1.1, 1] } : {}}
                    className="relative"
                >
                    {/* Flame Container */}
                    <div className={cn(
                        'w-24 h-24 rounded-2xl flex items-center justify-center',
                        'bg-gradient-to-br',
                        getStreakColor(),
                        'shadow-xl'
                    )}>
                        <motion.div
                            animate={streakStatus.status === 'active' ? {
                                scale: [1, 1.1, 1],
                                rotate: [0, 5, -5, 0],
                            } : {}}
                            transition={{ duration: 0.5, repeat: Infinity }}
                        >
                            <Flame className="w-12 h-12 text-white" />
                        </motion.div>
                    </div>

                    {/* Glow Effect */}
                    <div className={cn(
                        'absolute inset-0 rounded-2xl blur-xl opacity-40',
                        'bg-gradient-to-br',
                        getStreakColor(),
                    )} />
                </motion.div>

                <div className="flex-1">
                    <div className="flex items-baseline gap-2">
                        <motion.span
                            key={streak.current}
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="text-5xl font-bold text-gray-900 dark:text-white"
                        >
                            {streak.current}
                        </motion.span>
                        <span className="text-lg text-gray-500 dark:text-gray-400">days</span>
                    </div>

                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                            <Trophy className="w-4 h-4 text-yellow-500" />
                            <span>Best: {streak.longest} days</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Milestone Progress */}
            {showMilestones && (
                <div className="mt-6">
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-500 dark:text-gray-400">
                            Next milestone: {nextMilestone} days
                        </span>
                        <span className="font-semibold text-primary">
                            {nextMilestone - streak.current} to go
                        </span>
                    </div>

                    <div className="relative h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                            className={cn('h-full rounded-full bg-gradient-to-r', getStreakColor())}
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(milestoneProgress, 100)}%` }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                        />

                        {/* Milestone Markers */}
                        {streak.milestones.map((milestone) => (
                            <div
                                key={milestone}
                                className={cn(
                                    'absolute top-0 h-full w-0.5',
                                    streak.current >= milestone
                                        ? 'bg-white/50'
                                        : 'bg-gray-300 dark:bg-gray-600'
                                )}
                                style={{ left: `${(milestone / streak.milestones[streak.milestones.length - 1]) * 100}%` }}
                            />
                        ))}
                    </div>

                    {/* Milestone Badges */}
                    <div className="flex justify-between mt-3">
                        {streak.milestones.slice(0, 5).map((milestone) => (
                            <motion.div
                                key={milestone}
                                whileHover={{ scale: 1.1 }}
                                className={cn(
                                    'flex flex-col items-center',
                                    streak.current >= milestone ? 'opacity-100' : 'opacity-40'
                                )}
                            >
                                <div className={cn(
                                    'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold',
                                    streak.current >= milestone
                                        ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white'
                                        : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                                )}>
                                    {milestone}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {/* Streak Benefits */}
            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2 text-sm">
                    <Zap className="w-4 h-4 text-primary" />
                    <span className="text-gray-600 dark:text-gray-400">
                        {streak.current >= 7 && 'Earning 2x XP bonus!'}
                        {streak.current >= 3 && streak.current < 7 && 'Earning 1.5x XP bonus!'}
                        {streak.current < 3 && 'Build a 3-day streak for XP bonus!'}
                    </span>
                </div>
            </div>
        </div>
    )
}

export default StreakCounter
