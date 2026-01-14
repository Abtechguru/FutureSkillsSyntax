import React, { useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/utils/cn'
import { X } from 'lucide-react'
import { createPortal } from 'react-dom'

export interface ModalProps {
    isOpen: boolean
    onClose: () => void
    title?: string
    description?: string
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
    closeOnBackdrop?: boolean
    closeOnEscape?: boolean
    showCloseButton?: boolean
    children: React.ReactNode
    footer?: React.ReactNode
    className?: string
}

const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    description,
    size = 'md',
    closeOnBackdrop = true,
    closeOnEscape = true,
    showCloseButton = true,
    children,
    footer,
    className,
}) => {
    const sizeClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        full: 'max-w-[90vw] max-h-[90vh]',
    }

    const handleEscape = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === 'Escape' && closeOnEscape) {
                onClose()
            }
        },
        [closeOnEscape, onClose]
    )

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleEscape)
            document.body.style.overflow = 'hidden'
        }

        return () => {
            document.removeEventListener('keydown', handleEscape)
            document.body.style.overflow = 'unset'
        }
    }, [isOpen, handleEscape])

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget && closeOnBackdrop) {
            onClose()
        }
    }

    const modalContent = (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={handleBackdropClick}
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.2 }}
                        className={cn(
                            'relative w-full bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden',
                            sizeClasses[size],
                            className
                        )}
                    >
                        {/* Header */}
                        {(title || showCloseButton) && (
                            <div className="flex items-start justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                                <div>
                                    {title && (
                                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                            {title}
                                        </h2>
                                    )}
                                    {description && (
                                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                            {description}
                                        </p>
                                    )}
                                </div>
                                {showCloseButton && (
                                    <button
                                        onClick={onClose}
                                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Body */}
                        <div className="p-6 max-h-[60vh] overflow-y-auto">{children}</div>

                        {/* Footer */}
                        {footer && (
                            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                                {footer}
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )

    if (typeof document !== 'undefined') {
        return createPortal(modalContent, document.body)
    }

    return null
}

export default Modal
