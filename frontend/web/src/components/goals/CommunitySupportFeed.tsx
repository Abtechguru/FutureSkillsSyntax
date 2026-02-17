import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
    Heart,
    MessageCircle,
    Share2,
    TrendingUp,
    Target,
    Flame,
    Award,
    Users,
    Send,
    Sparkles,
    ChevronDown,
    Filter,
} from 'lucide-react'
import { cn } from '@/utils/cn'

interface CommunityPost {
    id: string
    user: {
        id: string
        name: string
        avatar?: string
        level: number
    }
    type: 'goal' | 'check-in' | 'achievement'
    title?: string
    content: string
    mood?: string
    progress?: number
    category: string
    timestamp: string
    likes: number
    comments: number
    isLiked: boolean
    supporters: number
}

interface CommunitySupportFeedProps {
    posts: CommunityPost[]
    onLike: (postId: string) => void
    onComment: (postId: string, comment: string) => void
    onSupport: (postId: string, message?: string) => void
}

const CommunitySupportFeed: React.FC<CommunitySupportFeedProps> = ({
    posts,
    onLike,
    onComment,
    onSupport,
}) => {
    const [activeComment, setActiveComment] = useState<string | null>(null)
    const [commentText, setCommentText] = useState('')
    const [filter, setFilter] = useState<'all' | 'goals' | 'check-ins' | 'achievements'>('all')

    const categoryColors: Record<string, string> = {
        learning: 'from-blue-500 to-cyan-500',
        career: 'from-purple-500 to-pink-500',
        health: 'from-green-500 to-emerald-500',
        finance: 'from-yellow-500 to-orange-500',
        personal: 'from-indigo-500 to-purple-500',
        creativity: 'from-pink-500 to-rose-500',
    }

    const moodEmojis: Record<string, string> = {
        excellent: '🚀',
        good: '😊',
        neutral: '😐',
        struggling: '😓',
        need_help: '🆘',
    }

    const typeIcons: Record<string, any> = {
        goal: Target,
        'check-in': TrendingUp,
        achievement: Award,
    }

    const handleComment = (postId: string) => {
        if (commentText.trim()) {
            onComment(postId, commentText)
            setCommentText('')
            setActiveComment(null)
        }
    }

    const filteredPosts = posts.filter((post) => {
        if (filter === 'all') return true
        if (filter === 'goals') return post.type === 'goal'
        if (filter === 'check-ins') return post.type === 'check-in'
        if (filter === 'achievements') return post.type === 'achievement'
        return true
    })

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Community Feed</h2>
                    <p className="text-sm text-gray-500">Support and celebrate with fellow achievers</p>
                </div>

                {/* Filter */}
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-gray-400" />
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value as any)}
                        className="px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                        <option value="all">All Posts</option>
                        <option value="goals">Goals</option>
                        <option value="check-ins">Check-ins</option>
                        <option value="achievements">Achievements</option>
                    </select>
                </div>
            </div>

            {/* Posts */}
            <div className="space-y-4">
                {filteredPosts.length === 0 ? (
                    <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
                        <Users className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No posts yet</h3>
                        <p className="text-gray-500 max-w-md mx-auto">
                            Be the first to share your journey with the community!
                        </p>
                    </div>
                ) : (
                    filteredPosts.map((post, index) => {
                        const TypeIcon = typeIcons[post.type]
                        return (
                            <motion.div
                                key={post.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-lg transition-shadow"
                            >
                                {/* Header */}
                                <div className="p-6 pb-4">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            {/* Avatar */}
                                            <div className="relative">
                                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                                                    {post.user.avatar ? (
                                                        <img
                                                            src={post.user.avatar}
                                                            alt={post.user.name}
                                                            className="w-full h-full rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        post.user.name.charAt(0)
                                                    )}
                                                </div>
                                                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-xs font-bold text-white border-2 border-white dark:border-gray-900">
                                                    {post.user.level}
                                                </div>
                                            </div>

                                            {/* User Info */}
                                            <div>
                                                <p className="font-semibold text-gray-900 dark:text-white">
                                                    {post.user.name}
                                                </p>
                                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                                    <span>{post.timestamp}</span>
                                                    <span>•</span>
                                                    <div className="flex items-center gap-1">
                                                        <TypeIcon className="w-3 h-3" />
                                                        <span className="capitalize">{post.type}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Category Badge */}
                                        <div
                                            className={cn(
                                                'px-3 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r',
                                                categoryColors[post.category] || 'from-gray-500 to-gray-600'
                                            )}
                                        >
                                            {post.category}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="space-y-3">
                                        {post.title && (
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                {post.title}
                                            </h3>
                                        )}

                                        {post.mood && (
                                            <div className="flex items-center gap-2 text-2xl">
                                                {moodEmojis[post.mood]}
                                            </div>
                                        )}

                                        <p className="text-gray-700 dark:text-gray-300">{post.content}</p>

                                        {/* Progress Bar */}
                                        {post.progress !== undefined && (
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-gray-500">Progress</span>
                                                    <span className="font-semibold text-gray-900 dark:text-white">
                                                        {post.progress}%
                                                    </span>
                                                </div>
                                                <div className="relative h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${post.progress}%` }}
                                                        transition={{ duration: 1, delay: index * 0.05 }}
                                                        className={cn(
                                                            'h-full rounded-full bg-gradient-to-r',
                                                            categoryColors[post.category] || 'from-blue-500 to-purple-500'
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-6">
                                            {/* Like */}
                                            <button
                                                onClick={() => onLike(post.id)}
                                                className={cn(
                                                    'flex items-center gap-2 text-sm transition-colors',
                                                    post.isLiked
                                                        ? 'text-pink-600'
                                                        : 'text-gray-500 hover:text-pink-600'
                                                )}
                                            >
                                                <Heart
                                                    className={cn('w-5 h-5', post.isLiked && 'fill-current')}
                                                />
                                                <span className="font-medium">{post.likes}</span>
                                            </button>

                                            {/* Comment */}
                                            <button
                                                onClick={() =>
                                                    setActiveComment(activeComment === post.id ? null : post.id)
                                                }
                                                className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors"
                                            >
                                                <MessageCircle className="w-5 h-5" />
                                                <span className="font-medium">{post.comments}</span>
                                            </button>

                                            {/* Share */}
                                            <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-green-600 transition-colors">
                                                <Share2 className="w-5 h-5" />
                                            </button>
                                        </div>

                                        {/* Support Button */}
                                        <button
                                            onClick={() => onSupport(post.id)}
                                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all text-sm font-medium"
                                        >
                                            <Sparkles className="w-4 h-4" />
                                            Support ({post.supporters})
                                        </button>
                                    </div>

                                    {/* Comment Input */}
                                    {activeComment === post.id && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
                                        >
                                            <div className="flex gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                                                    U
                                                </div>
                                                <div className="flex-1 flex gap-2">
                                                    <input
                                                        type="text"
                                                        value={commentText}
                                                        onChange={(e) => setCommentText(e.target.value)}
                                                        onKeyPress={(e) =>
                                                            e.key === 'Enter' && handleComment(post.id)
                                                        }
                                                        placeholder="Add a supportive comment..."
                                                        className="flex-1 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                                    />
                                                    <button
                                                        onClick={() => handleComment(post.id)}
                                                        disabled={!commentText.trim()}
                                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                    >
                                                        <Send className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>
                            </motion.div>
                        )
                    })
                )}
            </div>

            {/* Load More */}
            {filteredPosts.length > 0 && (
                <div className="text-center">
                    <button className="flex items-center gap-2 mx-auto px-6 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl hover:shadow-lg transition-all text-gray-700 dark:text-gray-300">
                        Load More
                        <ChevronDown className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    )
}

export default CommunitySupportFeed
