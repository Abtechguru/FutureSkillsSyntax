import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/utils/cn'

interface StatCardProps {
    label: string
    value: string | number
    icon: React.ElementType
    trend?: {
        value: number
        isPositive: boolean
    }
    color: 'blue' | 'purple' | 'green' | 'amber' | 'red' | 'pink'
    sparklineData?: number[]
}

const colorVariants = {
    blue: {
        bg: 'bg-blue-500/10',
        text: 'text-blue-600 dark:text-blue-400',
        border: 'border-blue-500/20',
        gradient: 'from-blue-500 to-blue-600',
    },
    purple: {
        bg: 'bg-purple-500/10',
        text: 'text-purple-600 dark:text-purple-400',
        border: 'border-purple-500/20',
        gradient: 'from-purple-500 to-purple-600',
    },
    green: {
        bg: 'bg-green-500/10',
        text: 'text-green-600 dark:text-green-400',
        border: 'border-green-500/20',
        gradient: 'from-green-500 to-green-600',
    },
    amber: {
        bg: 'bg-amber-500/10',
        text: 'text-amber-600 dark:text-amber-400',
        border: 'border-amber-500/20',
        gradient: 'from-amber-500 to-amber-600',
    },
    red: {
        bg: 'bg-red-500/10',
        text: 'text-red-600 dark:text-red-400',
        border: 'border-red-500/20',
        gradient: 'from-red-500 to-red-600',
    },
    pink: {
        bg: 'bg-pink-500/10',
        text: 'text-pink-600 dark:text-pink-400',
        border: 'border-pink-500/20',
        gradient: 'from-pink-500 to-pink-600',
    },
}

const StatCard: React.FC<StatCardProps> = ({
    label,
    value,
    icon: Icon,
    trend,
    color,
    sparklineData,
}) => {
    const colors = colorVariants[color]

    // Generate sparkline path
    const generateSparklinePath = (data: number[]) => {
        if (!data || data.length < 2) return ''
        const max = Math.max(...data)
        const min = Math.min(...data)
        const range = max - min || 1
        const width = 80
        const height = 30
        const step = width / (data.length - 1)

        const points = data.map((val, i) => {
            const x = i * step
            const y = height - ((val - min) / range) * height
            return `${x},${y}`
        })

        return `M${points.join(' L')}`
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4, scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className={cn(
                'relative overflow-hidden rounded-2xl border p-6',
                'bg-white dark:bg-gray-900/80 backdrop-blur-sm',
                'border-gray-200/50 dark:border-gray-700/50',
                'shadow-lg shadow-gray-200/50 dark:shadow-gray-900/50',
                'group cursor-pointer'
            )}
        >
            {/* Background Gradient Decoration */}
            <div className={cn(
                'absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-20 blur-3xl',
                'bg-gradient-to-br',
                colors.gradient
            )} />

            <div className="relative flex items-start justify-between">
                <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {label}
                    </p>
                    <motion.p
                        className="text-3xl font-bold text-gray-900 dark:text-white"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        {value}
                    </motion.p>

                    {trend && (
                        <div className="flex items-center gap-1">
                            {trend.isPositive ? (
                                <TrendingUp className="w-4 h-4 text-green-500" />
                            ) : (
                                <TrendingDown className="w-4 h-4 text-red-500" />
                            )}
                            <span className={cn(
                                'text-sm font-medium',
                                trend.isPositive ? 'text-green-600' : 'text-red-600'
                            )}>
                                {trend.isPositive ? '+' : ''}{trend.value}%
                            </span>
                            <span className="text-xs text-gray-400">vs last week</span>
                        </div>
                    )}
                </div>

                <div className={cn(
                    'rounded-xl p-3 transition-transform group-hover:scale-110',
                    colors.bg
                )}>
                    <Icon className={cn('w-6 h-6', colors.text)} />
                </div>
            </div>

            {/* Sparkline */}
            {sparklineData && sparklineData.length > 1 && (
                <div className="absolute bottom-0 left-0 right-0 h-12 overflow-hidden opacity-50">
                    <svg
                        className="w-full h-full"
                        viewBox="0 0 80 30"
                        preserveAspectRatio="none"
                    >
                        <defs>
                            <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" className={colors.text} stopOpacity="0.3" />
                                <stop offset="100%" className={colors.text} stopOpacity="0" />
                            </linearGradient>
                        </defs>
                        <path
                            d={generateSparklinePath(sparklineData)}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className={colors.text}
                        />
                    </svg>
                </div>
            )}
        </motion.div>
    )
}

export default StatCard
