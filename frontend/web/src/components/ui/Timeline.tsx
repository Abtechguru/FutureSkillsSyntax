import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'

export interface TimelineItem {
    id: string
    title: string
    description?: string
    date?: string
    icon?: React.ReactNode
    status?: 'completed' | 'current' | 'upcoming'
    content?: React.ReactNode
}

export interface TimelineProps {
    items: TimelineItem[]
    orientation?: 'vertical' | 'horizontal'
    alternating?: boolean
    className?: string
}

const Timeline: React.FC<TimelineProps> = ({
    items,
    orientation = 'vertical',
    alternating = false,
    className,
}) => {
    const statusColors = {
        completed: 'bg-success border-success',
        current: 'bg-primary border-primary',
        upcoming: 'bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600',
    }

    const statusLineColors = {
        completed: 'bg-success',
        current: 'bg-primary',
        upcoming: 'bg-gray-200 dark:bg-gray-700',
    }

    if (orientation === 'horizontal') {
        return (
            <div className={cn('flex items-start overflow-x-auto pb-4', className)}>
                {items.map((item, index) => (
                    <div key={item.id} className="flex items-start flex-shrink-0">
                        <div className="flex flex-col items-center">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className={cn(
                                    'w-10 h-10 rounded-full flex items-center justify-center border-2',
                                    statusColors[item.status || 'upcoming']
                                )}
                            >
                                {item.icon || (
                                    <span className="text-white text-sm font-semibold">
                                        {index + 1}
                                    </span>
                                )}
                            </motion.div>
                            <div className="mt-3 text-center max-w-32">
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                    {item.title}
                                </p>
                                {item.date && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        {item.date}
                                    </p>
                                )}
                            </div>
                        </div>
                        {index < items.length - 1 && (
                            <div
                                className={cn(
                                    'h-0.5 w-20 mt-5',
                                    statusLineColors[item.status || 'upcoming']
                                )}
                            />
                        )}
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className={cn('relative', className)}>
            {items.map((item, index) => (
                <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: alternating && index % 2 === 1 ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={cn(
                        'relative flex gap-4',
                        alternating && index % 2 === 1 && 'flex-row-reverse',
                        index !== items.length - 1 && 'pb-8'
                    )}
                >
                    {/* Line */}
                    {index !== items.length - 1 && (
                        <div
                            className={cn(
                                'absolute w-0.5 top-10 bottom-0',
                                alternating ? 'left-1/2 -translate-x-1/2' : 'left-[18px]',
                                statusLineColors[item.status || 'upcoming']
                            )}
                        />
                    )}

                    {/* Dot */}
                    <div
                        className={cn(
                            'relative z-10 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border-2 bg-white dark:bg-gray-900',
                            statusColors[item.status || 'upcoming']
                        )}
                    >
                        {item.icon || (
                            <span
                                className={cn(
                                    'text-sm font-semibold',
                                    item.status === 'upcoming'
                                        ? 'text-gray-500 dark:text-gray-400'
                                        : 'text-white'
                                )}
                            >
                                {index + 1}
                            </span>
                        )}
                    </div>

                    {/* Content */}
                    <div className={cn('flex-1 min-w-0', alternating && 'text-right')}>
                        <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                                {item.title}
                            </h3>
                            {item.date && (
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {item.date}
                                </span>
                            )}
                        </div>
                        {item.description && (
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                {item.description}
                            </p>
                        )}
                        {item.content && <div className="mt-3">{item.content}</div>}
                    </div>
                </motion.div>
            ))}
        </div>
    )
}

export default Timeline
