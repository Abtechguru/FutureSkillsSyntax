import React from 'react'
import { cn } from '@/utils/cn'
import { ChevronRight, Home } from 'lucide-react'

export interface BreadcrumbItem {
    label: string
    href?: string
    icon?: React.ReactNode
}

export interface BreadcrumbsProps {
    items: BreadcrumbItem[]
    separator?: React.ReactNode
    showHome?: boolean
    homeHref?: string
    maxItems?: number
    className?: string
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
    items,
    separator = <ChevronRight className="w-4 h-4 text-gray-400" />,
    showHome = true,
    homeHref = '/',
    maxItems = 0,
    className,
}) => {
    let displayItems = items

    // Collapse items if maxItems is set
    if (maxItems > 0 && items.length > maxItems) {
        const firstItem = items[0]
        const lastItems = items.slice(-2)
        displayItems = [
            firstItem,
            { label: '...', href: undefined },
            ...lastItems,
        ]
    }

    return (
        <nav aria-label="Breadcrumb" className={cn('flex items-center', className)}>
            <ol className="flex items-center gap-2">
                {showHome && (
                    <>
                        <li>
                            <a
                                href={homeHref}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                            >
                                <Home className="w-4 h-4" />
                            </a>
                        </li>
                        {items.length > 0 && (
                            <li className="flex items-center">{separator}</li>
                        )}
                    </>
                )}
                {displayItems.map((item, index) => (
                    <React.Fragment key={index}>
                        <li>
                            {item.href ? (
                                <a
                                    href={item.href}
                                    className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                                >
                                    {item.icon}
                                    <span>{item.label}</span>
                                </a>
                            ) : (
                                <span
                                    className={cn(
                                        'flex items-center gap-1 text-sm',
                                        index === displayItems.length - 1
                                            ? 'text-gray-900 dark:text-white font-medium'
                                            : 'text-gray-500 dark:text-gray-400'
                                    )}
                                >
                                    {item.icon}
                                    <span>{item.label}</span>
                                </span>
                            )}
                        </li>
                        {index < displayItems.length - 1 && (
                            <li className="flex items-center">{separator}</li>
                        )}
                    </React.Fragment>
                ))}
            </ol>
        </nav>
    )
}

export default Breadcrumbs
