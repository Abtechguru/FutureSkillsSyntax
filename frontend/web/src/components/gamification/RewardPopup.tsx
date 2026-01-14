import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Gift, X, Zap, Award, Star, Sparkles } from 'lucide-react'
import { cn } from '@/utils/cn'
import { Reward } from '@/services/gamification'
import Button from '@/components/ui/Button'

interface RewardPopupProps {
    reward: Reward
    isVisible: boolean
    onClaim: () => void
    onClose: () => void
}

const rewardConfig = {
    xp: {
        icon: Zap,
        gradient: 'from-blue-500 to-purple-500',
        title: 'XP Earned!',
    },
    badge: {
        icon: Award,
        gradient: 'from-yellow-500 to-orange-500',
        title: 'Badge Unlocked!',
    },
    item: {
        icon: Gift,
        gradient: 'from-pink-500 to-rose-500',
        title: 'New Item!',
    },
    certificate: {
        icon: Star,
        gradient: 'from-green-500 to-emerald-500',
        title: 'Certificate Earned!',
    },
}

const RewardPopup: React.FC<RewardPopupProps> = ({
    reward,
    isVisible,
    onClaim,
    onClose,
}) => {
    const [claimed, setClaimed] = useState(false)
    const config = rewardConfig[reward.type]
    const Icon = config.icon

    const handleClaim = () => {
        setClaimed(true)
        setTimeout(() => {
            onClaim()
        }, 500)
    }

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.5, y: 50, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.5, y: 50, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        onClick={(e) => e.stopPropagation()}
                        className="relative bg-white dark:bg-gray-900 rounded-3xl p-8 max-w-sm w-full mx-4 text-center overflow-hidden"
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors z-10"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>

                        {/* Sparkles Background */}
                        <div className="absolute inset-0 pointer-events-none overflow-hidden">
                            {[...Array(20)].map((_, i) => (
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
                                        delay: i * 0.1,
                                        repeat: Infinity,
                                        repeatDelay: 1,
                                    }}
                                >
                                    <Sparkles className="w-3 h-3 text-yellow-400" />
                                </motion.div>
                            ))}
                        </div>

                        {/* Reward Icon */}
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: 'spring', delay: 0.2 }}
                            className="relative mb-6 inline-block"
                        >
                            <div className={cn(
                                'w-24 h-24 rounded-full flex items-center justify-center shadow-xl',
                                `bg-gradient-to-br ${config.gradient}`
                            )}>
                                <motion.div
                                    animate={{ rotate: [0, 10, -10, 0] }}
                                    transition={{ duration: 0.5, delay: 0.5 }}
                                >
                                    <Icon className="w-12 h-12 text-white" />
                                </motion.div>
                            </div>
                            {/* Glow */}
                            <div className={cn(
                                'absolute inset-0 rounded-full blur-2xl opacity-40',
                                `bg-gradient-to-br ${config.gradient}`
                            )} />
                        </motion.div>

                        {/* Title */}
                        <motion.h2
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-2xl font-bold text-gray-900 dark:text-white mb-2"
                        >
                            {config.title}
                        </motion.h2>

                        {/* Reward Details */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="mb-6"
                        >
                            {reward.type === 'xp' && reward.amount && (
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
                                    <Zap className="w-5 h-5 text-primary" />
                                    <span className="text-xl font-bold text-primary">
                                        +{reward.amount} XP
                                    </span>
                                </div>
                            )}
                            {reward.type === 'badge' && (
                                <p className="text-gray-600 dark:text-gray-400">
                                    You've earned a new badge for your collection!
                                </p>
                            )}
                            {reward.type === 'item' && (
                                <p className="text-gray-600 dark:text-gray-400">
                                    A new avatar item has been added to your wardrobe!
                                </p>
                            )}
                            {reward.type === 'certificate' && (
                                <p className="text-gray-600 dark:text-gray-400">
                                    Download your certificate to share your achievement!
                                </p>
                            )}
                        </motion.div>

                        {/* Expiry Warning */}
                        {reward.expiresAt && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="text-sm text-orange-500 mb-4"
                            >
                                ⏰ Expires: {new Date(reward.expiresAt).toLocaleDateString()}
                            </motion.p>
                        )}

                        {/* Claim Button */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            <Button
                                variant="primary"
                                fullWidth
                                onClick={handleClaim}
                                disabled={claimed}
                            >
                                <AnimatePresence mode="wait">
                                    {claimed ? (
                                        <motion.span
                                            key="claimed"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="flex items-center gap-2"
                                        >
                                            <motion.span
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 0.5 }}
                                            >
                                                ✓
                                            </motion.span>
                                            Claimed!
                                        </motion.span>
                                    ) : (
                                        <motion.span
                                            key="claim"
                                            exit={{ scale: 0 }}
                                            className="flex items-center gap-2"
                                        >
                                            <Gift className="w-4 h-4" />
                                            Claim Reward
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </Button>
                        </motion.div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default RewardPopup
