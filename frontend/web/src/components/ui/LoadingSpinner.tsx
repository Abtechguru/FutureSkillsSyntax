import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'
import { Loader2 } from 'lucide-react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: 'primary' | 'secondary' | 'white' | 'gray'
  className?: string
  withText?: boolean
  text?: string
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'primary',
  className,
  withText = false,
  text = 'Loading...',
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  }

  const colorClasses = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    white: 'text-white',
    gray: 'text-gray-400',
  }

  return (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className={cn(sizeClasses[size], colorClasses[color])}
      >
        <Loader2 className="w-full h-full" />
      </motion.div>
      {withText && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 text-sm text-gray-600 dark:text-gray-400"
        >
          {text}
        </motion.p>
      )}
    </div>
  )
}

export default LoadingSpinner