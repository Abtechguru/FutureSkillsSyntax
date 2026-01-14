import React, { forwardRef, ButtonHTMLAttributes, ReactNode } from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { cn } from '@/utils/cn'
import { useReducedMotion } from '@/hooks/useReducedMotion'

// Touch target minimum size (44px for mobile accessibility)
const TOUCH_TARGET_MIN = 44

interface AccessibleButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
    children: ReactNode
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
    size?: 'sm' | 'md' | 'lg'
    icon?: ReactNode
    iconPosition?: 'left' | 'right'
    loading?: boolean
    loadingText?: string
    fullWidth?: boolean
    className?: string
    // Accessibility props
    ariaLabel?: string
    ariaDescribedBy?: string
    ariaExpanded?: boolean
    ariaPressed?: boolean
    ariaHaspopup?: boolean | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog'
}

/**
 * Accessible Button Component
 * - Minimum 44px touch target
 * - Focus visible styling
 * - Reduced motion support
 * - Loading states with announcements
 * - Full ARIA support
 */
const AccessibleButton = forwardRef<HTMLButtonElement, AccessibleButtonProps>(
    (
        {
            children,
            variant = 'primary',
            size = 'md',
            icon,
            iconPosition = 'left',
            loading = false,
            loadingText,
            fullWidth = false,
            className,
            disabled,
            ariaLabel,
            ariaDescribedBy,
            ariaExpanded,
            ariaPressed,
            ariaHaspopup,
            type = 'button',
            ...props
        },
        ref
    ) => {
        const prefersReducedMotion = useReducedMotion()

        const variants = {
            primary: cn(
                'bg-primary text-white',
                'hover:bg-primary-600 active:bg-primary-700',
                'focus-visible:ring-primary/50',
                'disabled:bg-primary/50'
            ),
            secondary: cn(
                'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white',
                'hover:bg-gray-200 dark:hover:bg-gray-700',
                'focus-visible:ring-gray-500/50',
                'disabled:bg-gray-100/50 dark:disabled:bg-gray-800/50'
            ),
            outline: cn(
                'border-2 border-primary text-primary',
                'hover:bg-primary/10',
                'focus-visible:ring-primary/50',
                'disabled:border-primary/50 disabled:text-primary/50'
            ),
            ghost: cn(
                'text-gray-600 dark:text-gray-400',
                'hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white',
                'focus-visible:ring-gray-500/50'
            ),
            danger: cn(
                'bg-red-500 text-white',
                'hover:bg-red-600 active:bg-red-700',
                'focus-visible:ring-red-500/50',
                'disabled:bg-red-500/50'
            ),
        }

        const sizes = {
            sm: cn('px-3 py-1.5 text-sm', `min-h-[${TOUCH_TARGET_MIN}px] min-w-[${TOUCH_TARGET_MIN}px]`),
            md: cn('px-4 py-2', `min-h-[${TOUCH_TARGET_MIN}px] min-w-[${TOUCH_TARGET_MIN}px]`),
            lg: cn('px-6 py-3 text-lg', 'min-h-[52px] min-w-[52px]'),
        }

        const motionProps: HTMLMotionProps<'button'> = prefersReducedMotion
            ? {}
            : {
                whileHover: { scale: 1.02 },
                whileTap: { scale: 0.98 },
                transition: { type: 'spring', stiffness: 400, damping: 20 },
            }

        return (
            <motion.button
                ref={ref}
                type={type}
                disabled={disabled || loading}
                aria-label={ariaLabel}
                aria-describedby={ariaDescribedBy}
                aria-expanded={ariaExpanded}
                aria-pressed={ariaPressed}
                aria-haspopup={ariaHaspopup}
                aria-busy={loading}
                aria-disabled={disabled || loading}
                className={cn(
                    // Base styles
                    'relative inline-flex items-center justify-center gap-2',
                    'font-medium rounded-lg',
                    'transition-colors duration-150',
                    // Focus styles (visible only with keyboard)
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                    // Disabled styles
                    'disabled:cursor-not-allowed disabled:opacity-60',
                    // Size & variant
                    sizes[size],
                    variants[variant],
                    // Full width
                    fullWidth && 'w-full',
                    className
                )}
                {...motionProps}
                {...props}
            >
                {/* Loading spinner */}
                {loading && (
                    <span className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        {loadingText && <span className="sr-only">{loadingText}</span>}
                    </span>
                )}

                {/* Content */}
                <span className={cn('flex items-center justify-center gap-2', loading && 'invisible')}>
                    {icon && iconPosition === 'left' && <span aria-hidden="true">{icon}</span>}
                    {children}
                    {icon && iconPosition === 'right' && <span aria-hidden="true">{icon}</span>}
                </span>

                {/* Screen reader loading announcement */}
                {loading && (
                    <span role="status" aria-live="polite" className="sr-only">
                        {loadingText || 'Loading...'}
                    </span>
                )}
            </motion.button>
        )
    }
)

AccessibleButton.displayName = 'AccessibleButton'

/**
 * Icon Button - Square button with icon only
 */
interface IconButtonProps extends Omit<AccessibleButtonProps, 'children' | 'icon'> {
    icon: ReactNode
    label: string // Required for accessibility
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
    ({ icon, label, ...props }, ref) => (
        <AccessibleButton
            ref={ref}
            ariaLabel={label}
            className={cn('!p-2', props.className)}
            {...props}
        >
            <span aria-hidden="true">{icon}</span>
            <span className="sr-only">{label}</span>
        </AccessibleButton>
    )
)

IconButton.displayName = 'IconButton'

/**
 * Button Group - For related buttons
 */
interface ButtonGroupProps {
    children: ReactNode
    orientation?: 'horizontal' | 'vertical'
    className?: string
    ariaLabel?: string
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({
    children,
    orientation = 'horizontal',
    className,
    ariaLabel,
}) => {
    return (
        <div
            role="group"
            aria-label={ariaLabel}
            className={cn(
                'flex',
                orientation === 'horizontal' ? 'flex-row' : 'flex-col',
                '[&>button:not(:first-child):not(:last-child)]:rounded-none',
                orientation === 'horizontal' && [
                    '[&>button:first-child]:rounded-r-none',
                    '[&>button:last-child]:rounded-l-none',
                    '[&>button:not(:first-child)]:-ml-px',
                ],
                orientation === 'vertical' && [
                    '[&>button:first-child]:rounded-b-none',
                    '[&>button:last-child]:rounded-t-none',
                    '[&>button:not(:first-child)]:-mt-px',
                ],
                className
            )}
        >
            {children}
        </div>
    )
}

export default AccessibleButton
