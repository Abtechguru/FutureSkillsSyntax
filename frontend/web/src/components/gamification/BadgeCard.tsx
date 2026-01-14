import React from 'react'
import { motion } from 'framer-motion'
import { Lock, Star, Trophy, Award, Crown } from 'lucide-react'
import { cn } from '@/utils/cn'
import { Badge as BadgeType } from '@/services/gamification'

interface BadgeCardProps {
    badge: BadgeType
    size?: 'sm' | 'md' | 'lg'
    showProgress?: boolean
    onClick?: () => void
    className?: string
}

const tierConfig = {
    bronze: {
        gradient: 'from-amber-600 via-amber-500 to-yellow-600',
        shadow: 'shadow-amber-500/30',
        ring: 'ring-amber-400',
        glow: 'hover:shadow-amber-500/50',
        icon: Award,
    },
    silver: {
        gradient: 'from-slate-400 via-slate-300 to-gray-400',
        shadow: 'shadow-slate-400/30',
        ring: 'ring-slate-300',
        glow: 'hover:shadow-slate-400/50',
        icon: Star,
    },
    gold: {
        gradient: 'from-yellow-500 via-yellow-400 to-amber-500',
        shadow: 'shadow-yellow-500/30',
        ring: 'ring-yellow-400',
        glow: 'hover:shadow-yellow-500/50',
        icon: Trophy,
    },
    platinum: {
        gradient: 'from-purple-500 via-pink-500 to-indigo-500',
        shadow: 'shadow-purple-500/30',
        ring: 'ring-purple-400',
        glow: 'hover:shadow-purple-500/50',
        icon: Crown,
    },
}

const sizeConfig = {
    sm: { container: 'w-16 h-16', icon: 20, text: 'text-xs' },
    md: { container: 'w-24 h-24', icon: 28, text: 'text-sm' },
    lg: { container: 'w-32 h-32', icon: 36, text: 'text-base' },
}

const BadgeCard: React.FC<BadgeCardProps> = ({
    badge,
    size = 'md',
    showProgress = false,
    onClick,
    className,
}) => {
    const tier = tierConfig[badge.tier]
    const sizeStyles = sizeConfig[size]
    const isUnlocked = !!badge.unlockedAt
    const TierIcon = tier.icon
    const progress = badge.progress && badge.requirement
        ? Math.min(100, (badge.progress / badge.requirement) * 100)
        : 0

    return (
        <motion.div
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={cn(
                'relative flex flex-col items-center cursor-pointer group',
                className
            )}
        >
            {/* Badge Container */}
            <div
                className={cn(
                    'relative rounded-full flex items-center justify-center',
                    sizeStyles.container,
                    isUnlocked
                        ? `bg-gradient-to-br ${tier.gradient} shadow-lg ${tier.shadow} ${tier.glow}`
                        : 'bg-gray-200 dark:bg-gray-700',
                    'transition-all duration-300'
                )}
            >
                {/* Outer Ring */}
                <div
                    className={cn(
                        'absolute inset-0 rounded-full ring-2',
                        isUnlocked ? tier.ring : 'ring-gray-300 dark:ring-gray-600',
                        'ring-offset-2 ring-offset-white dark:ring-offset-gray-900'
                    )}
                />

                {/* Inner Shine Effect */}
                {isUnlocked && (
                    <div className="absolute inset-1 rounded-full bg-gradient-to-br from-white/30 to-transparent" />
                )}

                {/* Icon */}
                {isUnlocked ? (
                    <motion.div
                        initial={{ rotate: -180, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 200 }}
                    >
                        <TierIcon
                            className="text-white drop-shadow-lg"
                            size={sizeStyles.icon}
                        />
                    </motion.div>
                ) : (
                    <Lock
                        className="text-gray-400 dark:text-gray-500"
                        size={sizeStyles.icon}
                    />
                )}

                {/* Progress Ring */}
                {!isUnlocked && showProgress && progress > 0 && (
                    <svg
                        className="absolute inset-0"
                        viewBox="0 0 100 100"
                    >
                        <circle
                            cx="50"
                            cy="50"
                            r="46"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="4"
                            className="text-primary/30"
                        />
                        <motion.circle
                            cx="50"
                            cy="50"
                            r="46"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="4"
                            strokeLinecap="round"
                            className="text-primary"
                            strokeDasharray={`${progress * 2.89} 289`}
                            initial={{ strokeDasharray: '0 289' }}
                            animate={{ strokeDasharray: `${progress * 2.89} 289` }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            transform="rotate(-90 50 50)"
                        />
                    </svg>
                )}

                {/* Rarity Indicator */}
                {isUnlocked && badge.rarity < 10 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                        <span className="text-[8px] font-bold text-white">RARE</span>
                    </div>
                )}
            </div>

            {/* Badge Name */}
            <motion.p
                className={cn(
                    'mt-2 font-medium text-center line-clamp-2',
                    sizeStyles.text,
                    isUnlocked ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'
                )}
            >
                {badge.name}
            </motion.p>

            {/* Tier Label */}
            <span
                className={cn(
                    'text-[10px] uppercase tracking-wider font-semibold',
                    isUnlocked ? `bg-gradient-to-r ${tier.gradient} bg-clip-text text-transparent` : 'text-gray-400'
                )}
            >
                {badge.tier}
            </span>

            {/* Hover Tooltip */}
            <div className="absolute bottom-full mb-2 px-3 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                {badge.description}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-100" />
            </div>
        </motion.div>
    )
}

export default BadgeCard
