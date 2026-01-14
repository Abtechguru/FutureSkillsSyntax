import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/utils/cn'
import { createPortal } from 'react-dom'

export interface TooltipProps {
    content: React.ReactNode
    position?: 'top' | 'bottom' | 'left' | 'right'
    delay?: number
    children: React.ReactNode
    className?: string
}

const Tooltip: React.FC<TooltipProps> = ({
    content,
    position = 'top',
    delay = 200,
    children,
    className,
}) => {
    const [isVisible, setIsVisible] = useState(false)
    const [coords, setCoords] = useState({ x: 0, y: 0 })
    const triggerRef = useRef<HTMLDivElement>(null)
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)

    const positionClasses = {
        top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
        bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
        left: 'right-full top-1/2 -translate-y-1/2 mr-2',
        right: 'left-full top-1/2 -translate-y-1/2 ml-2',
    }

    const arrowClasses = {
        top: 'bottom-[-4px] left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent',
        bottom: 'top-[-4px] left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent',
        left: 'right-[-4px] top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent',
        right: 'left-[-4px] top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent',
    }

    const animations = {
        top: { initial: { opacity: 0, y: 5 }, animate: { opacity: 1, y: 0 } },
        bottom: { initial: { opacity: 0, y: -5 }, animate: { opacity: 1, y: 0 } },
        left: { initial: { opacity: 0, x: 5 }, animate: { opacity: 1, x: 0 } },
        right: { initial: { opacity: 0, x: -5 }, animate: { opacity: 1, x: 0 } },
    }

    const handleMouseEnter = () => {
        timeoutRef.current = setTimeout(() => {
            setIsVisible(true)
        }, delay)
    }

    const handleMouseLeave = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }
        setIsVisible(false)
    }

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
        }
    }, [])

    return (
        <div
            ref={triggerRef}
            className="relative inline-block"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {children}
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={animations[position].initial}
                        animate={animations[position].animate}
                        exit={animations[position].initial}
                        transition={{ duration: 0.15 }}
                        className={cn(
                            'absolute z-50 px-3 py-1.5 text-xs font-medium text-white bg-gray-900 dark:bg-gray-700 rounded-lg whitespace-nowrap',
                            positionClasses[position],
                            className
                        )}
                    >
                        {content}
                        {/* Arrow */}
                        <div
                            className={cn(
                                'absolute w-0 h-0 border-4 border-gray-900 dark:border-gray-700',
                                arrowClasses[position]
                            )}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default Tooltip
