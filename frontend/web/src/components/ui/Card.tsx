import React, { forwardRef } from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import { cn } from '@/utils/cn'

export interface CardProps extends HTMLMotionProps<'div'> {
  variant?: 'default' | 'elevated' | 'interactive' | 'compact'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  bordered?: boolean
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'default',
      padding = 'md',
      bordered = true,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const variantClasses = {
      default: '',
      elevated: 'shadow-lg hover:shadow-xl',
      interactive:
        'cursor-pointer hover:border-primary/50 hover:shadow-lg hover:-translate-y-1',
      compact: '',
    }

    const paddingClasses = {
      none: '',
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6',
    }

    return (
      <motion.div
        ref={ref}
        initial={variant === 'interactive' ? { y: 0 } : undefined}
        whileHover={variant === 'interactive' ? { y: -4 } : undefined}
        transition={{ duration: 0.2 }}
        className={cn(
          'rounded-xl bg-white dark:bg-gray-800 transition-all duration-200',
          bordered && 'border border-gray-200 dark:border-gray-700',
          variantClasses[variant],
          paddingClasses[padding],
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)

Card.displayName = 'Card'

// Card Header
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  subtitle?: string
  action?: React.ReactNode
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ title, subtitle, action, className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex items-start justify-between pb-4 border-b border-gray-100 dark:border-gray-700',
        className
      )}
      {...props}
    >
      {children || (
        <>
          <div>
            {title && (
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {subtitle}
              </p>
            )}
          </div>
          {action && <div>{action}</div>}
        </>
      )}
    </div>
  )
)

CardHeader.displayName = 'CardHeader'

// Card Body
export interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> { }

export const CardBody = forwardRef<HTMLDivElement, CardBodyProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('py-4', className)} {...props}>
      {children}
    </div>
  )
)

CardBody.displayName = 'CardBody'

// Card Footer
export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  justify?: 'start' | 'center' | 'end' | 'between'
}

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ justify = 'end', className, children, ...props }, ref) => {
    const justifyClasses = {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between',
    }

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-gray-700',
          justifyClasses[justify],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

CardFooter.displayName = 'CardFooter'

// Card Image
export interface CardImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  aspectRatio?: 'square' | 'video' | 'wide' | 'auto'
}

export const CardImage = forwardRef<HTMLImageElement, CardImageProps>(
  ({ aspectRatio = 'video', className, alt = '', ...props }, ref) => {
    const aspectClasses = {
      square: 'aspect-square',
      video: 'aspect-video',
      wide: 'aspect-[21/9]',
      auto: '',
    }

    return (
      <div className={cn('overflow-hidden -m-4 mb-4', aspectClasses[aspectRatio])}>
        <img
          ref={ref}
          alt={alt}
          className={cn('w-full h-full object-cover', className)}
          {...props}
        />
      </div>
    )
  }
)

CardImage.displayName = 'CardImage'

export default Card