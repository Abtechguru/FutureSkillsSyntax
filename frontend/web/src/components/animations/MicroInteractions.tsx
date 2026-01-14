import React from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import { cn } from '@/utils/cn'

interface AnimatedCardProps extends HTMLMotionProps<'div'> {
    children: React.ReactNode
    hoverable?: boolean
    pressable?: boolean
    glowOnHover?: boolean
    glowColor?: string
    className?: string
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({
    children,
    hoverable = true,
    pressable = true,
    glowOnHover = false,
    glowColor = 'rgba(99, 102, 241, 0.3)',
    className,
    ...props
}) => {
    return (
        <motion.div
            whileHover={hoverable ? {
                y: -4,
                scale: 1.01,
                boxShadow: glowOnHover
                    ? `0 20px 40px -15px ${glowColor}, 0 10px 20px -10px rgba(0,0,0,0.1)`
                    : '0 20px 40px -15px rgba(0,0,0,0.15)',
            } : undefined}
            whileTap={pressable ? { scale: 0.98 } : undefined}
            transition={{
                type: 'spring',
                stiffness: 400,
                damping: 25,
            }}
            className={cn(
                'bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700',
                'shadow-sm transition-colors cursor-pointer',
                className
            )}
            {...props}
        >
            {children}
        </motion.div>
    )
}

// Animated Button with ripple effect
interface AnimatedButtonProps extends HTMLMotionProps<'button'> {
    children: React.ReactNode
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
    size?: 'sm' | 'md' | 'lg'
    loading?: boolean
    className?: string
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    className,
    ...props
}) => {
    const variants = {
        primary: 'bg-primary text-white hover:bg-primary-600',
        secondary: 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200',
        outline: 'border-2 border-primary text-primary hover:bg-primary/10',
        ghost: 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800',
    }

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2',
        lg: 'px-6 py-3 text-lg',
    }

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className={cn(
                'relative overflow-hidden rounded-lg font-medium',
                'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                variants[variant],
                sizes[size],
                className
            )}
            disabled={loading}
            {...props}
        >
            {/* Ripple effect container */}
            <span className="relative z-10 flex items-center justify-center gap-2">
                {loading && (
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                    />
                )}
                {children}
            </span>

            {/* Hover overlay */}
            <motion.div
                className="absolute inset-0 bg-white/10"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
            />
        </motion.button>
    )
}

// State animations for success/error
interface StateAnimationProps {
    type: 'success' | 'error' | 'warning' | 'info'
    message: string
    isVisible: boolean
    onClose?: () => void
}

export const StateAnimation: React.FC<StateAnimationProps> = ({
    type,
    message,
    isVisible,
    onClose,
}) => {
    const configs = {
        success: {
            bg: 'bg-green-50 dark:bg-green-900/30',
            border: 'border-green-200 dark:border-green-800',
            text: 'text-green-800 dark:text-green-200',
            icon: '✓',
        },
        error: {
            bg: 'bg-red-50 dark:bg-red-900/30',
            border: 'border-red-200 dark:border-red-800',
            text: 'text-red-800 dark:text-red-200',
            icon: '✕',
        },
        warning: {
            bg: 'bg-yellow-50 dark:bg-yellow-900/30',
            border: 'border-yellow-200 dark:border-yellow-800',
            text: 'text-yellow-800 dark:text-yellow-200',
            icon: '!',
        },
        info: {
            bg: 'bg-blue-50 dark:bg-blue-900/30',
            border: 'border-blue-200 dark:border-blue-800',
            text: 'text-blue-800 dark:text-blue-200',
            icon: 'i',
        },
    }

    const config = configs[type]

    if (!isVisible) return null

    return (
        <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg border',
                config.bg,
                config.border,
                config.text
            )}
        >
            <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="w-6 h-6 rounded-full bg-current/20 flex items-center justify-center font-bold text-sm"
            >
                {config.icon}
            </motion.span>
            <span className="flex-1">{message}</span>
            {onClose && (
                <button
                    onClick={onClose}
                    className="opacity-60 hover:opacity-100 transition-opacity"
                >
                    ✕
                </button>
            )}
        </motion.div>
    )
}

// Progress Fill Animation
interface ProgressFillAnimationProps {
    progress: number
    label?: string
    color?: string
    showPercentage?: boolean
    animated?: boolean
    className?: string
}

export const ProgressFillAnimation: React.FC<ProgressFillAnimationProps> = ({
    progress,
    label,
    color = 'bg-primary',
    showPercentage = true,
    animated = true,
    className,
}) => {
    return (
        <div className={className}>
            {(label || showPercentage) && (
                <div className="flex justify-between text-sm mb-2">
                    {label && <span className="text-gray-600 dark:text-gray-400">{label}</span>}
                    {showPercentage && (
                        <motion.span
                            key={progress}
                            initial={animated ? { opacity: 0, y: -5 } : false}
                            animate={{ opacity: 1, y: 0 }}
                            className="font-semibold text-gray-900 dark:text-white"
                        >
                            {Math.round(progress)}%
                        </motion.span>
                    )}
                </div>
            )}
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                    className={cn('h-full rounded-full', color)}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: animated ? 0.8 : 0, ease: 'easeOut' }}
                >
                    {/* Shimmer */}
                    {animated && (
                        <motion.div
                            className="h-full w-full"
                            animate={{
                                backgroundPosition: ['200% 0', '-200% 0'],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: 'linear',
                            }}
                            style={{
                                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                                backgroundSize: '200% 100%',
                            }}
                        />
                    )}
                </motion.div>
            </div>
        </div>
    )
}

// Page Transition wrapper
interface PageTransitionProps {
    children: React.ReactNode
    className?: string
}

export const PageTransition: React.FC<PageTransitionProps> = ({
    children,
    className,
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className={className}
        >
            {children}
        </motion.div>
    )
}

export default AnimatedCard
