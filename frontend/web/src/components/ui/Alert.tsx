import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react'

export interface AlertProps {
    variant?: 'success' | 'error' | 'warning' | 'info'
    title?: string
    children: React.ReactNode
    dismissible?: boolean
    onDismiss?: () => void
    icon?: React.ReactNode
    className?: string
}

const Alert: React.FC<AlertProps> = ({
    variant = 'info',
    title,
    children,
    dismissible = false,
    onDismiss,
    icon,
    className,
}) => {
    const variantStyles = {
        success: {
            container: 'bg-success/10 border-success/20 text-success-700 dark:text-success-400',
            icon: <CheckCircle className="w-5 h-5" />,
        },
        error: {
            container: 'bg-error/10 border-error/20 text-error-700 dark:text-error-400',
            icon: <XCircle className="w-5 h-5" />,
        },
        warning: {
            container: 'bg-warning/10 border-warning/20 text-warning-700 dark:text-warning-600',
            icon: <AlertTriangle className="w-5 h-5" />,
        },
        info: {
            container: 'bg-info/10 border-info/20 text-info-700 dark:text-info-400',
            icon: <Info className="w-5 h-5" />,
        },
    }

    const styles = variantStyles[variant]

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            role="alert"
            className={cn(
                'flex gap-3 p-4 rounded-lg border',
                styles.container,
                className
            )}
        >
            <div className="flex-shrink-0">{icon || styles.icon}</div>
            <div className="flex-1 min-w-0">
                {title && (
                    <h3 className="font-semibold text-sm mb-1">{title}</h3>
                )}
                <div className="text-sm opacity-90">{children}</div>
            </div>
            {dismissible && (
                <button
                    onClick={onDismiss}
                    className="flex-shrink-0 p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            )}
        </motion.div>
    )
}

export default Alert
