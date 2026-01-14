import React from 'react'
import { cn } from '@/utils/cn'

export interface SkeletonProps {
    variant?: 'text' | 'circular' | 'rectangular' | 'rounded'
    width?: string | number
    height?: string | number
    lines?: number
    className?: string
}

const Skeleton: React.FC<SkeletonProps> = ({
    variant = 'text',
    width,
    height,
    lines = 1,
    className,
}) => {
    const baseClasses = 'animate-pulse bg-gray-200 dark:bg-gray-700'

    const variantClasses = {
        text: 'rounded h-4',
        circular: 'rounded-full',
        rectangular: 'rounded-none',
        rounded: 'rounded-lg',
    }

    const style: React.CSSProperties = {
        width: width || (variant === 'text' ? '100%' : undefined),
        height: height || (variant === 'circular' ? width : undefined),
    }

    if (variant === 'text' && lines > 1) {
        return (
            <div className={cn('space-y-2', className)}>
                {Array.from({ length: lines }).map((_, index) => (
                    <div
                        key={index}
                        className={cn(baseClasses, variantClasses[variant])}
                        style={{
                            ...style,
                            width: index === lines - 1 ? '75%' : '100%',
                        }}
                    />
                ))}
            </div>
        )
    }

    return (
        <div
            className={cn(baseClasses, variantClasses[variant], className)}
            style={style}
        />
    )
}

// Skeleton presets for common patterns
export const SkeletonCard: React.FC<{ className?: string }> = ({ className }) => (
    <div className={cn('p-4 space-y-4 border border-gray-200 dark:border-gray-700 rounded-xl', className)}>
        <Skeleton variant="rounded" height={160} />
        <div className="space-y-2">
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="text" lines={2} />
        </div>
        <div className="flex gap-2">
            <Skeleton variant="circular" width={32} height={32} />
            <div className="flex-1 space-y-1">
                <Skeleton variant="text" width="40%" />
                <Skeleton variant="text" width="30%" height={12} />
            </div>
        </div>
    </div>
)

export const SkeletonAvatar: React.FC<{ size?: number; className?: string }> = ({
    size = 40,
    className,
}) => <Skeleton variant="circular" width={size} height={size} className={className} />

export const SkeletonButton: React.FC<{ width?: number; className?: string }> = ({
    width = 80,
    className,
}) => <Skeleton variant="rounded" width={width} height={36} className={className} />

export const SkeletonTable: React.FC<{
    rows?: number
    columns?: number
    className?: string
}> = ({ rows = 5, columns = 4, className }) => (
    <div className={cn('space-y-3', className)}>
        {/* Header */}
        <div className="flex gap-4 pb-2 border-b border-gray-200 dark:border-gray-700">
            {Array.from({ length: columns }).map((_, i) => (
                <Skeleton key={i} variant="text" width={`${100 / columns}%`} height={16} />
            ))}
        </div>
        {/* Rows */}
        {Array.from({ length: rows }).map((_, rowIndex) => (
            <div key={rowIndex} className="flex gap-4">
                {Array.from({ length: columns }).map((_, colIndex) => (
                    <Skeleton
                        key={colIndex}
                        variant="text"
                        width={`${100 / columns}%`}
                        height={14}
                    />
                ))}
            </div>
        ))}
    </div>
)

export default Skeleton
