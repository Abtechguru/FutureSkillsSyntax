import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
    Search,
    Filter,
    MessageSquare,
    TrendingUp,
    Clock,
    Tag,
    ChevronRight,
    Plus,
    CheckCircle,
    Pin,
    ArrowUp,
    ArrowDown,
    Eye,
} from 'lucide-react'
import { toast } from 'react-hot-toast'

import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import FadeIn from '@/components/animations/FadeIn'
import StaggerChildren from '@/components/animations/StaggerChildren'
import communityService, { ForumCategory, ForumThread } from '@/services/community'
import { cn } from '@/utils/cn'

const ForumIndex: React.FC = () => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const categoryFilter = searchParams.get('category')

    const [categories, setCategories] = useState<ForumCategory[]>([])
    const [threads, setThreads] = useState<ForumThread[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'unanswered'>('latest')
    const [selectedTags, setSelectedTags] = useState<string[]>([])

    const popularTags = ['javascript', 'react', 'typescript', 'node.js', 'career', 'system-design', 'interview']

    useEffect(() => {
        loadData()
    }, [categoryFilter, sortBy])

    const loadData = async () => {
        setLoading(true)
        try {
            const [categoriesData, threadsData] = await Promise.all([
                communityService.getCategories(),
                communityService.getThreads(categoryFilter || undefined, { sort: sortBy })
            ])
            setCategories(categoriesData)
            setThreads(threadsData.threads)
        } catch (error) {
            toast.error('Failed to load forum data')
        } finally {
            setLoading(false)
        }
    }

    const handleVote = async (threadId: string, vote: 'up' | 'down', e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        try {
            const result = await communityService.voteThread(threadId, vote)
            setThreads(prev => prev.map(t =>
                t.id === threadId
                    ? { ...t, upvotes: result.upvotes, downvotes: result.downvotes, userVote: vote }
                    : t
            ))
        } catch (error) {
            toast.error('Failed to vote')
        }
    }

    const filteredThreads = threads.filter(thread => {
        const matchesSearch = thread.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            thread.content.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesTags = selectedTags.length === 0 ||
            selectedTags.some(tag => thread.tags.includes(tag))
        return matchesSearch && matchesTags
    })

    const toggleTag = (tag: string) => {
        setSelectedTags(prev =>
            prev.includes(tag)
                ? prev.filter(t => t !== tag)
                : [...prev, tag]
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <FadeIn>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Community Forum
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Ask questions, share knowledge, and connect with the community
                        </p>
                    </div>
                    <Button
                        variant="primary"
                        icon={<Plus />}
                        as={Link}
                        to="/community/new-thread"
                    >
                        New Discussion
                    </Button>
                </div>
            </FadeIn>

            <div className="grid lg:grid-cols-4 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-3 space-y-6">
                    {/* Search and Filters */}
                    <FadeIn delay={0.1}>
                        <Card className="p-4">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1">
                                    <Input
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search discussions..."
                                        leftIcon={<Search className="w-4 h-4" />}
                                    />
                                </div>
                                <div className="flex gap-2">
                                    {(['latest', 'popular', 'unanswered'] as const).map((sort) => (
                                        <Button
                                            key={sort}
                                            variant={sortBy === sort ? 'primary' : 'outline'}
                                            size="sm"
                                            onClick={() => setSortBy(sort)}
                                            icon={
                                                sort === 'latest' ? <Clock className="w-4 h-4" /> :
                                                    sort === 'popular' ? <TrendingUp className="w-4 h-4" /> :
                                                        <MessageSquare className="w-4 h-4" />
                                            }
                                        >
                                            {sort.charAt(0).toUpperCase() + sort.slice(1)}
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            {/* Tags Filter */}
                            <div className="mt-4 flex flex-wrap gap-2">
                                {popularTags.map((tag) => (
                                    <button
                                        key={tag}
                                        onClick={() => toggleTag(tag)}
                                        className={cn(
                                            'px-3 py-1 text-sm rounded-full transition-colors',
                                            selectedTags.includes(tag)
                                                ? 'bg-primary text-white'
                                                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                        )}
                                    >
                                        #{tag}
                                    </button>
                                ))}
                            </div>
                        </Card>
                    </FadeIn>

                    {/* Thread List */}
                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <Card key={i} className="p-4 animate-pulse">
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700" />
                                        <div className="flex-1">
                                            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
                                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2" />
                                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <StaggerChildren staggerDelay={0.05}>
                            <div className="space-y-4">
                                {filteredThreads.map((thread) => (
                                    <motion.div key={thread.id} whileHover={{ x: 4 }}>
                                        <Link to={`/community/thread/${thread.id}`}>
                                            <Card className={cn(
                                                'p-4 hover:border-primary/50 transition-colors',
                                                thread.isPinned && 'border-yellow-500/50 bg-yellow-50/50 dark:bg-yellow-900/10'
                                            )}>
                                                <div className="flex gap-4">
                                                    {/* Vote Column */}
                                                    <div className="flex flex-col items-center gap-1">
                                                        <button
                                                            onClick={(e) => handleVote(thread.id, 'up', e)}
                                                            className={cn(
                                                                'p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800',
                                                                thread.userVote === 'up' && 'text-primary'
                                                            )}
                                                        >
                                                            <ArrowUp className="w-5 h-5" />
                                                        </button>
                                                        <span className={cn(
                                                            'font-semibold',
                                                            thread.upvotes - thread.downvotes > 0
                                                                ? 'text-green-500'
                                                                : thread.upvotes - thread.downvotes < 0
                                                                    ? 'text-red-500'
                                                                    : 'text-gray-500'
                                                        )}>
                                                            {thread.upvotes - thread.downvotes}
                                                        </span>
                                                        <button
                                                            onClick={(e) => handleVote(thread.id, 'down', e)}
                                                            className={cn(
                                                                'p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800',
                                                                thread.userVote === 'down' && 'text-red-500'
                                                            )}
                                                        >
                                                            <ArrowDown className="w-5 h-5" />
                                                        </button>
                                                    </div>

                                                    {/* Content */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-start gap-2 mb-2">
                                                            {thread.isPinned && (
                                                                <Pin className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                                                            )}
                                                            {thread.isSolved && (
                                                                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                                            )}
                                                            <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                                                                {thread.title}
                                                            </h3>
                                                        </div>

                                                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                                                            {thread.content}
                                                        </p>

                                                        <div className="flex flex-wrap items-center gap-2 mb-3">
                                                            {thread.tags.map((tag) => (
                                                                <Badge key={tag} variant="secondary" className="text-xs">
                                                                    #{tag}
                                                                </Badge>
                                                            ))}
                                                        </div>

                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <Avatar
                                                                    src={thread.author.avatar}
                                                                    alt={thread.author.name}
                                                                    size="sm"
                                                                />
                                                                <div className="text-sm">
                                                                    <span className="font-medium text-gray-900 dark:text-white">
                                                                        {thread.author.name}
                                                                    </span>
                                                                    {thread.author.reputation >= 1000 && (
                                                                        <Badge variant="warning" className="ml-2 text-xs">
                                                                            {Math.floor(thread.author.reputation / 1000)}k
                                                                        </Badge>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                                                <span className="flex items-center gap-1">
                                                                    <MessageSquare className="w-4 h-4" />
                                                                    {thread.replyCount}
                                                                </span>
                                                                <span className="flex items-center gap-1">
                                                                    <Eye className="w-4 h-4" />
                                                                    {thread.viewCount}
                                                                </span>
                                                                <span>
                                                                    {new Date(thread.createdAt).toLocaleDateString()}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Card>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        </StaggerChildren>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Categories */}
                    <FadeIn delay={0.2}>
                        <Card className="p-4">
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                                Categories
                            </h3>
                            <div className="space-y-2">
                                <Link
                                    to="/community"
                                    className={cn(
                                        'flex items-center justify-between p-2 rounded-lg transition-colors',
                                        !categoryFilter
                                            ? 'bg-primary/10 text-primary'
                                            : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                                    )}
                                >
                                    <span>All Discussions</span>
                                    <ChevronRight className="w-4 h-4" />
                                </Link>
                                {categories.map((category) => (
                                    <Link
                                        key={category.id}
                                        to={`/community?category=${category.slug}`}
                                        className={cn(
                                            'flex items-center justify-between p-2 rounded-lg transition-colors',
                                            categoryFilter === category.slug
                                                ? 'bg-primary/10 text-primary'
                                                : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                                        )}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span>{category.icon}</span>
                                            <span>{category.name}</span>
                                        </div>
                                        <Badge variant="secondary" className="text-xs">
                                            {category.threadCount}
                                        </Badge>
                                    </Link>
                                ))}
                            </div>
                        </Card>
                    </FadeIn>

                    {/* Top Contributors */}
                    <FadeIn delay={0.3}>
                        <Card className="p-4">
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                                Top Contributors
                            </h3>
                            <div className="space-y-3">
                                {[
                                    { name: 'Alex Johnson', reputation: 12450, avatar: 'Alex' },
                                    { name: 'Sarah Chen', reputation: 10200, avatar: 'Sarah' },
                                    { name: 'Mike Wilson', reputation: 8900, avatar: 'Mike' },
                                    { name: 'Emma Davis', reputation: 7500, avatar: 'Emma' },
                                ].map((user, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <span className="text-sm font-medium text-gray-500 w-4">
                                            {i + 1}
                                        </span>
                                        <Avatar
                                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.avatar}`}
                                            alt={user.name}
                                            size="sm"
                                        />
                                        <div className="flex-1">
                                            <div className="font-medium text-gray-900 dark:text-white text-sm">
                                                {user.name}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {user.reputation.toLocaleString()} rep
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </FadeIn>
                </div>
            </div>
        </div>
    )
}

export default ForumIndex
