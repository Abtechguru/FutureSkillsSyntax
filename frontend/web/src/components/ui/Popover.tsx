import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/utils/cn'

export interface PopoverProps {
    trigger: React.ReactNode
    content: React.ReactNode
    position?: 'top' | 'bottom' | 'left' | 'right'
    align?: 'start' | 'center' | 'end'
    open?: boolean
    onOpenChange?: (open: boolean) => void
    triggerOn?: 'click' | 'hover'
    className?: string
}

const Popover: React.FC<PopoverProps> = ({
    trigger,
    content,
    position = 'bottom',
    align = 'center',
    open: controlledOpen,
    onOpenChange,
    triggerOn = 'click',
    className,
}) => {
    const [internalOpen, setInternalOpen] = useState(false)
    const isOpen = controlledOpen ?? internalOpen
    const setIsOpen = onOpenChange ?? setInternalOpen
    const containerRef = useRef<HTMLDivElement>(null)

    const positionClasses = {
        top: 'bottom-full mb-2',
        bottom: 'top-full mt-2',
        left: 'right-full mr-2',
        right: 'left-full ml-2',
    }

    const alignClasses = {
        start: position === 'top' || position === 'bottom' ? 'left-0' : 'top-0',
        center:
            position === 'top' || position === 'bottom'
                ? 'left-1/2 -translate-x-1/2'
                : 'top-1/2 -translate-y-1/2',
        end: position === 'top' || position === 'bottom' ? 'right-0' : 'bottom-0',
    }

    const animations = {
        top: { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 } },
        bottom: { initial: { opacity: 0, y: -10 }, animate: { opacity: 1, y: 0 } },
        left: { initial: { opacity: 0, x: 10 }, animate: { opacity: 1, x: 0 } },
        right: { initial: { opacity: 0, x: -10 }, animate: { opacity: 1, x: 0 } },
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false)
            }
        }

        if (isOpen && triggerOn === 'click') {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isOpen, setIsOpen, triggerOn])

    const handleTrigger = () => {
        if (triggerOn === 'click') {
            setIsOpen(!isOpen)
        }
    }

    const handleMouseEnter = () => {
        if (triggerOn === 'hover') {
            setIsOpen(true)
        }
    }

    const handleMouseLeave = () => {
        if (triggerOn === 'hover') {
            setIsOpen(false)
        }
    }

    return (
        <div
            ref={containerRef}
            className="relative inline-block"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div onClick={handleTrigger}>{trigger}</div>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={animations[position].initial}
                        animate={animations[position].animate}
                        exit={animations[position].initial}
                        transition={{ duration: 0.2 }}
                        className={cn(
                            'absolute z-50 min-w-[200px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden',
                            positionClasses[position],
                            alignClasses[align],
                            className
                        )}
                    >
                        {content}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

// Popover subcomponents for structured content
export const PopoverHeader: React.FC<{
    children: React.ReactNode
    className?: string
}> = ({ children, className }) => (
    <div
        className={cn(
            'px-4 py-3 border-b border-gray-200 dark:border-gray-700',
            className
        )}
    >
        {children}
    </div>
)

export const PopoverBody: React.FC<{
    children: React.ReactNode
    className?: string
}> = ({ children, className }) => (
    <div className={cn('px-4 py-3', className)}>{children}</div>
)

export const PopoverFooter: React.FC<{
    children: React.ReactNode
    className?: string
}> = ({ children, className }) => (
    <div
        className={cn(
            'px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900',
            className
        )}
    >
        {children}
    </div>
)

export default Popover
