import React, { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, X, AlertCircle, Eye, EyeOff } from 'lucide-react'
import { cn } from '@/utils/cn'

// Validation Rules
export type ValidationRule = {
    test: (value: string) => boolean
    message: string
}

export const validationRules = {
    required: (message = 'This field is required'): ValidationRule => ({
        test: (value) => value.trim().length > 0,
        message,
    }),
    email: (message = 'Please enter a valid email'): ValidationRule => ({
        test: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        message,
    }),
    minLength: (length: number, message?: string): ValidationRule => ({
        test: (value) => value.length >= length,
        message: message || `Must be at least ${length} characters`,
    }),
    maxLength: (length: number, message?: string): ValidationRule => ({
        test: (value) => value.length <= length,
        message: message || `Must be no more than ${length} characters`,
    }),
    pattern: (regex: RegExp, message: string): ValidationRule => ({
        test: (value) => regex.test(value),
        message,
    }),
    password: (message = 'Password must be at least 8 characters with uppercase, lowercase, and number'): ValidationRule => ({
        test: (value) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(value),
        message,
    }),
    match: (otherValue: string, message = 'Fields do not match'): ValidationRule => ({
        test: (value) => value === otherValue,
        message,
    }),
}

// Validated Input Component
interface ValidatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string
    rules?: ValidationRule[]
    validateOnBlur?: boolean
    validateOnChange?: boolean
    showStrength?: boolean
    helperText?: string
    error?: string
    onValidationChange?: (isValid: boolean, errors: string[]) => void
}

export const ValidatedInput: React.FC<ValidatedInputProps> = ({
    label,
    rules = [],
    validateOnBlur = true,
    validateOnChange = false,
    showStrength = false,
    helperText,
    error: externalError,
    onValidationChange,
    type = 'text',
    className,
    ...props
}) => {
    const [value, setValue] = useState((props.value as string) || '')
    const [errors, setErrors] = useState<string[]>([])
    const [touched, setTouched] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [isFocused, setIsFocused] = useState(false)

    const validate = useCallback((val: string): string[] => {
        return rules
            .filter(rule => !rule.test(val))
            .map(rule => rule.message)
    }, [rules])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value
        setValue(newValue)
        props.onChange?.(e)

        if (validateOnChange && touched) {
            const newErrors = validate(newValue)
            setErrors(newErrors)
            onValidationChange?.(newErrors.length === 0, newErrors)
        }
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        setTouched(true)
        setIsFocused(false)
        props.onBlur?.(e)

        if (validateOnBlur) {
            const newErrors = validate(value)
            setErrors(newErrors)
            onValidationChange?.(newErrors.length === 0, newErrors)
        }
    }

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(true)
        props.onFocus?.(e)
    }

    // Password strength calculation
    const getPasswordStrength = (): { score: number; label: string; color: string } => {
        if (!value) return { score: 0, label: '', color: '' }

        let score = 0
        if (value.length >= 8) score++
        if (value.length >= 12) score++
        if (/[a-z]/.test(value)) score++
        if (/[A-Z]/.test(value)) score++
        if (/\d/.test(value)) score++
        if (/[^a-zA-Z0-9]/.test(value)) score++

        if (score <= 2) return { score, label: 'Weak', color: 'bg-red-500' }
        if (score <= 4) return { score, label: 'Medium', color: 'bg-yellow-500' }
        return { score, label: 'Strong', color: 'bg-green-500' }
    }

    const displayErrors = externalError ? [externalError] : errors
    const hasError = displayErrors.length > 0 && touched
    const isValid = touched && displayErrors.length === 0 && value.length > 0
    const passwordStrength = showStrength ? getPasswordStrength() : null
    const inputType = type === 'password' && showPassword ? 'text' : type

    return (
        <div className={cn('space-y-1', className)}>
            {/* Label */}
            {label && (
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {label}
                    {rules.some(r => r.message.includes('required')) && (
                        <span className="text-red-500 ml-1">*</span>
                    )}
                </label>
            )}

            {/* Input Container */}
            <div className="relative">
                <input
                    {...props}
                    type={inputType}
                    value={value}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onFocus={handleFocus}
                    className={cn(
                        'w-full px-4 py-2.5 rounded-lg border transition-all duration-200',
                        'focus:outline-none focus:ring-2 focus:ring-offset-0',
                        'bg-white dark:bg-gray-800',
                        hasError
                            ? 'border-red-500 focus:ring-red-500/30'
                            : isValid
                                ? 'border-green-500 focus:ring-green-500/30'
                                : isFocused
                                    ? 'border-primary focus:ring-primary/30'
                                    : 'border-gray-300 dark:border-gray-600',
                        type === 'password' && 'pr-20'
                    )}
                    aria-invalid={hasError}
                    aria-describedby={hasError ? `${props.id}-error` : undefined}
                />

                {/* Right side icons */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    {/* Validation status icon */}
                    <AnimatePresence mode="wait">
                        {isValid && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                            >
                                <Check className="w-5 h-5 text-green-500" />
                            </motion.div>
                        )}
                        {hasError && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                            >
                                <AlertCircle className="w-5 h-5 text-red-500" />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Password toggle */}
                    {type === 'password' && (
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    )}
                </div>
            </div>

            {/* Password Strength Meter */}
            {showStrength && type === 'password' && value && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                >
                    <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <motion.div
                                className={cn('h-full rounded-full', passwordStrength?.color)}
                                initial={{ width: 0 }}
                                animate={{ width: `${(passwordStrength?.score || 0) / 6 * 100}%` }}
                                transition={{ duration: 0.3 }}
                            />
                        </div>
                        <span className={cn(
                            'text-xs font-medium',
                            passwordStrength?.score && passwordStrength.score <= 2 && 'text-red-500',
                            passwordStrength?.score && passwordStrength.score <= 4 && passwordStrength.score > 2 && 'text-yellow-500',
                            passwordStrength?.score && passwordStrength.score > 4 && 'text-green-500',
                        )}>
                            {passwordStrength?.label}
                        </span>
                    </div>
                </motion.div>
            )}

            {/* Error Messages */}
            <AnimatePresence>
                {hasError && (
                    <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        id={`${props.id}-error`}
                        role="alert"
                        className="text-sm text-red-500"
                    >
                        {displayErrors[0]}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Helper Text */}
            {!hasError && helperText && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    {helperText}
                </p>
            )}
        </div>
    )
}

// Form Validation Hook
interface FormField {
    value: string
    rules: ValidationRule[]
}

interface FormState {
    [key: string]: {
        value: string
        errors: string[]
        touched: boolean
    }
}

export const useFormValidation = (fields: Record<string, FormField>) => {
    const [formState, setFormState] = useState<FormState>(() => {
        const initial: FormState = {}
        Object.keys(fields).forEach(key => {
            initial[key] = {
                value: fields[key].value,
                errors: [],
                touched: false,
            }
        })
        return initial
    })

    const setValue = useCallback((name: string, value: string) => {
        setFormState(prev => ({
            ...prev,
            [name]: { ...prev[name], value },
        }))
    }, [])

    const setTouched = useCallback((name: string) => {
        setFormState(prev => ({
            ...prev,
            [name]: { ...prev[name], touched: true },
        }))
    }, [])

    const validateField = useCallback((name: string): boolean => {
        const field = fields[name]
        const value = formState[name].value
        const errors = field.rules
            .filter(rule => !rule.test(value))
            .map(rule => rule.message)

        setFormState(prev => ({
            ...prev,
            [name]: { ...prev[name], errors, touched: true },
        }))

        return errors.length === 0
    }, [fields, formState])

    const validateAll = useCallback((): boolean => {
        let isValid = true
        const newState = { ...formState }

        Object.keys(fields).forEach(name => {
            const errors = fields[name].rules
                .filter(rule => !rule.test(formState[name].value))
                .map(rule => rule.message)

            newState[name] = { ...newState[name], errors, touched: true }
            if (errors.length > 0) isValid = false
        })

        setFormState(newState)
        return isValid
    }, [fields, formState])

    const reset = useCallback(() => {
        const initial: FormState = {}
        Object.keys(fields).forEach(key => {
            initial[key] = {
                value: fields[key].value,
                errors: [],
                touched: false,
            }
        })
        setFormState(initial)
    }, [fields])

    const isValid = Object.values(formState).every(
        field => field.errors.length === 0 && field.touched
    )

    return {
        formState,
        setValue,
        setTouched,
        validateField,
        validateAll,
        reset,
        isValid,
    }
}

export default ValidatedInput
