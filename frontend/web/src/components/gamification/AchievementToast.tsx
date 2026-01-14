import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Award, X } from 'lucide-react'
import { cn } from '@/utils/cn'

interface Achievement {
  id: string
  title: string
  description: string
  xp: number
  badgeIcon?: string
}

interface AchievementToastProps {
  achievement: Achievement
  onClose: () => void
  duration?: number
}

const AchievementToast: React.FC<AchievementToastProps> = ({
  achievement,
  onClose,
  duration = 5000,
}) => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300)
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.3 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className="fixed top-4 right-4 z-50 w-80"
        >
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 p-0.5">
            {/* Animated border */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'linear',
              }}
            />

            <div className="relative rounded-2xl bg-white dark:bg-gray-900 p-4">
              <div className="flex items-start">
                {/* Achievement Icon */}
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  
                  {/* XP Badge */}
                  <div className="absolute -top-1 -right-1">
                    <div className="bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      +{achievement.xp}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="ml-4 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-gray-900 dark:text-gray-100">
                      Achievement Unlocked!
                    </h3>
                    <button
                      onClick={() => {
                        setIsVisible(false)
                        setTimeout(onClose, 300)
                      }}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <h4 className="mt-1 font-semibold text-gray-800 dark:text-gray-200">
                    {achievement.title}
                  </h4>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {achievement.description}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Keep going!</span>
                  <span>Level Up! 🚀</span>
                </div>
                <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-green-400 to-blue-500"
                    initial={{ width: 0 }}
                    animate={{ width: '75%' }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </div>
              </div>

              {/* Celebration Particles */}
              {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-yellow-400 rounded-full"
                  initial={{
                    x: 40,
                    y: 20,
                    opacity: 1,
                  }}
                  animate={{
                    x: Math.random() * 80 - 40,
                    y: Math.random() * -60,
                    opacity: 0,
                  }}
                  transition={{
                    duration: 1.5,
                    delay: i * 0.05,
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default AchievementToast