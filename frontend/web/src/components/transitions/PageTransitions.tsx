import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, Variants } from 'framer-motion'
import { cn } from '@/utils/cn'

// Transition Types
export type TransitionType = 'fade' | 'slide-left' | 'slide-right' | 'slide-up' | 'slide-down' | 'push' | 'pop' | 'zoom'

const transitionVariants: Record<TransitionType, Variants> = {
    fade: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
    },
    'slide-left': {
        initial: { x: '100%', opacity: 0 },
        animate: { x: 0, opacity: 1 },
        exit: { x: '-100%', opacity: 0 },
    },
    'slide-right': {
        initial: { x: '-100%', opacity: 0 },
        animate: { x: 0, opacity: 1 },
        exit: { x: '100%', opacity: 0 },
    },
    'slide-up': {
        initial: { y: '100%', opacity: 0 },
        animate: { y: 0, opacity: 1 },
        exit: { y: '-50%', opacity: 0 },
    },
    'slide-down': {
        initial: { y: '-100%', opacity: 0 },
        animate: { y: 0, opacity: 1 },
        exit: { y: '100%', opacity: 0 },
    },
    push: {
        initial: { x: '100%', scale: 0.95 },
        animate: { x: 0, scale: 1 },
        exit: { x: '-30%', scale: 0.95, opacity: 0 },
    },
    pop: {
        initial: { x: '-100%', scale: 0.95 },
        animate: { x: 0, scale: 1 },
        exit: { x: '30%', scale: 0.95, opacity: 0 },
    },
    zoom: {
        initial: { scale: 0.8, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        exit: { scale: 1.1, opacity: 0 },
    },
}

// Reduced Motion Variants (for accessibility)
const reducedMotionVariants: Variants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
}

// Context for page transitions
interface TransitionContextType {
    transition: TransitionType
    setTransition: (type: TransitionType) => void
    navigateWithTransition: (path: string, transition?: TransitionType) => void
    prefersReducedMotion: boolean
}

const TransitionContext = createContext<TransitionContextType | undefined>(undefined)

interface TransitionProviderProps {
    children: ReactNode
    defaultTransition?: TransitionType
}

export const TransitionProvider: React.FC<TransitionProviderProps> = ({
    children,
    defaultTransition = 'fade',
}) => {
    const navigate = useNavigate()
    const [transition, setTransition] = useState<TransitionType>(defaultTransition)

    // Check for reduced motion preference
    const prefersReducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const navigateWithTransition = useCallback((path: string, type?: TransitionType) => {
        if (type) setTransition(type)
        navigate(path)
    }, [navigate])

    return (
        <TransitionContext.Provider value={{
            transition,
            setTransition,
            navigateWithTransition,
            prefersReducedMotion,
        }}>
            {children}
        </TransitionContext.Provider>
    )
}

export const usePageTransition = () => {
    const context = useContext(TransitionContext)
    if (!context) {
        throw new Error('usePageTransition must be used within TransitionProvider')
    }
    return context
}

// Page Transition Wrapper
interface PageTransitionProps {
    children: ReactNode
    transition?: TransitionType
    className?: string
}

export const PageTransition: React.FC<PageTransitionProps> = ({
    children,
    transition,
    className,
}) => {
    const { transition: contextTransition, prefersReducedMotion } = usePageTransition()
    const activeTransition = transition || contextTransition
    const variants = prefersReducedMotion
        ? reducedMotionVariants
        : transitionVariants[activeTransition]

    return (
        <motion.div
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{
                type: 'spring',
                stiffness: 300,
                damping: 30,
                duration: prefersReducedMotion ? 0.1 : undefined,
            }}
            className={cn('w-full', className)}
        >
            {children}
        </motion.div>
    )
}

// Animated Route Wrapper for React Router
interface AnimatedRoutesProps {
    children: ReactNode
    className?: string
}

export const AnimatedRoutes: React.FC<AnimatedRoutesProps> = ({
    children,
    className,
}) => {
    return (
        <AnimatePresence mode="wait">
            <div className={className}>
                {children}
            </div>
        </AnimatePresence>
    )
}

// Modal Transitions
interface ModalTransitionProps {
    children: ReactNode
    isOpen: boolean
    type?: 'fade' | 'slide-up' | 'zoom' | 'drawer-left' | 'drawer-right'
    onClose?: () => void
}

const modalVariants = {
    fade: {
        overlay: {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
        },
        content: {
            initial: { opacity: 0, scale: 0.95 },
            animate: { opacity: 1, scale: 1 },
            exit: { opacity: 0, scale: 0.95 },
        },
    },
    'slide-up': {
        overlay: {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
        },
        content: {
            initial: { y: '100%' },
            animate: { y: 0 },
            exit: { y: '100%' },
        },
    },
    zoom: {
        overlay: {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
        },
        content: {
            initial: { scale: 0, opacity: 0 },
            animate: { scale: 1, opacity: 1 },
            exit: { scale: 0, opacity: 0 },
        },
    },
    'drawer-left': {
        overlay: {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
        },
        content: {
            initial: { x: '-100%' },
            animate: { x: 0 },
            exit: { x: '-100%' },
        },
    },
    'drawer-right': {
        overlay: {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
        },
        content: {
            initial: { x: '100%' },
            animate: { x: 0 },
            exit: { x: '100%' },
        },
    },
}

export const ModalTransition: React.FC<ModalTransitionProps> = ({
    children,
    isOpen,
    type = 'fade',
    onClose,
}) => {
    const variants = modalVariants[type]

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Overlay */}
                    <motion.div
                        variants={variants.overlay}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={{ duration: 0.2 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                    />

                    {/* Content */}
                    <motion.div
                        variants={variants.content}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className={cn(
                            'fixed z-50',
                            type === 'drawer-left' && 'inset-y-0 left-0',
                            type === 'drawer-right' && 'inset-y-0 right-0',
                            (type === 'fade' || type === 'zoom') && 'inset-0 flex items-center justify-center',
                            type === 'slide-up' && 'inset-x-0 bottom-0',
                        )}
                    >
                        {children}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}

// Staggered List Animation
interface StaggeredListProps {
    children: ReactNode[]
    staggerDelay?: number
    className?: string
}

export const StaggeredList: React.FC<StaggeredListProps> = ({
    children,
    staggerDelay = 0.1,
    className,
}) => {
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={{
                visible: {
                    transition: {
                        staggerChildren: staggerDelay,
                    },
                },
            }}
            className={className}
        >
            {React.Children.map(children, (child, index) => (
                <motion.div
                    key={index}
                    variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 },
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                >
                    {child}
                </motion.div>
            ))}
        </motion.div>
    )
}

export default PageTransition
