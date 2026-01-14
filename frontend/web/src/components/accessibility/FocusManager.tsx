import React, { useRef, useEffect, useCallback, createContext, useContext, ReactNode } from 'react'

/**
 * Focus Trap - Keeps focus within a component (for modals, dialogs)
 */
interface FocusTrapProps {
    children: ReactNode
    active?: boolean
    restoreFocus?: boolean
}

export const FocusTrap: React.FC<FocusTrapProps> = ({
    children,
    active = true,
    restoreFocus = true,
}) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const previousActiveElement = useRef<Element | null>(null)

    useEffect(() => {
        if (!active) return

        previousActiveElement.current = document.activeElement

        const focusableElements = containerRef.current?.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )

        if (focusableElements && focusableElements.length > 0) {
            (focusableElements[0] as HTMLElement).focus()
        }

        return () => {
            if (restoreFocus && previousActiveElement.current) {
                (previousActiveElement.current as HTMLElement).focus?.()
            }
        }
    }, [active, restoreFocus])

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (!active || e.key !== 'Tab') return

        const focusableElements = containerRef.current?.querySelectorAll(
            'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )

        if (!focusableElements || focusableElements.length === 0) return

        const firstElement = focusableElements[0] as HTMLElement
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                e.preventDefault()
                lastElement.focus()
            }
        } else {
            if (document.activeElement === lastElement) {
                e.preventDefault()
                firstElement.focus()
            }
        }
    }, [active])

    return (
        <div ref={containerRef} onKeyDown={handleKeyDown}>
            {children}
        </div>
    )
}

/**
 * Skip Link - Allows keyboard users to skip navigation
 */
interface SkipLinkProps {
    targetId: string
    children?: ReactNode
}

export const SkipLink: React.FC<SkipLinkProps> = ({
    targetId,
    children = 'Skip to main content',
}) => {
    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault()
        const target = document.getElementById(targetId)
        if (target) {
            target.tabIndex = -1
            target.focus()
            target.scrollIntoView()
        }
    }

    return (
        <a
            href={`#${targetId}`}
            onClick={handleClick}
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
        >
            {children}
        </a>
    )
}

/**
 * Focus Ring - Visible focus indicator for keyboard navigation
 */
interface FocusRingProps {
    children: React.ReactElement
    offset?: number
    color?: string
}

export const FocusRing: React.FC<FocusRingProps> = ({
    children,
    offset = 2,
    color = 'ring-primary',
}) => {
    return React.cloneElement(children, {
        className: `${children.props.className || ''} focus:outline-none focus-visible:ring-2 focus-visible:${color} focus-visible:ring-offset-${offset}`,
    })
}

/**
 * Announce - Screen reader announcements
 */
interface AnnounceContextType {
    announce: (message: string, priority?: 'polite' | 'assertive') => void
}

const AnnounceContext = createContext<AnnounceContextType | undefined>(undefined)

export const AnnounceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const politeRef = useRef<HTMLDivElement>(null)
    const assertiveRef = useRef<HTMLDivElement>(null)

    const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
        const element = priority === 'assertive' ? assertiveRef.current : politeRef.current
        if (element) {
            element.textContent = ''
            setTimeout(() => {
                element.textContent = message
            }, 100)
        }
    }, [])

    return (
        <AnnounceContext.Provider value={{ announce }}>
            {children}
            <div
                ref={politeRef}
                role="status"
                aria-live="polite"
                aria-atomic="true"
                className="sr-only"
            />
            <div
                ref={assertiveRef}
                role="alert"
                aria-live="assertive"
                aria-atomic="true"
                className="sr-only"
            />
        </AnnounceContext.Provider>
    )
}

export const useAnnounce = () => {
    const context = useContext(AnnounceContext)
    if (!context) {
        throw new Error('useAnnounce must be used within AnnounceProvider')
    }
    return context
}

/**
 * Keyboard Navigation Hook
 */
interface KeyboardNavigationOptions {
    onArrowUp?: () => void
    onArrowDown?: () => void
    onArrowLeft?: () => void
    onArrowRight?: () => void
    onEnter?: () => void
    onEscape?: () => void
    onTab?: (shiftKey: boolean) => void
    onHome?: () => void
    onEnd?: () => void
}

export const useKeyboardNavigation = (
    options: KeyboardNavigationOptions,
    enabled = true
) => {
    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (!enabled) return

            switch (e.key) {
                case 'ArrowUp':
                    e.preventDefault()
                    options.onArrowUp?.()
                    break
                case 'ArrowDown':
                    e.preventDefault()
                    options.onArrowDown?.()
                    break
                case 'ArrowLeft':
                    e.preventDefault()
                    options.onArrowLeft?.()
                    break
                case 'ArrowRight':
                    e.preventDefault()
                    options.onArrowRight?.()
                    break
                case 'Enter':
                    options.onEnter?.()
                    break
                case 'Escape':
                    options.onEscape?.()
                    break
                case 'Tab':
                    options.onTab?.(e.shiftKey)
                    break
                case 'Home':
                    e.preventDefault()
                    options.onHome?.()
                    break
                case 'End':
                    e.preventDefault()
                    options.onEnd?.()
                    break
            }
        },
        [enabled, options]
    )

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [handleKeyDown])
}

/**
 * Roving Tab Index - For keyboard navigation in lists
 */
interface RovingTabIndexProps {
    children: ReactNode[]
    className?: string
    orientation?: 'horizontal' | 'vertical'
}

export const RovingTabIndex: React.FC<RovingTabIndexProps> = ({
    children,
    className,
    orientation = 'vertical',
}) => {
    const [focusedIndex, setFocusedIndex] = React.useState(0)
    const containerRef = useRef<HTMLDivElement>(null)

    const handleKeyDown = (e: React.KeyboardEvent) => {
        const isVertical = orientation === 'vertical'
        const prevKey = isVertical ? 'ArrowUp' : 'ArrowLeft'
        const nextKey = isVertical ? 'ArrowDown' : 'ArrowRight'

        if (e.key === prevKey) {
            e.preventDefault()
            setFocusedIndex((prev) => Math.max(0, prev - 1))
        } else if (e.key === nextKey) {
            e.preventDefault()
            setFocusedIndex((prev) => Math.min(children.length - 1, prev + 1))
        } else if (e.key === 'Home') {
            e.preventDefault()
            setFocusedIndex(0)
        } else if (e.key === 'End') {
            e.preventDefault()
            setFocusedIndex(children.length - 1)
        }
    }

    useEffect(() => {
        const focusableElements = containerRef.current?.querySelectorAll('[role="option"], button, a')
        if (focusableElements && focusableElements[focusedIndex]) {
            (focusableElements[focusedIndex] as HTMLElement).focus()
        }
    }, [focusedIndex])

    return (
        <div
            ref={containerRef}
            role="listbox"
            onKeyDown={handleKeyDown}
            className={className}
            tabIndex={-1}
        >
            {React.Children.map(children, (child, index) =>
                React.isValidElement(child)
                    ? React.cloneElement(child as React.ReactElement<any>, {
                        tabIndex: index === focusedIndex ? 0 : -1,
                        'aria-selected': index === focusedIndex,
                        role: 'option',
                    })
                    : child
            )}
        </div>
    )
}

export default FocusTrap
