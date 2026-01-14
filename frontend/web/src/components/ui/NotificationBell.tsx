import React from 'react'
import { Bell } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'

interface NotificationBellProps {
    count?: number
    onClick?: () => void
    className?: string
}

const NotificationBell: React.FC<NotificationBellProps> = ({
    count = 0,
    onClick,
    className,
}) => {
    return (
        <button
            onClick={onClick}
            className={cn(
                'relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors',
                className
            )}
        >
            <Bell className="h-6 w-6 text-gray-600 dark:text-gray-400" />
            {count > 0 && (
                <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white"
                >
                    {count > 9 ? '9+' : count}
                </motion.span>
            )}
        </button>
    )
}

export default NotificationBell
