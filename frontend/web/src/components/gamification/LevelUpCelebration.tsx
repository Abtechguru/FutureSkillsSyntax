import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Star, Gift, ChevronRight, Zap } from 'lucide-react'
import confetti from 'canvas-confetti'
import { cn } from '@/utils/cn'
import { UserLevel } from '@/services/gamification'
import Button from '@/components/ui/Button'

interface LevelUpCelebrationProps {
    previousLevel: number
    newLevel: UserLevel
    isVisible: boolean
    onClose: () => void
    onViewRewards?: () => void
}

const LevelUpCelebration: React.FC<LevelUpCelebrationProps> = ({
    previousLevel,
    newLevel,
    isVisible,
    onClose,
    onViewRewards,
}) => {
    const [step, setStep] = useState(0)

    useEffect(() => {
        if (isVisible) {
            setStep(0)

            // Animate through steps
            const timers = [
                setTimeout(() => setStep(1), 500),
                setTimeout(() => setStep(2), 1500),
                setTimeout(() => setStep(3), 2500),
                setTimeout(() => triggerConfetti(), 1500),
            ]

            return () => timers.forEach(clearTimeout)
        }
    }, [isVisible])

    const triggerConfetti = () => {
        const duration = 4000
        const animationEnd = Date.now() + duration

        const randomInRange = (min: number, max: number) =>
            Math.random() * (max - min) + min

        const frame = () => {
            const timeLeft = animationEnd - Date.now()

            if (timeLeft <= 0) return

            confetti({
                particleCount: 2,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#6366f1', '#a855f7', '#ec4899', '#fbbf24'],
            })
            confetti({
                particleCount: 2,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#6366f1', '#a855f7', '#ec4899', '#fbbf24'],
            })

            requestAnimationFrame(frame)
        }

        // Initial burst
        confetti({
            particleCount: 150,
            spread: 100,
            origin: { y: 0.6 },
            colors: ['#6366f1', '#a855f7', '#ec4899', '#fbbf24'],
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
                    className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-primary/20 via-purple-500/20 to-pink-500/20 backdrop-blur-md"
                >
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 200 }}
                        className="relative bg-white dark:bg-gray-900 rounded-3xl p-8 max-w-lg w-full mx-4 overflow-hidden shadow-2xl"
                    >
                        {/* Background Particles */}
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            {[...Array(30)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute"
                                    initial={{
                                        x: '50%',
                                        y: '50%',
                                        scale: 0,
                                        opacity: 0,
                                    }}
                                    animate={{
                                        x: `${Math.random() * 100}%`,
                                        y: `${Math.random() * 100}%`,
                                        scale: [0, 1, 0],
                                        opacity: [0, 1, 0],
                                    }}
                                    transition={{
                                        duration: 3,
                                        delay: i * 0.1,
                                        repeat: Infinity,
                                        repeatDelay: 2,
                                    }}
                                >
                                    <Sparkles className="w-4 h-4 text-yellow-400" />
                                </motion.div>
                            ))}
                        </div>

                        <div className="relative z-10 text-center">
                            {/* Level Up Animation */}
                            <AnimatePresence mode="wait">
                                {step >= 0 && (
                                    <motion.div
                                        key="level-up-text"
                                        initial={{ y: -20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        className="mb-6"
                                    >
                                        <motion.span
                                            animate={{ scale: [1, 1.1, 1] }}
                                            transition={{ duration: 0.5, repeat: Infinity }}
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary via-purple-500 to-pink-500 rounded-full text-white font-bold text-lg"
                                        >
                                            <Star className="w-5 h-5" />
                                            LEVEL UP!
                                            <Star className="w-5 h-5" />
                                        </motion.span>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Level Number Transition */}
                            {step >= 1 && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', stiffness: 200 }}
                                    className="mb-6"
                                >
                                    <div className="flex items-center justify-center gap-4">
                                        <motion.div
                                            initial={{ x: 0 }}
                                            animate={{ x: -20, opacity: 0.3, scale: 0.8 }}
                                            transition={{ delay: 0.3 }}
                                            className="w-20 h-20 rounded-2xl bg-gray-200 dark:bg-gray-700 flex items-center justify-center"
                                        >
                                            <span className="text-3xl font-bold text-gray-400">
                                                {previousLevel}
                                            </span>
                                        </motion.div>

                                        <motion.div
                                            initial={{ scale: 0, rotate: -180 }}
                                            animate={{ scale: 1, rotate: 0 }}
                                            transition={{ type: 'spring', delay: 0.5 }}
                                        >
                                            <ChevronRight className="w-8 h-8 text-primary" />
                                        </motion.div>

                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: 'spring', delay: 0.7 }}
                                            className="relative"
                                        >
                                            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary via-purple-500 to-pink-500 flex items-center justify-center shadow-xl">
                                                <span className="text-4xl font-bold text-white">
                                                    {newLevel.level}
                                                </span>
                                            </div>
                                            {/* Glow */}
                                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary via-purple-500 to-pink-500 blur-xl opacity-50" />
                                        </motion.div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Title */}
                            {step >= 2 && (
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    className="mb-6"
                                >
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                        {newLevel.title}
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Congratulations! You've reached a new milestone.
                                    </p>
                                </motion.div>
                            )}

                            {/* Rewards */}
                            {step >= 3 && newLevel.perks && newLevel.perks.length > 0 && (
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    className="mb-8"
                                >
                                    <div className="flex items-center justify-center gap-2 mb-4">
                                        <Gift className="w-5 h-5 text-primary" />
                                        <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                            New Perks Unlocked
                                        </span>
                                    </div>

                                    <div className="flex flex-wrap justify-center gap-2">
                                        {newLevel.perks.map((perk, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ delay: i * 0.1 + 0.3 }}
                                                className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-lg border border-primary/20"
                                            >
                                                <Zap className="w-4 h-4 text-primary" />
                                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {perk}
                                                </span>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {/* Actions */}
                            {step >= 3 && (
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    className="flex gap-3 justify-center"
                                >
                                    <Button variant="outline" onClick={onClose}>
                                        Continue
                                    </Button>
                                    {onViewRewards && (
                                        <Button variant="primary" onClick={onViewRewards}>
                                            View All Rewards
                                        </Button>
                                    )}
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default LevelUpCelebration
