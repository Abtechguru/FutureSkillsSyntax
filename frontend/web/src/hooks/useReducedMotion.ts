import { useEffect, useState } from 'react'

/**
 * Hook to detect user's reduced motion preference
 * Returns true if user prefers reduced motion
 */
export const useReducedMotion = (): boolean => {
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
        setPrefersReducedMotion(mediaQuery.matches)

        const handleChange = (event: MediaQueryListEvent) => {
            setPrefersReducedMotion(event.matches)
        }

        mediaQuery.addEventListener('change', handleChange)
        return () => mediaQuery.removeEventListener('change', handleChange)
    }, [])

    return prefersReducedMotion
}

/**
 * Get animation duration based on reduced motion preference
 */
export const getAnimationDuration = (normalDuration: number, reducedMotion: boolean): number => {
    return reducedMotion ? 0 : normalDuration
}

/**
 * Get animation properties based on reduced motion preference
 */
export const getAnimationProps = (
    normalProps: object,
    reducedMotion: boolean
): object => {
    if (reducedMotion) {
        return {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
            transition: { duration: 0.1 },
        }
    }
    return normalProps
}

export default useReducedMotion
