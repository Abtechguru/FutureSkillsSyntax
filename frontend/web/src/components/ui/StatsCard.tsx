import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

export interface StatsCardProps {
    title: string
    value: string | number
    previousValue?: string | number
    change?: number
    changeLabel?: string
    icon?: React.ReactNode
    trend?: 'up' | 'down' | 'neutral'
    loading?: boolean
    className?: string
}

const StatsCard: React.FC<StatsCardProps> = ({
    title,
    value,
    previousValue,
    change,
    changeLabel,
    icon,
    trend,
    loading = false,
    className,
}) => {
    // Auto-detect trend from change
    const detectedTrend = trend || (change ? (change > 0 ? 'up' : change < 0 ? 'down' : 'neutral') : 'neutral')

    const trendColors = {
        up: 'text-success bg-success/10',
        down: 'text-error bg-error/10',
        neutral: 'text-gray-500 bg-gray-100 dark:bg-gray-800',
    }

    const TrendIcon = {
        up: TrendingUp,
        down: TrendingDown,
        neutral: Minus,
    }[detectedTrend]

    if (loading) {
        return (
            <div className={cn('p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700', className)}>
                <div className="animate-pulse space-y-3">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                </div>
            </div>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
                'p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700',
                className
            )}
        >
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {title}
                    </p>
                    <motion.p
                        initial={{ scale: 0.5 }}
                        animate={{ scale: 1 }}
                        className="mt-2 text-3xl font-bold text-gray-900 dark:text-white"
                    >
                        {value}
                    </motion.p>
                </div>
                {icon && (
                    <div className="p-3 rounded-lg bg-primary/10 text-primary">
                        {icon}
                    </div>
                )}
            </div>

            {(change !== undefined || previousValue !== undefined) && (
                <div className="mt-4 flex items-center gap-2">
                    {change !== undefined && (
                        <span
                            className={cn(
                                'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium',
                                trendColors[detectedTrend]
                            )}
                        >
                            <TrendIcon className="w-3 h-3" />
                            {Math.abs(change)}%
                        </span>
                    )}
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        {changeLabel || (previousValue !== undefined && `from ${previousValue}`)}
                    </span>
                </div>
            )}
        </motion.div>
    )
}

export default StatsCard
