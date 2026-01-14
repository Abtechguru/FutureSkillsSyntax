import React from 'react'
import { cn } from '@/utils/cn'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'

export interface PaginationProps {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
    siblingCount?: number
    showFirstLast?: boolean
    size?: 'sm' | 'md' | 'lg'
    className?: string
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
    siblingCount = 1,
    showFirstLast = true,
    size = 'md',
    className,
}) => {
    const sizeClasses = {
        sm: 'h-7 min-w-7 text-xs',
        md: 'h-9 min-w-9 text-sm',
        lg: 'h-11 min-w-11 text-base',
    }

    const range = (start: number, end: number) => {
        const length = end - start + 1
        return Array.from({ length }, (_, i) => start + i)
    }

    const generatePages = (): (number | 'ellipsis')[] => {
        const totalNumbers = siblingCount * 2 + 3 // siblings + current + first + last
        const totalBlocks = totalNumbers + 2 // + 2 ellipsis

        if (totalPages <= totalBlocks) {
            return range(1, totalPages)
        }

        const leftSiblingIndex = Math.max(currentPage - siblingCount, 1)
        const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages)

        const shouldShowLeftDots = leftSiblingIndex > 2
        const shouldShowRightDots = rightSiblingIndex < totalPages - 1

        if (!shouldShowLeftDots && shouldShowRightDots) {
            const leftRange = range(1, 3 + siblingCount * 2)
            return [...leftRange, 'ellipsis', totalPages]
        }

        if (shouldShowLeftDots && !shouldShowRightDots) {
            const rightRange = range(totalPages - (2 + siblingCount * 2), totalPages)
            return [1, 'ellipsis', ...rightRange]
        }

        const middleRange = range(leftSiblingIndex, rightSiblingIndex)
        return [1, 'ellipsis', ...middleRange, 'ellipsis', totalPages]
    }

    const pages = generatePages()

    const PageButton: React.FC<{
        page: number
        active?: boolean
        disabled?: boolean
    }> = ({ page, active, disabled }) => (
        <button
            onClick={() => !disabled && onPageChange(page)}
            disabled={disabled}
            className={cn(
                'flex items-center justify-center rounded-lg font-medium transition-colors duration-200',
                sizeClasses[size],
                active
                    ? 'bg-primary text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800',
                disabled && 'opacity-50 cursor-not-allowed'
            )}
        >
            {page}
        </button>
    )

    const NavButton: React.FC<{
        direction: 'prev' | 'next'
        disabled?: boolean
    }> = ({ direction, disabled }) => (
        <button
            onClick={() =>
                !disabled &&
                onPageChange(direction === 'prev' ? currentPage - 1 : currentPage + 1)
            }
            disabled={disabled}
            className={cn(
                'flex items-center justify-center rounded-lg transition-colors duration-200',
                sizeClasses[size],
                disabled
                    ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            )}
        >
            {direction === 'prev' ? (
                <ChevronLeft className="w-5 h-5" />
            ) : (
                <ChevronRight className="w-5 h-5" />
            )}
        </button>
    )

    return (
        <nav
            aria-label="Pagination"
            className={cn('flex items-center gap-1', className)}
        >
            {showFirstLast && (
                <NavButton direction="prev" disabled={currentPage === 1} />
            )}

            {pages.map((page, index) =>
                page === 'ellipsis' ? (
                    <span
                        key={`ellipsis-${index}`}
                        className={cn(
                            'flex items-center justify-center text-gray-400',
                            sizeClasses[size]
                        )}
                    >
                        <MoreHorizontal className="w-4 h-4" />
                    </span>
                ) : (
                    <PageButton key={page} page={page} active={page === currentPage} />
                )
            )}

            {showFirstLast && (
                <NavButton direction="next" disabled={currentPage === totalPages} />
            )}
        </nav>
    )
}

export default Pagination
