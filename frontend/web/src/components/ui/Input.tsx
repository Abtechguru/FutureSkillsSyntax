import React, { forwardRef } from 'react'
import { cn } from '@/utils/cn'

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
    label?: string
    helperText?: string
    error?: string
    success?: boolean
    size?: 'sm' | 'md' | 'lg'
    leftIcon?: React.ReactNode
    rightIcon?: React.ReactNode
    fullWidth?: boolean
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            label,
            helperText,
            error,
            success,
            size = 'md',
            leftIcon,
            rightIcon,
            fullWidth = false,
            className,
            disabled,
            id,
            ...props
        },
        ref
    ) => {
        const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`

        const sizeClasses = {
            sm: 'h-8 px-3 text-xs',
            md: 'h-10 px-4 text-sm',
            lg: 'h-12 px-4 text-base',
        }

        const iconSizeClasses = {
            sm: 'w-3.5 h-3.5',
            md: 'w-4 h-4',
            lg: 'w-5 h-5',
        }

        const stateClasses = error
            ? 'border-error focus:border-error focus:ring-error/20'
            : success
                ? 'border-success focus:border-success focus:ring-success/20'
                : 'border-gray-300 dark:border-gray-600 focus:border-primary focus:ring-primary/20'

        return (
            <div className={cn('flex flex-col gap-1', fullWidth && 'w-full')}>
                {label && (
                    <label
                        htmlFor={inputId}
                        className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                        {label}
                    </label>
                )}
                <div className="relative">
                    {leftIcon && (
                        <span
                            className={cn(
                                'absolute left-3 top-1/2 -translate-y-1/2 text-gray-400',
                                iconSizeClasses[size]
                            )}
                        >
                            {leftIcon}
                        </span>
                    )}
                    <input
                        ref={ref}
                        id={inputId}
                        disabled={disabled}
                        className={cn(
                            'w-full rounded-lg border bg-white dark:bg-gray-800 transition-all duration-200',
                            'focus:outline-none focus:ring-2',
                            'placeholder:text-gray-400 dark:placeholder:text-gray-500',
                            'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-100 dark:disabled:bg-gray-900',
                            sizeClasses[size],
                            stateClasses,
                            leftIcon && 'pl-10',
                            rightIcon && 'pr-10',
                            className
                        )}
                        {...props}
                    />
                    {rightIcon && (
                        <span
                            className={cn(
                                'absolute right-3 top-1/2 -translate-y-1/2 text-gray-400',
                                iconSizeClasses[size]
                            )}
                        >
                            {rightIcon}
                        </span>
                    )}
                </div>
                {(error || helperText) && (
                    <p
                        className={cn(
                            'text-xs',
                            error ? 'text-error' : 'text-gray-500 dark:text-gray-400'
                        )}
                    >
                        {error || helperText}
                    </p>
                )}
            </div>
        )
    }
)

Input.displayName = 'Input'

export default Input
