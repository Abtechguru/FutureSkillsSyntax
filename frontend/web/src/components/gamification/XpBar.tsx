import React from 'react'
import { motion } from 'framer-motion'
import { Star, TrendingUp, Zap } from 'lucide-react'
import { cn } from '@/utils/cn'

interface XpBarProps {
  currentXp: number
  currentLevel: number
  xpToNextLevel: number
  animated?: boolean
  showDetails?: boolean
  className?: string
}

const XpBar: React.FC<XpBarProps> = ({
  currentXp,
  currentLevel,
  xpToNextLevel,
  animated = true,
  showDetails = true,
  className,
}) => {
  const percentage = Math.min((currentXp / xpToNextLevel) * 100, 100)
  const xpForCurrentLevel = currentXp % 100 // Assuming 100 XP per level

  return (
    <div className={cn('space-y-2', className)}>
      {showDetails && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Zap className="h-4 w-4 text-yellow-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Level {currentLevel}
            </span>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {currentXp} / {xpToNextLevel} XP
          </div>
        </div>
      )}

      <div className="relative h-3 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
        <motion.div
          className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500"
          initial={animated ? { width: 0 } : false}
          animate={{ width: `${percentage}%` }}
          transition={{
            duration: 1.5,
            ease: "easeOut",
          }}
        />
        
        {/* XP Sparkles */}
        {animated && percentage > 0 && (
          <motion.div
            className="absolute top-0 h-full w-2 bg-white opacity-30"
            style={{ left: `${percentage}%` }}
            animate={{
              x: [-10, 10, -10],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}
      </div>

      {showDetails && (
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-1">
            <Star className="h-3 w-3" />
            <span>Next Level: {currentLevel + 1}</span>
          </div>
          <div className="flex items-center space-x-1">
            <TrendingUp className="h-3 w-3" />
            <span>{xpToNextLevel - currentXp} XP needed</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default XpBar