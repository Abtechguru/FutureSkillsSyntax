import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merges CSS class names using clsx and tailwind-merge.
 * This ensures that Tailwind classes are merged correctly, with the last one taking precedence.
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}
