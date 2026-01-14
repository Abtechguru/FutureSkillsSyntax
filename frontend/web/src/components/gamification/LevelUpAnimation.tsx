import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, Sparkles, Zap, Award } from 'lucide-react'
import { createPortal } from 'react-dom'

import Button from '@/components/ui/Button'
import { cn } from '@/utils/cn'

interface LevelUpAnimationProps {
    isOpen: boolean
    onClose: () => void
    newLevel: number
    xpEarned?: number
    unlockedFeatures?: string[]
    nextMilestone?: string
}

const LevelUpAnimation: React.FC<LevelUpAnimationProps> = ({
    isOpen,
    onClose,
    newLevel,
    xpEarned = 100,
    unlockedFeatures = [],
    nextMilestone = 'Custom Avatar Frame',
}) => {
    const [showConfetti, setShowConfetti] = useState(false)

    useEffect(() => {
        if (isOpen) {
            setShowConfetti(true)

            // Dynamic import confetti
            import('canvas-confetti').then((confetti) => {
                const duration = 3000
                const animationEnd = Date.now() + duration
                const colors = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']

                const randomInRange = (min: number, max: number) => {
                    return Math.random() * (max - min) + min
                }

                const interval = setInterval(() => {
                    const timeLeft = animationEnd - Date.now()

                    if (timeLeft <= 0) {
                        return clearInterval(interval)
                    }

                    const particleCount = 50 * (timeLeft / duration)

                    confetti.default({
                        particleCount,
                        startVelocity: 30,
                        spread: 360,
                        origin: {
                            x: randomInRange(0.1, 0.3),
                            y: Math.random() - 0.2,
                        },
                        colors,
                    })
                    confetti.default({
                        particleCount,
                        startVelocity: 30,
                        spread: 360,
                        origin: {
                            x: randomInRange(0.7, 0.9),
                            y: Math.random() - 0.2,
                        },
                        colors,
                    })
                }, 250)

                return () => clearInterval(interval)
            })

            // Auto close after animation
            const timer = setTimeout(() => {
                setShowConfetti(false)
            }, 5000)

            return () => clearTimeout(timer)
        }
    }, [isOpen])

    if (!isOpen) return null

    return createPortal(
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 180 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-8 max-w-md w-full mx-4 text-center overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Background Glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-transparent" />

                    {/* Floating Particles */}
                    {[...Array(20)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-2 h-2 rounded-full bg-yellow-400/50"
                            initial={{
                                x: Math.random() * 400 - 200,
                                y: Math.random() * 400 - 200,
                                scale: 0,
                            }}
                            animate={{
                                x: Math.random() * 400 - 200,
                                y: Math.random() * 400 - 200,
                                scale: [0, 1, 0],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                delay: Math.random() * 2,
                            }}
                        />
                    ))}

                    {/* Level Badge */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3, type: 'spring' }}
                        className="relative inline-block mb-6"
                    >
                        <div className="absolute inset-0 animate-ping bg-yellow-500/30 rounded-full" />
                        <div className="relative w-32 h-32 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-2xl shadow-yellow-500/30">
                            <div className="text-center">
                                <Zap className="w-8 h-8 text-white mx-auto mb-1" />
                                <span className="text-4xl font-black text-white">{newLevel}</span>
                            </div>
                        </div>

                        {/* Stars Around Badge */}
                        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                            <motion.div
                                key={i}
                                className="absolute"
                                style={{
                                    left: '50%',
                                    top: '50%',
                                    transform: `rotate(${angle}deg) translateY(-80px)`,
                                }}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.5 + i * 0.1 }}
                            >
                                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Title */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <Sparkles className="w-6 h-6 text-yellow-400" />
                            <h2 className="text-3xl font-black bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
                                LEVEL UP!
                            </h2>
                            <Sparkles className="w-6 h-6 text-yellow-400" />
                        </div>
                        <p className="text-gray-400">
                            You've reached Level {newLevel}!
                        </p>
                    </motion.div>

                    {/* XP Earned */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.7 }}
                        className="my-6 inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 rounded-full"
                    >
                        <Award className="w-5 h-5 text-green-400" />
                        <span className="text-green-400 font-semibold">+{xpEarned} XP</span>
                    </motion.div>

                    {/* Unlocked Features */}
                    {unlockedFeatures.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.9 }}
                            className="mb-6 text-left"
                        >
                            <h3 className="text-sm font-semibold text-gray-400 mb-2">
                                Unlocked:
                            </h3>
                            <ul className="space-y-1">
                                {unlockedFeatures.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-2 text-white">
                                        <div className="w-2 h-2 rounded-full bg-green-400" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    )}

                    {/* Next Milestone */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.1 }}
                        className="mb-6 text-sm text-gray-400"
                    >
                        Next milestone: <span className="text-white font-medium">{nextMilestone}</span>
                    </motion.div>

                    {/* Continue Button */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.3 }}
                    >
                        <Button
                            variant="primary"
                            size="lg"
                            onClick={onClose}
                            className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                        >
                            Continue
                        </Button>
                    </motion.div>
                </motion.div>
            </motion.div>
        </AnimatePresence>,
        document.body
    )
}

export default LevelUpAnimation
