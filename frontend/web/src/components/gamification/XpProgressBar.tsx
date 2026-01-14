import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Zap, TrendingUp, Star } from 'lucide-react'
import { cn } from '@/utils/cn'
import { UserLevel } from '@/services/gamification'

interface XpProgressBarProps {
    level: UserLevel
    showDetails?: boolean
    onLevelUp?: () => void
    className?: string
}

const XpProgressBar: React.FC<XpProgressBarProps> = ({
    level,
    showDetails = true,
    onLevelUp,
    className,
}) => {
    const [displayedXp, setDisplayedXp] = useState(0)
    const [isAnimating, setIsAnimating] = useState(false)

    const progress = (level.currentXp / level.xpToNextLevel) * 100
    const xpNeeded = level.xpToNextLevel - level.currentXp

    useEffect(() => {
        // Animate XP counter
        const duration = 1500
        const startTime = Date.now()
        const startXp = displayedXp
        const endXp = level.currentXp

        const animate = () => {
            const elapsed = Date.now() - startTime
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3) // ease out cubic

            setDisplayedXp(Math.round(startXp + (endXp - startXp) * eased))

            if (progress < 1) {
                requestAnimationFrame(animate)
            }
        }

        setIsAnimating(true)
        animate()
        setTimeout(() => setIsAnimating(false), duration)
    }, [level.currentXp])

    return (
        <div className={cn('relative', className)}>
            {/* Main Container */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        {/* Level Badge */}
                        <motion.div
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            className="relative"
                        >
                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary via-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                                <span className="text-xl font-bold text-white">{level.level}</span>
                            </div>
                            {/* Level glow */}
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary via-purple-500 to-pink-500 blur-lg opacity-40" />
                        </motion.div>

                        <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                {level.title}
                            </h3>
                            <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                                <Star className="w-4 h-4 text-yellow-500" />
                                <span>Level {level.level}</span>
                            </div>
                        </div>
                    </div>

                    {/* XP Counter */}
                    <motion.div
                        animate={isAnimating ? { scale: [1, 1.05, 1] } : {}}
                        className="text-right"
                    >
                        <div className="flex items-center gap-1 text-2xl font-bold text-primary">
                            <Zap className="w-6 h-6" />
                            <span>{displayedXp.toLocaleString()}</span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            / {level.xpToNextLevel.toLocaleString()} XP
                        </p>
                    </motion.div>
                </div>

                {/* Progress Bar */}
                <div className="relative">
                    {/* Track */}
                    <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        {/* Fill */}
                        <motion.div
                            className="h-full rounded-full relative overflow-hidden"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1.5, ease: 'easeOut' }}
                            style={{
                                background: 'linear-gradient(90deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)',
                            }}
                        >
                            {/* Shimmer Effect */}
                            <motion.div
                                className="absolute inset-0"
                                animate={{
                                    x: ['-200%', '200%'],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: 'linear',
                                }}
                                style={{
                                    background:
                                        'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                                }}
                            />
                        </motion.div>
                    </div>

                    {/* XP Marks */}
                    <div className="absolute inset-0 flex justify-between px-1">
                        {[25, 50, 75].map((mark) => (
                            <div
                                key={mark}
                                className="w-0.5 h-2 mt-1 bg-white/50 dark:bg-black/30"
                                style={{ marginLeft: `${mark}%` }}
                            />
                        ))}
                    </div>
                </div>

                {/* Details */}
                {showDetails && (
                    <div className="mt-4 flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            {xpNeeded.toLocaleString()} XP to next level
                        </span>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={onLevelUp}
                            className="flex items-center gap-1 text-sm text-primary hover:underline"
                        >
                            <TrendingUp className="w-4 h-4" />
                            View Progress
                        </motion.button>
                    </div>
                )}

                {/* Perks */}
                {level.perks && level.perks.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                        <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                            Level Perks
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {level.perks.map((perk, i) => (
                                <span
                                    key={i}
                                    className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full"
                                >
                                    {perk}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Floating XP particles when gaining XP */}
            {isAnimating && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {[...Array(10)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-2 h-2 rounded-full bg-primary"
                            initial={{
                                x: Math.random() * 300,
                                y: 100,
                                opacity: 1,
                            }}
                            animate={{
                                y: -50,
                                opacity: 0,
                            }}
                            transition={{
                                duration: 1,
                                delay: i * 0.1,
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export default XpProgressBar
