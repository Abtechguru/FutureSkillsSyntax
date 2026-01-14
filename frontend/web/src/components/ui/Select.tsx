import React, { forwardRef, useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/utils/cn'
import { ChevronDown, Check, X } from 'lucide-react'

export interface SelectOption {
    value: string
    label: string
    disabled?: boolean
}

export interface SelectProps {
    options: SelectOption[]
    value?: string | string[]
    onChange?: (value: string | string[]) => void
    placeholder?: string
    label?: string
    helperText?: string
    error?: string
    disabled?: boolean
    multiple?: boolean
    searchable?: boolean
    clearable?: boolean
    size?: 'sm' | 'md' | 'lg'
    fullWidth?: boolean
    className?: string
}

const Select = forwardRef<HTMLDivElement, SelectProps>(
    (
        {
            options,
            value,
            onChange,
            placeholder = 'Select an option',
            label,
            helperText,
            error,
            disabled = false,
            multiple = false,
            searchable = false,
            clearable = false,
            size = 'md',
            fullWidth = false,
            className,
        },
        ref
    ) => {
        const [isOpen, setIsOpen] = useState(false)
        const [searchQuery, setSearchQuery] = useState('')
        const containerRef = useRef<HTMLDivElement>(null)
        const inputRef = useRef<HTMLInputElement>(null)

        const sizeClasses = {
            sm: 'h-8 px-3 text-xs',
            md: 'h-10 px-4 text-sm',
            lg: 'h-12 px-4 text-base',
        }

        const selectedValues = Array.isArray(value) ? value : value ? [value] : []
        const selectedOptions = options.filter((opt) =>
            selectedValues.includes(opt.value)
        )

        const filteredOptions = searchable
            ? options.filter((opt) =>
                opt.label.toLowerCase().includes(searchQuery.toLowerCase())
            )
            : options

        useEffect(() => {
            const handleClickOutside = (event: MouseEvent) => {
                if (
                    containerRef.current &&
                    !containerRef.current.contains(event.target as Node)
                ) {
                    setIsOpen(false)
                    setSearchQuery('')
                }
            }

            document.addEventListener('mousedown', handleClickOutside)
            return () => document.removeEventListener('mousedown', handleClickOutside)
        }, [])

        const handleSelect = (option: SelectOption) => {
            if (option.disabled) return

            if (multiple) {
                const newValue = selectedValues.includes(option.value)
                    ? selectedValues.filter((v) => v !== option.value)
                    : [...selectedValues, option.value]
                onChange?.(newValue)
            } else {
                onChange?.(option.value)
                setIsOpen(false)
            }
            setSearchQuery('')
        }

        const handleClear = (e: React.MouseEvent) => {
            e.stopPropagation()
            onChange?.(multiple ? [] : '')
        }

        const displayValue = multiple
            ? selectedOptions.map((opt) => opt.label).join(', ')
            : selectedOptions[0]?.label || ''

        return (
            <div
                ref={ref}
                className={cn('flex flex-col gap-1', fullWidth && 'w-full')}
            >
                {label && (
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {label}
                    </label>
                )}
                <div ref={containerRef} className="relative">
                    <button
                        type="button"
                        disabled={disabled}
                        onClick={() => !disabled && setIsOpen(!isOpen)}
                        className={cn(
                            'w-full flex items-center justify-between rounded-lg border bg-white dark:bg-gray-800 transition-all duration-200',
                            'focus:outline-none focus:ring-2',
                            'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-100 dark:disabled:bg-gray-900',
                            error
                                ? 'border-error focus:border-error focus:ring-error/20'
                                : 'border-gray-300 dark:border-gray-600 focus:border-primary focus:ring-primary/20',
                            sizeClasses[size],
                            className
                        )}
                    >
                        <span
                            className={cn(
                                'truncate',
                                !displayValue && 'text-gray-400 dark:text-gray-500'
                            )}
                        >
                            {displayValue || placeholder}
                        </span>
                        <div className="flex items-center gap-1">
                            {clearable && selectedValues.length > 0 && (
                                <X
                                    className="w-4 h-4 text-gray-400 hover:text-gray-600"
                                    onClick={handleClear}
                                />
                            )}
                            <ChevronDown
                                className={cn(
                                    'w-4 h-4 text-gray-400 transition-transform duration-200',
                                    isOpen && 'rotate-180'
                                )}
                            />
                        </div>
                    </button>

                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.15 }}
                                className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden"
                            >
                                {searchable && (
                                    <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                                        <input
                                            ref={inputRef}
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Search..."
                                            className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-900 rounded border-0 focus:outline-none focus:ring-0"
                                            autoFocus
                                        />
                                    </div>
                                )}
                                <ul className="max-h-60 overflow-auto py-1">
                                    {filteredOptions.length === 0 ? (
                                        <li className="px-4 py-2 text-sm text-gray-500">
                                            No options found
                                        </li>
                                    ) : (
                                        filteredOptions.map((option) => (
                                            <li
                                                key={option.value}
                                                onClick={() => handleSelect(option)}
                                                className={cn(
                                                    'px-4 py-2 text-sm cursor-pointer flex items-center justify-between',
                                                    'hover:bg-gray-100 dark:hover:bg-gray-700',
                                                    option.disabled &&
                                                    'opacity-50 cursor-not-allowed hover:bg-transparent',
                                                    selectedValues.includes(option.value) &&
                                                    'bg-primary/10 text-primary'
                                                )}
                                            >
                                                {option.label}
                                                {selectedValues.includes(option.value) && (
                                                    <Check className="w-4 h-4" />
                                                )}
                                            </li>
                                        ))
                                    )}
                                </ul>
                            </motion.div>
                        )}
                    </AnimatePresence>
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

Select.displayName = 'Select'

export default Select
