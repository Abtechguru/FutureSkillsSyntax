import React, { forwardRef } from 'react'
import { motion, type MotionProps } from 'framer-motion'
import { cn } from '@/utils/cn'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof MotionProps>, MotionProps {
  variant?: 'default' | 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'danger'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  loading?: boolean
  fullWidth?: boolean
  rounded?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  pulse?: boolean
  as?: React.ElementType
  to?: string
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'default',
      size = 'md',
      loading = false,
      fullWidth = false,
      rounded = false,
      icon,
      iconPosition = 'left',
      pulse = false,
      className,
      disabled,
      as: Component = 'button',
      ...props
    },
    ref
  ) => {
    const baseClasses = cn(
      'inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
      {
        'w-full': fullWidth,
        'rounded-full': rounded,
        'rounded-lg': !rounded,
        'animate-pulse': pulse && !loading,
      },
      className
    )

    const variantClasses = {
      default: 'bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700',
      primary: 'bg-primary text-white hover:bg-primary/90 shadow-lg hover:shadow-xl',
      secondary: 'bg-secondary text-white hover:bg-secondary/90',
      outline: 'border-2 border-primary text-primary hover:bg-primary/10',
      ghost: 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800',
      link: 'text-primary underline-offset-4 hover:underline',
      danger: 'bg-error text-white hover:bg-error/90 shadow-lg hover:shadow-xl',
    }

    const sizeClasses = {
      sm: 'h-8 px-3 text-xs',
      md: 'h-10 px-4 text-sm',
      lg: 'h-12 px-6 text-base',
      xl: 'h-14 px-8 text-lg',
    }

    const iconSizeClasses = {
      sm: 'w-3 h-3',
      md: 'w-4 h-4',
      lg: 'w-5 h-5',
      xl: 'w-6 h-6',
    }

    const MotionComponent = motion(Component as any) as any

    return (
      <MotionComponent
        ref={ref}
        className={cn(baseClasses, variantClasses[variant], sizeClasses[size])}
        disabled={disabled || loading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        {...props}
      >
        {loading ? (
          <Loader2 className={cn('animate-spin', iconSizeClasses[size])} />
        ) : (
          <>
            {icon && iconPosition === 'left' && (
              <span className="mr-2">{icon}</span>
            )}
            {children}
            {icon && iconPosition === 'right' && (
              <span className="ml-2">{icon}</span>
            )}
          </>
        )}
      </MotionComponent>
    )
  }
)

Button.displayName = 'Button'

export default Button