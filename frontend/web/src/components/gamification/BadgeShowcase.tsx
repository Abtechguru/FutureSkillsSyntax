import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Filter } from 'lucide-react'
import { cn } from '@/utils/cn'
import { Badge as BadgeType } from '@/services/gamification'
import gamificationService from '@/services/gamification'
import BadgeCard from './BadgeCard'
import BadgeUnlockAnimation from './BadgeUnlockAnimation'
import Button from '@/components/ui/Button'
import { toast } from 'react-hot-toast'

interface BadgeShowcaseProps {
    className?: string
}

const categories = ['all', 'learning', 'mentorship', 'community', 'streak', 'special']
const tiers = ['all', 'bronze', 'silver', 'gold', 'platinum']

const BadgeShowcase: React.FC<BadgeShowcaseProps> = ({ className }) => {
    const [badges, setBadges] = useState<BadgeType[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [selectedTier, setSelectedTier] = useState('all')
    const [showUnlocked, setShowUnlocked] = useState(false)
    const [selectedBadge, setSelectedBadge] = useState<BadgeType | null>(null)
    const [currentPage, setCurrentPage] = useState(0)
    const badgesPerPage = 8

    useEffect(() => {
        loadBadges()
    }, [])

    const loadBadges = async () => {
        setLoading(true)
        try {
            const data = await gamificationService.getBadges()
            setBadges(data)
        } catch (error) {
            toast.error('Failed to load badges')
        } finally {
            setLoading(false)
        }
    }

    const filteredBadges = badges.filter((badge) => {
        const categoryMatch = selectedCategory === 'all' || badge.category === selectedCategory
        const tierMatch = selectedTier === 'all' || badge.tier === selectedTier
        const unlockedMatch = !showUnlocked || badge.unlockedAt
        return categoryMatch && tierMatch && unlockedMatch
    })

    const totalPages = Math.ceil(filteredBadges.length / badgesPerPage)
    const paginatedBadges = filteredBadges.slice(
        currentPage * badgesPerPage,
        (currentPage + 1) * badgesPerPage
    )

    const unlockedCount = badges.filter((b) => b.unlockedAt).length
    const progress = badges.length > 0 ? (unlockedCount / badges.length) * 100 : 0

    return (
        <div className={cn('space-y-6', className)}>
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Badge Collection
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        {unlockedCount} of {badges.length} badges unlocked
                    </p>
                </div>

                {/* Progress Bar */}
                <div className="w-full md:w-64">
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                        <span>Progress</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-primary via-purple-500 to-pink-500 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                        />
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4">
                {/* Category Filter */}
                <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => {
                                setSelectedCategory(category)
                                setCurrentPage(0)
                            }}
                            className={cn(
                                'px-3 py-1.5 text-sm rounded-md transition-colors capitalize',
                                selectedCategory === category
                                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                            )}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Tier Filter */}
                <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    {tiers.map((tier) => (
                        <button
                            key={tier}
                            onClick={() => {
                                setSelectedTier(tier)
                                setCurrentPage(0)
                            }}
                            className={cn(
                                'px-3 py-1.5 text-sm rounded-md transition-colors capitalize',
                                selectedTier === tier
                                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                            )}
                        >
                            {tier}
                        </button>
                    ))}
                </div>

                {/* Unlocked Toggle */}
                <button
                    onClick={() => {
                        setShowUnlocked(!showUnlocked)
                        setCurrentPage(0)
                    }}
                    className={cn(
                        'flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg transition-colors',
                        showUnlocked
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900'
                    )}
                >
                    <Filter className="w-4 h-4" />
                    Unlocked Only
                </button>
            </div>

            {/* Badge Grid */}
            {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="flex flex-col items-center animate-pulse">
                            <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700" />
                            <div className="w-20 h-4 mt-2 bg-gray-200 dark:bg-gray-700 rounded" />
                        </div>
                    ))}
                </div>
            ) : (
                <AnimatePresence mode="wait">
                    <motion.div
                        key={`${selectedCategory}-${selectedTier}-${showUnlocked}-${currentPage}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-6"
                    >
                        {paginatedBadges.map((badge, index) => (
                            <motion.div
                                key={badge.id}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <BadgeCard
                                    badge={badge}
                                    size="lg"
                                    showProgress
                                    onClick={() => setSelectedBadge(badge)}
                                />
                            </motion.div>
                        ))}
                    </motion.div>
                </AnimatePresence>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4">
                    <Button
                        variant="outline"
                        size="sm"
                        icon={<ChevronLeft />}
                        disabled={currentPage === 0}
                        onClick={() => setCurrentPage((p) => p - 1)}
                    >
                        Previous
                    </Button>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                        Page {currentPage + 1} of {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        icon={<ChevronRight />}
                        iconPosition="right"
                        disabled={currentPage === totalPages - 1}
                        onClick={() => setCurrentPage((p) => p + 1)}
                    >
                        Next
                    </Button>
                </div>
            )}

            {/* Empty State */}
            {!loading && filteredBadges.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400">
                        No badges found matching your filters
                    </p>
                </div>
            )}

            {/* Badge Detail Modal */}
            {selectedBadge && selectedBadge.unlockedAt && (
                <BadgeUnlockAnimation
                    badge={selectedBadge}
                    isVisible={!!selectedBadge}
                    onClose={() => setSelectedBadge(null)}
                    onShare={() => {
                        // Handle share
                        toast.success('Share feature coming soon!')
                    }}
                />
            )}
        </div>
    )
}

export default BadgeShowcase
