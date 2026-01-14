import React, { forwardRef, useEffect, useRef } from 'react'
import { cn } from '@/utils/cn'

export interface TextareaProps
    extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string
    helperText?: string
    error?: string
    success?: boolean
    autoResize?: boolean
    minRows?: number
    maxRows?: number
    fullWidth?: boolean
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    (
        {
            label,
            helperText,
            error,
            success,
            autoResize = false,
            minRows = 3,
            maxRows = 10,
            fullWidth = false,
            className,
            disabled,
            id,
            onChange,
            ...props
        },
        ref
    ) => {
        const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`
        const internalRef = useRef<HTMLTextAreaElement>(null)
        const textareaRef = (ref as React.RefObject<HTMLTextAreaElement>) || internalRef

        const stateClasses = error
            ? 'border-error focus:border-error focus:ring-error/20'
            : success
                ? 'border-success focus:border-success focus:ring-success/20'
                : 'border-gray-300 dark:border-gray-600 focus:border-primary focus:ring-primary/20'

        const handleResize = () => {
            const textarea = textareaRef.current
            if (!textarea || !autoResize) return

            textarea.style.height = 'auto'
            const lineHeight = parseInt(getComputedStyle(textarea).lineHeight)
            const minHeight = lineHeight * minRows
            const maxHeight = lineHeight * maxRows
            const scrollHeight = textarea.scrollHeight

            textarea.style.height = `${Math.min(Math.max(scrollHeight, minHeight), maxHeight)}px`
        }

        useEffect(() => {
            handleResize()
        }, [props.value])

        const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            handleResize()
            onChange?.(e)
        }

        return (
            <div className={cn('flex flex-col gap-1', fullWidth && 'w-full')}>
                {label && (
                    <label
                        htmlFor={textareaId}
                        className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                        {label}
                    </label>
                )}
                <textarea
                    ref={textareaRef}
                    id={textareaId}
                    disabled={disabled}
                    rows={minRows}
                    onChange={handleChange}
                    className={cn(
                        'w-full rounded-lg border bg-white dark:bg-gray-800 px-4 py-3 text-sm transition-all duration-200',
                        'focus:outline-none focus:ring-2',
                        'placeholder:text-gray-400 dark:placeholder:text-gray-500',
                        'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-100 dark:disabled:bg-gray-900',
                        'resize-none',
                        stateClasses,
                        className
                    )}
                    {...props}
                />
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

Textarea.displayName = 'Textarea'

export default Textarea
