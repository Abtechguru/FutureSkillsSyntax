import React from 'react'
import { motion } from 'framer-motion'
import { Award, Crown, Star, Trophy, Zap } from 'lucide-react'
import { cn } from '@/utils/cn'

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  category: 'achievement' | 'skill' | 'social' | 'progress'
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
  xpReward: number
  earned: boolean
  earnedAt?: string
}

interface BadgeDisplayProps {
  badge: Badge
  size?: 'sm' | 'md' | 'lg'
  interactive?: boolean
  onClick?: () => void
  className?: string
}

const BadgeDisplay: React.FC<BadgeDisplayProps> = ({
  badge,
  size = 'md',
  interactive = false,
  onClick,
  className,
}) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  }

  const rarityColors = {
    common: 'from-gray-400 to-gray-600',
    uncommon: 'from-green-400 to-green-600',
    rare: 'from-blue-400 to-blue-600',
    epic: 'from-purple-400 to-purple-600',
    legend: 'from-yellow-400 to-orange-600',
  }

  const iconComponents = {
    award: Award,
    crown: Crown,
    star: Star,
    trophy: Trophy,
    zap: Zap,
  }

  const Icon = iconComponents[badge.icon as keyof typeof iconComponents] || Award

  return (
    <motion.div
      className={cn(
        'relative flex flex-col items-center',
        {
          'cursor-pointer transform transition-transform hover:scale-105': interactive,
        },
        className
      )}
      whileHover={interactive ? { scale: 1.05 } : {}}
      whileTap={interactive ? { scale: 0.95 } : {}}
      onClick={onClick}
    >
      {/* Badge Container */}
      <div className={cn('relative', sizeClasses[size])}>
        {/* Glow Effect */}
        {badge.earned && (
          <motion.div
            className={cn(
              'absolute inset-0 rounded-full bg-gradient-to-br blur-xl opacity-50',
              rarityColors[badge.rarity]
            )}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}

        {/* Badge Background */}
        <div
          className={cn(
            'absolute inset-0 rounded-full bg-gradient-to-br flex items-center justify-center',
            badge.earned
              ? rarityColors[badge.rarity]
              : 'from-gray-300 to-gray-500 grayscale'
          )}
        >
          {/* Inner Circle */}
          <div className="absolute inset-4 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center">
            <Icon
              className={cn(
                'text-gray-800 dark:text-gray-200',
                {
                  'w-6 h-6': size === 'sm',
                  'w-10 h-10': size === 'md',
                  'w-14 h-14': size === 'lg',
                }
              )}
            />
          </div>

          {/* XP Indicator */}
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
            <div className="bg-yellow-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              +{badge.xpReward}
            </div>
          </div>

          {/* Lock Icon for unearned */}
          {!badge.earned && (
            <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* Badge Info */}
      <div className="mt-2 text-center">
        <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
          {badge.name}
        </h4>
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
          {badge.description}
        </p>
        {badge.earnedAt && (
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            Earned {new Date(badge.earnedAt).toLocaleDateString()}
          </p>
        )}
      </div>
    </motion.div>
  )
}

interface BadgeGridProps {
  badges: Badge[]
  columns?: number
  onBadgeClick?: (badge: Badge) => void
}

export const BadgeGrid: React.FC<BadgeGridProps> = ({
  badges,
  columns = 4,
  onBadgeClick,
}) => {
  const gridClasses = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
  }

  return (
    <div className={cn('grid gap-4', gridClasses[columns])}>
      {badges.map((badge) => (
        <BadgeDisplay
          key={badge.id}
          badge={badge}
          interactive={!!onBadgeClick}
          onClick={() => onBadgeClick?.(badge)}
        />
      ))}
    </div>
  )
}

export default BadgeDisplay