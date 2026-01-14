import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
    ArrowLeft,
    ArrowUp,
    ArrowDown,
    MessageSquare,
    CheckCircle,
    Flag,
    Share2,
    Bookmark,
    MoreHorizontal,
    Edit,
    Trash,
    Clock,
    Eye,
} from 'lucide-react'
import { toast } from 'react-hot-toast'

import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { Textarea } from '@/components/ui/Textarea'
import Modal from '@/components/ui/Modal'
import FadeIn from '@/components/animations/FadeIn'
import communityService, { ForumThread, ForumPost } from '@/services/community'
import { cn } from '@/utils/cn'

const ThreadDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()

    const [thread, setThread] = useState<ForumThread | null>(null)
    const [posts, setPosts] = useState<ForumPost[]>([])
    const [loading, setLoading] = useState(true)
    const [replyContent, setReplyContent] = useState('')
    const [replyingTo, setReplyingTo] = useState<string | null>(null)
    const [isAuthor, setIsAuthor] = useState(false)

    useEffect(() => {
        loadThread()
    }, [id])

    const loadThread = async () => {
        setLoading(true)
        try {
            const [threadData, postsData] = await Promise.all([
                communityService.getThread(id!),
                communityService.getPosts(id!)
            ])
            setThread(threadData)
            setPosts(postsData)
            // Check if current user is the author
            setIsAuthor(threadData.author.id === 'current-user-id')
        } catch (error) {
            toast.error('Failed to load thread')
        } finally {
            setLoading(false)
        }
    }

    const handleVote = async (type: 'thread' | 'post', targetId: string, vote: 'up' | 'down') => {
        try {
            if (type === 'thread') {
                const result = await communityService.voteThread(targetId, vote)
                setThread(prev => prev ? { ...prev, upvotes: result.upvotes, downvotes: result.downvotes, userVote: vote } : null)
            } else {
                const result = await communityService.votePost(id!, targetId, vote)
                setPosts(prev => prev.map(p =>
                    p.id === targetId ? { ...p, upvotes: result.upvotes, downvotes: result.downvotes, userVote: vote } : p
                ))
            }
        } catch (error) {
            toast.error('Failed to vote')
        }
    }

    const handleReply = async () => {
        if (!replyContent.trim()) return
        try {
            const post = await communityService.createPost(id!, {
                content: replyContent,
                parentId: replyingTo || undefined
            })
            setPosts(prev => [...prev, post])
            setReplyContent('')
            setReplyingTo(null)
            toast.success('Reply posted!')
        } catch (error) {
            toast.error('Failed to post reply')
        }
    }

    const handleMarkAsSolution = async (postId: string) => {
        try {
            await communityService.markAsSolution(id!, postId)
            setThread(prev => prev ? { ...prev, isSolved: true, solutionId: postId } : null)
            setPosts(prev => prev.map(p => ({
                ...p,
                isSolution: p.id === postId
            })))
            toast.success('Marked as solution!')
        } catch (error) {
            toast.error('Failed to mark as solution')
        }
    }

    const getReputationBadge = (reputation: number) => {
        if (reputation >= 10000) return { label: 'Expert', color: 'bg-purple-500' }
        if (reputation >= 5000) return { label: 'Pro', color: 'bg-blue-500' }
        if (reputation >= 1000) return { label: 'Active', color: 'bg-green-500' }
        return null
    }

    if (loading) {
        return (
            <div className="space-y-6 animate-pulse">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
        )
    }

    if (!thread) {
        return (
            <div className="text-center py-12">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Thread not found</h2>
                <Button variant="primary" className="mt-4" onClick={() => navigate('/community')}>
                    Back to Forum
                </Button>
            </div>
        )
    }

    const authorBadge = getReputationBadge(thread.author.reputation)

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            {/* Back Button */}
            <Button variant="ghost" icon={<ArrowLeft />} onClick={() => navigate('/community')}>
                Back to Forum
            </Button>

            {/* Thread Header */}
            <FadeIn>
                <Card className="p-6">
                    <div className="flex gap-4">
                        {/* Vote Column */}
                        <div className="flex flex-col items-center gap-1">
                            <button
                                onClick={() => handleVote('thread', thread.id, 'up')}
                                className={cn(
                                    'p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors',
                                    thread.userVote === 'up' && 'text-primary bg-primary/10'
                                )}
                            >
                                <ArrowUp className="w-6 h-6" />
                            </button>
                            <span className={cn(
                                'text-xl font-bold',
                                thread.upvotes - thread.downvotes > 0 ? 'text-green-500' :
                                    thread.upvotes - thread.downvotes < 0 ? 'text-red-500' : 'text-gray-500'
                            )}>
                                {thread.upvotes - thread.downvotes}
                            </span>
                            <button
                                onClick={() => handleVote('thread', thread.id, 'down')}
                                className={cn(
                                    'p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors',
                                    thread.userVote === 'down' && 'text-red-500 bg-red-500/10'
                                )}
                            >
                                <ArrowDown className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                            <div className="flex items-start gap-2 mb-4">
                                {thread.isSolved && (
                                    <Badge variant="success" className="flex items-center gap-1">
                                        <CheckCircle className="w-3 h-3" />
                                        Solved
                                    </Badge>
                                )}
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {thread.title}
                                </h1>
                            </div>

                            <div className="prose dark:prose-invert max-w-none mb-6">
                                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                    {thread.content}
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-6">
                                {thread.tags.map((tag) => (
                                    <Badge key={tag} variant="secondary">#{tag}</Badge>
                                ))}
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                                <div className="flex items-center gap-3">
                                    <Avatar src={thread.author.avatar} alt={thread.author.name} size="md" />
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-gray-900 dark:text-white">
                                                {thread.author.name}
                                            </span>
                                            {authorBadge && (
                                                <Badge className={cn('text-xs text-white', authorBadge.color)}>
                                                    {authorBadge.label}
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {thread.author.reputation.toLocaleString()} reputation
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        {new Date(thread.createdAt).toLocaleDateString()}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Eye className="w-4 h-4" />
                                        {thread.viewCount} views
                                    </span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 mt-4">
                                <Button variant="outline" size="sm" icon={<Share2 className="w-4 h-4" />}>
                                    Share
                                </Button>
                                <Button variant="outline" size="sm" icon={<Bookmark className="w-4 h-4" />}>
                                    Save
                                </Button>
                                <Button variant="outline" size="sm" icon={<Flag className="w-4 h-4" />}>
                                    Report
                                </Button>
                            </div>
                        </div>
                    </div>
                </Card>
            </FadeIn>

            {/* Replies Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {posts.length} {posts.length === 1 ? 'Reply' : 'Replies'}
                </h2>
            </div>

            {/* Replies */}
            <div className="space-y-4">
                {posts.map((post, index) => {
                    const postAuthorBadge = getReputationBadge(post.author.reputation)
                    return (
                        <FadeIn key={post.id} delay={index * 0.05}>
                            <Card className={cn(
                                'p-6',
                                post.isSolution && 'border-green-500 bg-green-50/50 dark:bg-green-900/10'
                            )}>
                                <div className="flex gap-4">
                                    {/* Vote Column */}
                                    <div className="flex flex-col items-center gap-1">
                                        <button
                                            onClick={() => handleVote('post', post.id, 'up')}
                                            className={cn(
                                                'p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800',
                                                post.userVote === 'up' && 'text-primary'
                                            )}
                                        >
                                            <ArrowUp className="w-5 h-5" />
                                        </button>
                                        <span className="font-semibold text-sm">
                                            {post.upvotes - post.downvotes}
                                        </span>
                                        <button
                                            onClick={() => handleVote('post', post.id, 'down')}
                                            className={cn(
                                                'p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800',
                                                post.userVote === 'down' && 'text-red-500'
                                            )}
                                        >
                                            <ArrowDown className="w-5 h-5" />
                                        </button>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1">
                                        {post.isSolution && (
                                            <div className="flex items-center gap-2 mb-3 text-green-600 font-medium">
                                                <CheckCircle className="w-5 h-5" />
                                                Accepted Solution
                                            </div>
                                        )}

                                        <div className="prose dark:prose-invert max-w-none mb-4">
                                            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                                {post.content}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                                            <div className="flex items-center gap-3">
                                                <Avatar src={post.author.avatar} alt={post.author.name} size="sm" />
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium text-gray-900 dark:text-white text-sm">
                                                            {post.author.name}
                                                        </span>
                                                        {postAuthorBadge && (
                                                            <Badge className={cn('text-xs text-white', postAuthorBadge.color)}>
                                                                {postAuthorBadge.label}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {new Date(post.createdAt).toLocaleString()}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                {isAuthor && !thread.isSolved && (
                                                    <Button
                                                        variant="success"
                                                        size="sm"
                                                        icon={<CheckCircle className="w-4 h-4" />}
                                                        onClick={() => handleMarkAsSolution(post.id)}
                                                    >
                                                        Mark as Solution
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    icon={<MessageSquare className="w-4 h-4" />}
                                                    onClick={() => setReplyingTo(post.id)}
                                                >
                                                    Reply
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </FadeIn>
                    )
                })}
            </div>

            {/* Reply Form */}
            <FadeIn delay={0.3}>
                <Card className="p-6">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                        {replyingTo ? 'Reply to comment' : 'Your Answer'}
                    </h3>
                    {replyingTo && (
                        <div className="flex items-center gap-2 mb-4 p-2 bg-gray-100 dark:bg-gray-800 rounded">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                Replying to a comment
                            </span>
                            <button
                                onClick={() => setReplyingTo(null)}
                                className="text-sm text-primary hover:underline"
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                    <Textarea
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder="Write your answer here... Be specific and helpful!"
                        rows={6}
                        className="mb-4"
                    />
                    <div className="flex justify-end">
                        <Button
                            variant="primary"
                            onClick={handleReply}
                            disabled={!replyContent.trim()}
                        >
                            Post Answer
                        </Button>
                    </div>
                </Card>
            </FadeIn>
        </div>
    )
}

export default ThreadDetail
