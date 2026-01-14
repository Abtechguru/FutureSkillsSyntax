import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'

interface SkeletonLoaderProps {
    variant?: 'text' | 'circular' | 'rectangular' | 'card' | 'list-item' | 'avatar'
    width?: string | number
    height?: string | number
    count?: number
    className?: string
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
    variant = 'text',
    width,
    height,
    count = 1,
    className,
}) => {
    const getStyles = () => {
        switch (variant) {
            case 'circular':
                return { width: width || 48, height: height || 48, borderRadius: '50%' }
            case 'rectangular':
                return { width: width || '100%', height: height || 120, borderRadius: 8 }
            case 'avatar':
                return { width: width || 40, height: height || 40, borderRadius: '50%' }
            case 'text':
            default:
                return { width: width || '100%', height: height || 16, borderRadius: 4 }
        }
    }

    const renderSkeleton = (index: number) => (
        <motion.div
            key={index}
            className={cn(
                'relative overflow-hidden bg-gray-200 dark:bg-gray-700',
                className
            )}
            style={getStyles()}
        >
            {/* Shimmer Effect */}
            <motion.div
                className="absolute inset-0"
                animate={{
                    x: ['-100%', '100%'],
                }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'linear',
                }}
                style={{
                    background:
                        'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                }}
            />
        </motion.div>
    )

    if (variant === 'card') {
        return (
            <div className={cn('space-y-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700', className)}>
                <motion.div
                    className="relative overflow-hidden bg-gray-200 dark:bg-gray-700 rounded-lg"
                    style={{ width: '100%', height: 140 }}
                >
                    <motion.div
                        className="absolute inset-0"
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                        style={{
                            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                        }}
                    />
                </motion.div>
                {[80, 60, 40].map((w, i) => (
                    <motion.div
                        key={i}
                        className="relative overflow-hidden bg-gray-200 dark:bg-gray-700 rounded"
                        style={{ width: `${w}%`, height: 16 }}
                    >
                        <motion.div
                            className="absolute inset-0"
                            animate={{ x: ['-100%', '100%'] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear', delay: i * 0.1 }}
                            style={{
                                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                            }}
                        />
                    </motion.div>
                ))}
            </div>
        )
    }

    if (variant === 'list-item') {
        return (
            <div className={cn('flex items-center gap-3 p-4', className)}>
                <motion.div
                    className="relative overflow-hidden bg-gray-200 dark:bg-gray-700 rounded-full flex-shrink-0"
                    style={{ width: 48, height: 48 }}
                >
                    <motion.div
                        className="absolute inset-0"
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                        style={{
                            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                        }}
                    />
                </motion.div>
                <div className="flex-1 space-y-2">
                    {[70, 50].map((w, i) => (
                        <motion.div
                            key={i}
                            className="relative overflow-hidden bg-gray-200 dark:bg-gray-700 rounded"
                            style={{ width: `${w}%`, height: 14 }}
                        >
                            <motion.div
                                className="absolute inset-0"
                                animate={{ x: ['-100%', '100%'] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear', delay: i * 0.1 }}
                                style={{
                                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                                }}
                            />
                        </motion.div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-2">
            {[...Array(count)].map((_, i) => renderSkeleton(i))}
        </div>
    )
}

export default SkeletonLoader
