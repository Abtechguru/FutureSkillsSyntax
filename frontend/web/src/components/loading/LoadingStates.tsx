import React, { createContext, useContext, useState, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, CheckCircle, XCircle, AlertTriangle, RefreshCw } from 'lucide-react'
import { cn } from '@/utils/cn'
import Button from '@/components/ui/Button'

// Loading State Types
export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

interface LoadingContextType {
    state: LoadingState
    message?: string
    error?: string
    setState: (state: LoadingState, options?: { message?: string; error?: string }) => void
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

// Loading Provider
interface LoadingProviderProps {
    children: ReactNode
}

export const LoadingProvider: React.FC<LoadingProviderProps> = ({ children }) => {
    const [state, setStateInternal] = useState<LoadingState>('idle')
    const [message, setMessage] = useState<string>()
    const [error, setError] = useState<string>()

    const setState = (newState: LoadingState, options?: { message?: string; error?: string }) => {
        setStateInternal(newState)
        setMessage(options?.message)
        setError(options?.error)
    }

    return (
        <LoadingContext.Provider value={{ state, message, error, setState }}>
            {children}
        </LoadingContext.Provider>
    )
}

export const useLoading = () => {
    const context = useContext(LoadingContext)
    if (!context) {
        throw new Error('useLoading must be used within LoadingProvider')
    }
    return context
}

// Full Screen Loading Overlay
interface LoadingOverlayProps {
    state: LoadingState
    message?: string
    error?: string
    onRetry?: () => void
    onDismiss?: () => void
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
    state,
    message,
    error,
    onRetry,
    onDismiss,
}) => {
    if (state === 'idle') return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm"
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="flex flex-col items-center text-center p-8 max-w-md"
                >
                    {/* Loading State */}
                    {state === 'loading' && (
                        <>
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                className="mb-4"
                            >
                                <Loader2 className="w-12 h-12 text-primary" />
                            </motion.div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                {message || 'Loading...'}
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400">
                                Please wait while we process your request
                            </p>
                        </>
                    )}

                    {/* Success State */}
                    {state === 'success' && (
                        <>
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', stiffness: 200 }}
                                className="mb-4"
                            >
                                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                    <CheckCircle className="w-10 h-10 text-green-500" />
                                </div>
                            </motion.div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                {message || 'Success!'}
                            </h3>
                            {onDismiss && (
                                <Button variant="primary" onClick={onDismiss} className="mt-4">
                                    Continue
                                </Button>
                            )}
                        </>
                    )}

                    {/* Error State */}
                    {state === 'error' && (
                        <>
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', stiffness: 200 }}
                                className="mb-4"
                            >
                                <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                                    <XCircle className="w-10 h-10 text-red-500" />
                                </div>
                            </motion.div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                Something went wrong
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-4">
                                {error || 'An unexpected error occurred'}
                            </p>
                            <div className="flex gap-3">
                                {onDismiss && (
                                    <Button variant="outline" onClick={onDismiss}>
                                        Cancel
                                    </Button>
                                )}
                                {onRetry && (
                                    <Button variant="primary" onClick={onRetry} icon={<RefreshCw className="w-4 h-4" />}>
                                        Try Again
                                    </Button>
                                )}
                            </div>
                        </>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}

// Inline Loading Spinner
interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg'
    color?: string
    className?: string
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = 'md',
    color = 'text-primary',
    className,
}) => {
    const sizes = {
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-8 h-8',
    }

    return (
        <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className={cn(sizes[size], color, className)}
        >
            <Loader2 className="w-full h-full" />
        </motion.div>
    )
}

// Loading Button State
interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    isLoading?: boolean
    loadingText?: string
    variant?: 'primary' | 'secondary' | 'outline'
    children: ReactNode
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({
    isLoading = false,
    loadingText,
    variant = 'primary',
    children,
    disabled,
    className,
    ...props
}) => {
    const variants = {
        primary: 'bg-primary text-white hover:bg-primary-600 disabled:bg-primary/50',
        secondary: 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200',
        outline: 'border-2 border-primary text-primary hover:bg-primary/10',
    }

    return (
        <button
            {...props}
            disabled={disabled || isLoading}
            className={cn(
                'relative px-4 py-2 rounded-lg font-medium transition-all',
                'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
                'disabled:cursor-not-allowed',
                variants[variant],
                className
            )}
        >
            <span className={cn('flex items-center justify-center gap-2', isLoading && 'opacity-0')}>
                {children}
            </span>

            {isLoading && (
                <span className="absolute inset-0 flex items-center justify-center gap-2">
                    <LoadingSpinner size="sm" color="currentColor" />
                    {loadingText && <span>{loadingText}</span>}
                </span>
            )}
        </button>
    )
}

// Skeleton Screen
interface SkeletonScreenProps {
    layout: 'dashboard' | 'profile' | 'list' | 'detail'
}

export const SkeletonScreen: React.FC<SkeletonScreenProps> = ({ layout }) => {
    const shimmer = (
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
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
            }}
        />
    )

    const SkeletonBox: React.FC<{ className?: string }> = ({ className }) => (
        <div className={cn('relative overflow-hidden bg-gray-200 dark:bg-gray-700 rounded', className)}>
            {shimmer}
        </div>
    )

    if (layout === 'dashboard') {
        return (
            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <SkeletonBox className="h-8 w-48" />
                    <SkeletonBox className="h-10 w-10 rounded-full" />
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <SkeletonBox key={i} className="h-24 rounded-lg" />
                    ))}
                </div>

                {/* Content */}
                <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-2 space-y-4">
                        <SkeletonBox className="h-64 rounded-lg" />
                        <SkeletonBox className="h-48 rounded-lg" />
                    </div>
                    <div className="space-y-4">
                        <SkeletonBox className="h-48 rounded-lg" />
                        <SkeletonBox className="h-48 rounded-lg" />
                    </div>
                </div>
            </div>
        )
    }

    if (layout === 'profile') {
        return (
            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center gap-6">
                    <SkeletonBox className="w-24 h-24 rounded-full" />
                    <div className="space-y-2 flex-1">
                        <SkeletonBox className="h-8 w-48" />
                        <SkeletonBox className="h-4 w-32" />
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-4">
                    {[...Array(4)].map((_, i) => (
                        <SkeletonBox key={i} className="h-10 w-24 rounded-lg" />
                    ))}
                </div>

                {/* Content */}
                <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <SkeletonBox key={i} className="h-32 rounded-lg" />
                    ))}
                </div>
            </div>
        )
    }

    if (layout === 'list') {
        return (
            <div className="space-y-4 p-6">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <SkeletonBox className="w-12 h-12 rounded-full" />
                        <div className="flex-1 space-y-2">
                            <SkeletonBox className="h-5 w-3/4" />
                            <SkeletonBox className="h-4 w-1/2" />
                        </div>
                        <SkeletonBox className="h-8 w-20 rounded" />
                    </div>
                ))}
            </div>
        )
    }

    if (layout === 'detail') {
        return (
            <div className="space-y-6 p-6">
                <SkeletonBox className="h-64 rounded-lg" />
                <div className="space-y-4">
                    <SkeletonBox className="h-8 w-2/3" />
                    <SkeletonBox className="h-4 w-full" />
                    <SkeletonBox className="h-4 w-full" />
                    <SkeletonBox className="h-4 w-3/4" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <SkeletonBox className="h-32 rounded-lg" />
                    <SkeletonBox className="h-32 rounded-lg" />
                </div>
            </div>
        )
    }

    return null
}

export default LoadingOverlay
