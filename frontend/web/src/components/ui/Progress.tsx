import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'

export interface ProgressProps {
    value: number
    max?: number
    size?: 'sm' | 'md' | 'lg'
    variant?: 'default' | 'success' | 'warning' | 'error'
    showLabel?: boolean
    animated?: boolean
    className?: string
}

const Progress: React.FC<ProgressProps> = ({
    value,
    max = 100,
    size = 'md',
    variant = 'default',
    showLabel = false,
    animated = true,
    className,
}) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

    const sizeClasses = {
        sm: 'h-1',
        md: 'h-2',
        lg: 'h-3',
    }

    const variantClasses = {
        default: 'bg-primary',
        success: 'bg-success',
        warning: 'bg-warning',
        error: 'bg-error',
    }

    return (
        <div className={cn('w-full', className)}>
            <div
                className={cn(
                    'w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden',
                    sizeClasses[size]
                )}
            >
                <motion.div
                    initial={animated ? { width: 0 } : false}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className={cn('h-full rounded-full', variantClasses[variant])}
                />
            </div>
            {showLabel && (
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 text-right">
                    {Math.round(percentage)}%
                </p>
            )}
        </div>
    )
}

// Circular Progress
export interface CircularProgressProps {
    value: number
    max?: number
    size?: 'sm' | 'md' | 'lg' | 'xl'
    strokeWidth?: number
    variant?: 'default' | 'success' | 'warning' | 'error'
    showLabel?: boolean
    animated?: boolean
    className?: string
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
    value,
    max = 100,
    size = 'md',
    strokeWidth = 4,
    variant = 'default',
    showLabel = true,
    animated = true,
    className,
}) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

    const sizes = {
        sm: 40,
        md: 60,
        lg: 80,
        xl: 120,
    }

    const pixelSize = sizes[size]
    const radius = (pixelSize - strokeWidth) / 2
    const circumference = 2 * Math.PI * radius
    const strokeDashoffset = circumference - (percentage / 100) * circumference

    const variantColors = {
        default: 'stroke-primary',
        success: 'stroke-success',
        warning: 'stroke-warning',
        error: 'stroke-error',
    }

    return (
        <div
            className={cn('relative inline-flex items-center justify-center', className)}
            style={{ width: pixelSize, height: pixelSize }}
        >
            <svg
                className="transform -rotate-90"
                width={pixelSize}
                height={pixelSize}
            >
                {/* Background circle */}
                <circle
                    cx={pixelSize / 2}
                    cy={pixelSize / 2}
                    r={radius}
                    fill="none"
                    strokeWidth={strokeWidth}
                    className="stroke-gray-200 dark:stroke-gray-700"
                />
                {/* Progress circle */}
                <motion.circle
                    cx={pixelSize / 2}
                    cy={pixelSize / 2}
                    r={radius}
                    fill="none"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    className={variantColors[variant]}
                    initial={animated ? { strokeDashoffset: circumference } : false}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    style={{
                        strokeDasharray: circumference,
                    }}
                />
            </svg>
            {showLabel && (
                <span className="absolute text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {Math.round(percentage)}%
                </span>
            )}
        </div>
    )
}

export default Progress
