import React from 'react'
import { motion } from 'framer-motion'
import { Crown, Medal, Trophy, TrendingUp, Flame } from 'lucide-react'

import Card from '@/components/ui/Card'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/utils/cn'

interface LeaderboardUser {
    id: string
    rank: number
    name: string
    avatar: string
    xp: number
    level: number
    streak: number
    badges: number
    change: 'up' | 'down' | 'same'
    isCurrentUser?: boolean
}

interface LeaderboardProps {
    users?: LeaderboardUser[]
    currentUserId?: string
    showTopThree?: boolean
    className?: string
}

const defaultUsers: LeaderboardUser[] = [
    { id: '1', rank: 1, name: 'Alex Johnson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex', xp: 12450, level: 25, streak: 42, badges: 18, change: 'same' },
    { id: '2', rank: 2, name: 'Sarah Chen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', xp: 11200, level: 23, streak: 38, badges: 15, change: 'up' },
    { id: '3', rank: 3, name: 'Michael Park', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael', xp: 10800, level: 22, streak: 25, badges: 14, change: 'down' },
    { id: '4', rank: 4, name: 'Emma Wilson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma', xp: 9500, level: 20, streak: 19, badges: 12, change: 'up' },
    { id: '5', rank: 5, name: 'David Kim', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David', xp: 8900, level: 19, streak: 15, badges: 11, change: 'same', isCurrentUser: true },
    { id: '6', rank: 6, name: 'Lisa Brown', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa', xp: 8200, level: 18, streak: 12, badges: 10, change: 'up' },
    { id: '7', rank: 7, name: 'James Lee', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James', xp: 7800, level: 17, streak: 8, badges: 9, change: 'down' },
    { id: '8', rank: 8, name: 'Sophia Garcia', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia', xp: 7200, level: 16, streak: 5, badges: 8, change: 'same' },
]

const getRankIcon = (rank: number) => {
    switch (rank) {
        case 1:
            return <Crown className="w-5 h-5 text-yellow-500" />
        case 2:
            return <Medal className="w-5 h-5 text-gray-400" />
        case 3:
            return <Medal className="w-5 h-5 text-amber-600" />
        default:
            return null
    }
}

const getRankColor = (rank: number) => {
    switch (rank) {
        case 1:
            return 'from-yellow-500/20 to-yellow-600/20 border-yellow-500/50'
        case 2:
            return 'from-gray-300/20 to-gray-400/20 border-gray-400/50'
        case 3:
            return 'from-amber-500/20 to-amber-600/20 border-amber-500/50'
        default:
            return ''
    }
}

const Leaderboard: React.FC<LeaderboardProps> = ({
    users = defaultUsers,
    currentUserId,
    showTopThree = true,
    className,
}) => {
    const topThree = users.slice(0, 3)
    const restOfUsers = users.slice(3)

    return (
        <Card className={cn('p-6', className)}>
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <Trophy className="w-6 h-6 text-yellow-500" />
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        Leaderboard
                    </h2>
                </div>
                <Badge variant="secondary">This Week</Badge>
            </div>

            {/* Top 3 Podium */}
            {showTopThree && (
                <div className="flex justify-center items-end gap-4 mb-8">
                    {/* 2nd Place */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-center"
                    >
                        <Avatar
                            src={topThree[1]?.avatar}
                            alt={topThree[1]?.name}
                            size="lg"
                            className="ring-4 ring-gray-300 mx-auto mb-2"
                        />
                        <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                            {topThree[1]?.name.split(' ')[0]}
                        </div>
                        <div className="w-20 h-16 bg-gradient-to-t from-gray-300 to-gray-200 dark:from-gray-600 dark:to-gray-500 rounded-t-lg flex items-center justify-center">
                            <span className="text-2xl font-bold text-white">2</span>
                        </div>
                    </motion.div>

                    {/* 1st Place */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-center"
                    >
                        <div className="relative">
                            <Crown className="w-6 h-6 text-yellow-500 absolute -top-6 left-1/2 -translate-x-1/2" />
                            <Avatar
                                src={topThree[0]?.avatar}
                                alt={topThree[0]?.name}
                                size="xl"
                                className="ring-4 ring-yellow-400 mx-auto mb-2"
                            />
                        </div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                            {topThree[0]?.name.split(' ')[0]}
                        </div>
                        <div className="w-20 h-24 bg-gradient-to-t from-yellow-500 to-yellow-400 rounded-t-lg flex items-center justify-center">
                            <span className="text-3xl font-bold text-white">1</span>
                        </div>
                    </motion.div>

                    {/* 3rd Place */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-center"
                    >
                        <Avatar
                            src={topThree[2]?.avatar}
                            alt={topThree[2]?.name}
                            size="lg"
                            className="ring-4 ring-amber-400 mx-auto mb-2"
                        />
                        <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                            {topThree[2]?.name.split(' ')[0]}
                        </div>
                        <div className="w-20 h-12 bg-gradient-to-t from-amber-500 to-amber-400 rounded-t-lg flex items-center justify-center">
                            <span className="text-xl font-bold text-white">3</span>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Leaderboard List */}
            <div className="space-y-2">
                {restOfUsers.map((user, index) => (
                    <motion.div
                        key={user.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className={cn(
                            'flex items-center gap-4 p-3 rounded-lg transition-colors',
                            user.isCurrentUser
                                ? 'bg-primary/10 border border-primary/30'
                                : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                        )}
                    >
                        {/* Rank */}
                        <div className="w-8 text-center">
                            <span className="text-lg font-bold text-gray-500">
                                {user.rank}
                            </span>
                        </div>

                        {/* Change Indicator */}
                        <div className="w-6">
                            {user.change === 'up' && (
                                <TrendingUp className="w-4 h-4 text-green-500" />
                            )}
                            {user.change === 'down' && (
                                <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />
                            )}
                        </div>

                        {/* User Info */}
                        <Avatar src={user.avatar} alt={user.name} size="sm" />
                        <div className="flex-1">
                            <div className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                                {user.name}
                                {user.isCurrentUser && (
                                    <Badge variant="primary" className="text-xs">You</Badge>
                                )}
                            </div>
                            <div className="text-xs text-gray-500">
                                Level {user.level}
                            </div>
                        </div>

                        {/* Streak */}
                        <div className="flex items-center gap-1 text-orange-500">
                            <Flame className="w-4 h-4" />
                            <span className="text-sm font-medium">{user.streak}</span>
                        </div>

                        {/* XP */}
                        <div className="text-right">
                            <div className="font-semibold text-gray-900 dark:text-white">
                                {user.xp.toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-500">XP</div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </Card>
    )
}

export default Leaderboard
