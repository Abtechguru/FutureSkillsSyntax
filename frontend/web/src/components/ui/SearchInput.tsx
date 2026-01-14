import React, { forwardRef, useState } from 'react'
import { cn } from '@/utils/cn'
import { Search, X, Loader2 } from 'lucide-react'

export interface SearchInputProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
    size?: 'sm' | 'md' | 'lg'
    loading?: boolean
    onClear?: () => void
    fullWidth?: boolean
}

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
    (
        {
            size = 'md',
            loading = false,
            onClear,
            fullWidth = false,
            className,
            value,
            onChange,
            ...props
        },
        ref
    ) => {
        const [internalValue, setInternalValue] = useState('')
        const displayValue = value !== undefined ? value : internalValue

        const sizeClasses = {
            sm: 'h-8 pl-8 pr-8 text-xs',
            md: 'h-10 pl-10 pr-10 text-sm',
            lg: 'h-12 pl-12 pr-12 text-base',
        }

        const iconSizeClasses = {
            sm: 'w-3.5 h-3.5',
            md: 'w-4 h-4',
            lg: 'w-5 h-5',
        }

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setInternalValue(e.target.value)
            onChange?.(e)
        }

        const handleClear = () => {
            setInternalValue('')
            onClear?.()
        }

        return (
            <div className={cn('relative', fullWidth && 'w-full')}>
                <Search
                    className={cn(
                        'absolute left-3 top-1/2 -translate-y-1/2 text-gray-400',
                        iconSizeClasses[size]
                    )}
                />
                <input
                    ref={ref}
                    type="search"
                    value={displayValue}
                    onChange={handleChange}
                    className={cn(
                        'w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800',
                        'transition-all duration-200',
                        'focus:outline-none focus:ring-2 focus:border-primary focus:ring-primary/20',
                        'placeholder:text-gray-400 dark:placeholder:text-gray-500',
                        '[&::-webkit-search-cancel-button]:hidden',
                        sizeClasses[size],
                        className
                    )}
                    {...props}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
                    {loading ? (
                        <Loader2
                            className={cn('animate-spin text-gray-400', iconSizeClasses[size])}
                        />
                    ) : displayValue ? (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                            <X className={iconSizeClasses[size]} />
                        </button>
                    ) : null}
                </div>
            </div>
        )
    }
)

SearchInput.displayName = 'SearchInput'

export default SearchInput
