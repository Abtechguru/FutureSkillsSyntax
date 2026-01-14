import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, Star, Trophy, Sparkles, ArrowRight } from 'lucide-react'
import confetti from 'canvas-confetti'
import { cn } from '@/utils/cn'
import Button from '@/components/ui/Button'

interface ModuleCompletionAnimationProps {
    moduleName: string
    xpEarned: number
    isVisible: boolean
    onContinue: () => void
    nextModuleName?: string
}

const ModuleCompletionAnimation: React.FC<ModuleCompletionAnimationProps> = ({
    moduleName,
    xpEarned,
    isVisible,
    onContinue,
    nextModuleName,
}) => {
    const [step, setStep] = useState(0)

    useEffect(() => {
        if (isVisible) {
            setStep(0)

            const timers = [
                setTimeout(() => setStep(1), 300),
                setTimeout(() => setStep(2), 800),
                setTimeout(() => setStep(3), 1300),
                setTimeout(() => triggerCelebration(), 800),
            ]

            return () => timers.forEach(clearTimeout)
        }
    }, [isVisible])

    const triggerCelebration = () => {
        confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.5 },
            colors: ['#22c55e', '#16a34a', '#4ade80'],
        })
    }

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 200 }}
                        className="bg-white dark:bg-gray-900 rounded-3xl p-8 max-w-md w-full mx-4 text-center overflow-hidden relative"
                    >
                        {/* Floating Stars */}
                        <div className="absolute inset-0 pointer-events-none overflow-hidden">
                            {[...Array(15)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute"
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{
                                        scale: [0, 1, 0],
                                        opacity: [0, 1, 0],
                                        x: `${Math.random() * 100}%`,
                                        y: `${Math.random() * 100}%`,
                                    }}
                                    transition={{
                                        duration: 2,
                                        delay: i * 0.15,
                                        repeat: Infinity,
                                        repeatDelay: 1,
                                    }}
                                >
                                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                </motion.div>
                            ))}
                        </div>

                        {/* Checkmark Animation */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={step >= 1 ? { scale: 1 } : {}}
                            transition={{ type: 'spring', stiffness: 200 }}
                            className="relative mb-6 inline-block"
                        >
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-xl">
                                <motion.div
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={step >= 1 ? { scale: 1, rotate: 0 } : {}}
                                    transition={{ delay: 0.2, type: 'spring' }}
                                >
                                    <CheckCircle className="w-14 h-14 text-white" />
                                </motion.div>
                            </div>
                            {/* Glow */}
                            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 blur-xl opacity-40" />
                        </motion.div>

                        {/* Title */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={step >= 2 ? { y: 0, opacity: 1 } : {}}
                        >
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                Module Complete!
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400">
                                {moduleName}
                            </p>
                        </motion.div>

                        {/* XP Earned */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={step >= 3 ? { scale: 1 } : {}}
                            transition={{ type: 'spring' }}
                            className="mt-6 mb-8"
                        >
                            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-purple-500 rounded-full text-white">
                                <Sparkles className="w-5 h-5" />
                                <span className="text-xl font-bold">+{xpEarned} XP</span>
                            </div>
                        </motion.div>

                        {/* Actions */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={step >= 3 ? { y: 0, opacity: 1 } : {}}
                            transition={{ delay: 0.2 }}
                            className="space-y-3"
                        >
                            {nextModuleName && (
                                <Button variant="primary" fullWidth onClick={onContinue}>
                                    <span>Continue to {nextModuleName}</span>
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            )}
                            <Button variant="outline" fullWidth onClick={onContinue}>
                                Back to Course
                            </Button>
                        </motion.div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default ModuleCompletionAnimation
