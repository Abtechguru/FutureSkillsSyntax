import React from 'react'
import { cn } from '@/utils/cn'

export interface BadgeProps {
    variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
    size?: 'sm' | 'md' | 'lg'
    dot?: boolean
    count?: number
    maxCount?: number
    showZero?: boolean
    children?: React.ReactNode
    className?: string
}

const Badge: React.FC<BadgeProps> = ({
    variant = 'default',
    size = 'md',
    dot = false,
    count,
    maxCount = 99,
    showZero = false,
    children,
    className,
}) => {
    const variantClasses = {
        default: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
        primary: 'bg-primary/10 text-primary',
        secondary: 'bg-secondary/10 text-secondary',
        success: 'bg-success/10 text-success',
        warning: 'bg-warning/10 text-warning',
        error: 'bg-error/10 text-error',
        info: 'bg-info/10 text-info',
    }

    const sizeClasses = {
        sm: 'px-1.5 py-0.5 text-[10px]',
        md: 'px-2 py-0.5 text-xs',
        lg: 'px-2.5 py-1 text-sm',
    }

    const dotSizeClasses = {
        sm: 'w-1.5 h-1.5',
        md: 'w-2 h-2',
        lg: 'w-2.5 h-2.5',
    }

    const dotColorClasses = {
        default: 'bg-gray-500',
        primary: 'bg-primary',
        secondary: 'bg-secondary',
        success: 'bg-success',
        warning: 'bg-warning',
        error: 'bg-error',
        info: 'bg-info',
    }

    // Dot mode
    if (dot) {
        return (
            <span
                className={cn('rounded-full', dotSizeClasses[size], dotColorClasses[variant], className)}
            />
        )
    }

    // Count mode
    if (count !== undefined) {
        if (count === 0 && !showZero) return null

        const displayCount = count > maxCount ? `${maxCount}+` : count

        return (
            <span
                className={cn(
                    'inline-flex items-center justify-center font-semibold rounded-full',
                    variantClasses[variant],
                    sizeClasses[size],
                    'min-w-[1.25rem]',
                    className
                )}
            >
                {displayCount}
            </span>
        )
    }

    // Text/children mode
    return (
        <span
            className={cn(
                'inline-flex items-center gap-1 font-medium rounded-full',
                variantClasses[variant],
                sizeClasses[size],
                className
            )}
        >
            {children}
        </span>
    )
}

// Badge with positioning (for avatars, icons, etc.)
export interface BadgeIndicatorProps extends BadgeProps {
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
    children: React.ReactNode
    badgeContent?: React.ReactNode
}

export const BadgeIndicator: React.FC<BadgeIndicatorProps> = ({
    position = 'top-right',
    children,
    badgeContent,
    ...badgeProps
}) => {
    const positionClasses = {
        'top-right': 'top-0 right-0 translate-x-1/2 -translate-y-1/2',
        'top-left': 'top-0 left-0 -translate-x-1/2 -translate-y-1/2',
        'bottom-right': 'bottom-0 right-0 translate-x-1/2 translate-y-1/2',
        'bottom-left': 'bottom-0 left-0 -translate-x-1/2 translate-y-1/2',
    }

    return (
        <div className="relative inline-flex">
            {children}
            <span className={cn('absolute', positionClasses[position])}>
                <Badge {...badgeProps}>{badgeContent}</Badge>
            </span>
        </div>
    )
}

export default Badge
