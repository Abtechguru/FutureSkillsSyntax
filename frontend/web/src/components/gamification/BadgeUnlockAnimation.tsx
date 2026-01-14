import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Award, Star, Trophy, Crown, Sparkles, X } from 'lucide-react'
import confetti from 'canvas-confetti'
import { cn } from '@/utils/cn'
import { Badge as BadgeType } from '@/services/gamification'
import Button from '@/components/ui/Button'

interface BadgeUnlockAnimationProps {
    badge: BadgeType
    isVisible: boolean
    onClose: () => void
    onShare?: () => void
}

const tierConfig = {
    bronze: {
        gradient: 'from-amber-600 via-amber-500 to-yellow-600',
        particles: ['#d97706', '#f59e0b', '#fbbf24'],
        icon: Award,
    },
    silver: {
        gradient: 'from-slate-400 via-slate-300 to-gray-400',
        particles: ['#94a3b8', '#cbd5e1', '#e2e8f0'],
        icon: Star,
    },
    gold: {
        gradient: 'from-yellow-500 via-yellow-400 to-amber-500',
        particles: ['#eab308', '#facc15', '#fde047'],
        icon: Trophy,
    },
    platinum: {
        gradient: 'from-purple-500 via-pink-500 to-indigo-500',
        particles: ['#a855f7', '#ec4899', '#6366f1'],
        icon: Crown,
    },
}

const BadgeUnlockAnimation: React.FC<BadgeUnlockAnimationProps> = ({
    badge,
    isVisible,
    onClose,
    onShare,
}) => {
    const [showContent, setShowContent] = useState(false)
    const tier = tierConfig[badge.tier]
    const TierIcon = tier.icon

    useEffect(() => {
        if (isVisible) {
            // Delay content reveal for dramatic effect
            const timer = setTimeout(() => {
                setShowContent(true)
                triggerCelebration()
            }, 500)
            return () => clearTimeout(timer)
        } else {
            setShowContent(false)
        }
    }, [isVisible])

    const triggerCelebration = () => {
        const duration = 3000
        const animationEnd = Date.now() + duration
        const colors = tier.particles

        const frame = () => {
            confetti({
                particleCount: 3,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors,
            })
            confetti({
                particleCount: 3,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors,
            })

            if (Date.now() < animationEnd) {
                requestAnimationFrame(frame)
            }
        }

        // Initial burst
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors,
        })

        frame()
    }

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                        onClick={(e) => e.stopPropagation()}
                        className="relative bg-white dark:bg-gray-900 rounded-3xl p-8 max-w-md w-full mx-4 overflow-hidden"
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>

                        {/* Sparkle Effects */}
                        <div className="absolute inset-0 pointer-events-none">
                            {[...Array(20)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute"
                                    initial={{
                                        x: '50%',
                                        y: '40%',
                                        opacity: 0,
                                        scale: 0,
                                    }}
                                    animate={{
                                        x: `${Math.random() * 100}%`,
                                        y: `${Math.random() * 100}%`,
                                        opacity: [0, 1, 0],
                                        scale: [0, 1, 0],
                                    }}
                                    transition={{
                                        duration: 2,
                                        delay: i * 0.1,
                                        repeat: Infinity,
                                        repeatDelay: 1,
                                    }}
                                >
                                    <Sparkles
                                        className={cn(
                                            'w-4 h-4',
                                            `text-${badge.tier === 'platinum' ? 'purple' : badge.tier === 'gold' ? 'yellow' : badge.tier === 'silver' ? 'gray' : 'amber'}-400`
                                        )}
                                    />
                                </motion.div>
                            ))}
                        </div>

                        {/* Badge Container */}
                        <div className="flex flex-col items-center text-center relative z-10">
                            {/* Unlock Text */}
                            <motion.div
                                initial={{ y: -20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="mb-6"
                            >
                                <span className="text-sm font-medium uppercase tracking-wider text-primary">
                                    Achievement Unlocked!
                                </span>
                            </motion.div>

                            {/* Badge */}
                            <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={showContent ? { scale: 1, opacity: 1 } : {}}
                                transition={{ type: 'spring', stiffness: 200, delay: 0.5 }}
                                className="relative"
                            >
                                {/* Glow Effect */}
                                <div
                                    className={cn(
                                        'absolute inset-0 rounded-full blur-2xl opacity-50',
                                        `bg-gradient-to-br ${tier.gradient}`
                                    )}
                                />

                                {/* Badge Circle */}
                                <div
                                    className={cn(
                                        'relative w-32 h-32 rounded-full flex items-center justify-center',
                                        `bg-gradient-to-br ${tier.gradient}`,
                                        'shadow-2xl'
                                    )}
                                >
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                                        className="absolute inset-1 rounded-full border-4 border-white/20"
                                    />
                                    <TierIcon className="w-16 h-16 text-white drop-shadow-lg" />
                                </div>

                                {/* Tier Badge */}
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 1, type: 'spring' }}
                                    className={cn(
                                        'absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white',
                                        `bg-gradient-to-r ${tier.gradient}`
                                    )}
                                >
                                    {badge.tier}
                                </motion.div>
                            </motion.div>

                            {/* Badge Info */}
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={showContent ? { y: 0, opacity: 1 } : {}}
                                transition={{ delay: 0.8 }}
                                className="mt-8"
                            >
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                    {badge.name}
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400 max-w-xs">
                                    {badge.description}
                                </p>
                            </motion.div>

                            {/* Rarity */}
                            {badge.rarity < 20 && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 1.2, type: 'spring' }}
                                    className="mt-4 px-3 py-1 bg-gradient-to-r from-red-500 to-pink-500 rounded-full"
                                >
                                    <span className="text-xs font-bold text-white">
                                        Only {badge.rarity}% of users have this badge!
                                    </span>
                                </motion.div>
                            )}

                            {/* Actions */}
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={showContent ? { y: 0, opacity: 1 } : {}}
                                transition={{ delay: 1 }}
                                className="flex gap-3 mt-8"
                            >
                                <Button variant="outline" onClick={onClose}>
                                    Continue
                                </Button>
                                {onShare && (
                                    <Button variant="primary" onClick={onShare}>
                                        Share Achievement
                                    </Button>
                                )}
                            </motion.div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default BadgeUnlockAnimation
