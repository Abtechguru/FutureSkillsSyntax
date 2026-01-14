import React from 'react'
import { cn } from '@/utils/cn'
import { User } from 'lucide-react'

export interface AvatarProps {
    src?: string
    alt?: string
    name?: string
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
    status?: 'online' | 'offline' | 'away' | 'busy'
    className?: string
}

const Avatar: React.FC<AvatarProps> = ({
    src,
    alt,
    name,
    size = 'md',
    status,
    className,
}) => {
    const sizeClasses = {
        xs: 'w-6 h-6 text-xs',
        sm: 'w-8 h-8 text-sm',
        md: 'w-10 h-10 text-base',
        lg: 'w-12 h-12 text-lg',
        xl: 'w-16 h-16 text-xl',
    }

    const statusSizes = {
        xs: 'w-1.5 h-1.5',
        sm: 'w-2 h-2',
        md: 'w-2.5 h-2.5',
        lg: 'w-3 h-3',
        xl: 'w-4 h-4',
    }

    const statusColors = {
        online: 'bg-green-500',
        offline: 'bg-gray-400',
        away: 'bg-yellow-500',
        busy: 'bg-red-500',
    }

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)
    }

    return (
        <div className={cn('relative inline-block', className)}>
            <div
                className={cn(
                    'rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden',
                    sizeClasses[size]
                )}
            >
                {src ? (
                    <img
                        src={src}
                        alt={alt || name || 'Avatar'}
                        className="w-full h-full object-cover"
                    />
                ) : name ? (
                    <span className="font-medium text-gray-600 dark:text-gray-300">
                        {getInitials(name)}
                    </span>
                ) : (
                    <User className="w-1/2 h-1/2 text-gray-400" />
                )}
            </div>
            {status && (
                <span
                    className={cn(
                        'absolute bottom-0 right-0 rounded-full border-2 border-white dark:border-gray-900',
                        statusSizes[size],
                        statusColors[status]
                    )}
                />
            )}
        </div>
    )
}

// Avatar Group
export interface AvatarGroupProps {
    avatars: AvatarProps[]
    max?: number
    size?: AvatarProps['size']
    className?: string
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
    avatars,
    max = 4,
    size = 'md',
    className,
}) => {
    const visibleAvatars = avatars.slice(0, max)
    const remainingCount = avatars.length - max

    const overlapClasses = {
        xs: '-ml-2',
        sm: '-ml-2.5',
        md: '-ml-3',
        lg: '-ml-4',
        xl: '-ml-5',
    }

    const sizeClasses = {
        xs: 'w-6 h-6 text-[10px]',
        sm: 'w-8 h-8 text-xs',
        md: 'w-10 h-10 text-sm',
        lg: 'w-12 h-12 text-base',
        xl: 'w-16 h-16 text-lg',
    }

    return (
        <div className={cn('flex', className)}>
            {visibleAvatars.map((avatar, index) => (
                <div
                    key={index}
                    className={cn('ring-2 ring-white dark:ring-gray-900 rounded-full', index > 0 && overlapClasses[size])}
                >
                    <Avatar {...avatar} size={size} />
                </div>
            ))}
            {remainingCount > 0 && (
                <div
                    className={cn(
                        'flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-medium ring-2 ring-white dark:ring-gray-900',
                        overlapClasses[size],
                        sizeClasses[size]
                    )}
                >
                    +{remainingCount}
                </div>
            )}
        </div>
    )
}

export default Avatar
