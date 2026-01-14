import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Search,
    Filter,
    Star,
    Clock,
    Calendar,
    MapPin,
    Briefcase,
    CheckCircle,
    ChevronDown,
    X,
    Users,
    MessageSquare,
    Video,
    DollarSign,
    Globe,
    Award,
    Heart,
} from 'lucide-react'
import { toast } from 'react-hot-toast'

import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Progress } from '@/components/ui/Progress'
import { Avatar } from '@/components/ui/Avatar'
import Modal from '@/components/ui/Modal'
import { Textarea } from '@/components/ui/Textarea'
import FadeIn from '@/components/animations/FadeIn'
import StaggerChildren from '@/components/animations/StaggerChildren'
import mentorshipService, { Mentor, MentorFilters } from '@/services/mentorship'
import { cn } from '@/utils/cn'

const expertiseOptions = [
    'React', 'TypeScript', 'Node.js', 'Python', 'System Design',
    'Cloud/AWS', 'DevOps', 'Machine Learning', 'Mobile', 'Leadership'
]

const availabilityOptions = [
    { value: 'weekday_morning', label: 'Weekday Mornings' },
    { value: 'weekday_evening', label: 'Weekday Evenings' },
    { value: 'weekend', label: 'Weekends' },
]

const MentorMatching: React.FC = () => {
    const navigate = useNavigate()
    const [mentors, setMentors] = useState<Mentor[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [showFilters, setShowFilters] = useState(false)
    const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null)
    const [showRequestModal, setShowRequestModal] = useState(false)
    const [requestMessage, setRequestMessage] = useState('')
    const [selectedGoals, setSelectedGoals] = useState<string[]>([])

    const [filters, setFilters] = useState<MentorFilters>({
        expertise: [],
        rating: 0,
        availability: [],
        priceRange: { min: 0, max: 500 },
        verified: false,
    })

    const goalOptions = [
        'Career transition',
        'Skill development',
        'Interview preparation',
        'Code review',
        'Project guidance',
        'Leadership skills',
    ]

    useEffect(() => {
        loadMentors()
    }, [filters])

    const loadMentors = async () => {
        setLoading(true)
        try {
            const data = await mentorshipService.getMentors(filters)
            setMentors(data)
        } catch (error) {
            toast.error('Failed to load mentors')
        } finally {
            setLoading(false)
        }
    }

    const filteredMentors = mentors.filter(mentor =>
        mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mentor.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mentor.expertise.some(e => e.toLowerCase().includes(searchQuery.toLowerCase()))
    )

    const toggleExpertise = (expertise: string) => {
        setFilters(prev => ({
            ...prev,
            expertise: prev.expertise?.includes(expertise)
                ? prev.expertise.filter(e => e !== expertise)
                : [...(prev.expertise || []), expertise]
        }))
    }

    const handleRequestMentorship = async () => {
        if (!selectedMentor) return

        try {
            await mentorshipService.requestMentorship(
                selectedMentor.id,
                requestMessage,
                selectedGoals
            )
            toast.success('Mentorship request sent!')
            setShowRequestModal(false)
            setRequestMessage('')
            setSelectedGoals([])
            setSelectedMentor(null)
        } catch (error) {
            toast.error('Failed to send request')
        }
    }

    const getMatchColor = (score: number) => {
        if (score >= 90) return 'text-green-500'
        if (score >= 75) return 'text-blue-500'
        if (score >= 60) return 'text-yellow-500'
        return 'text-gray-500'
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <FadeIn>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Find Your Mentor
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Connect with experienced professionals who can guide your journey
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            icon={<Users />}
                            as={Link}
                            to="/mentorship/my-mentors"
                        >
                            My Mentors
                        </Button>
                        <Button
                            variant="outline"
                            icon={<Calendar />}
                            as={Link}
                            to="/mentorship/sessions"
                        >
                            Sessions
                        </Button>
                    </div>
                </div>
            </FadeIn>

            {/* Search and Filters */}
            <FadeIn delay={0.1}>
                <Card className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <Input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by name, title, or expertise..."
                                leftIcon={<Search className="w-4 h-4" />}
                            />
                        </div>
                        <Button
                            variant={showFilters ? 'primary' : 'outline'}
                            icon={<Filter />}
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            Filters {filters.expertise?.length ? `(${filters.expertise.length})` : ''}
                        </Button>
                    </div>

                    {/* Filter Panel */}
                    <AnimatePresence>
                        {showFilters && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
                                    {/* Expertise */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Expertise
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {expertiseOptions.map((expertise) => (
                                                <button
                                                    key={expertise}
                                                    onClick={() => toggleExpertise(expertise)}
                                                    className={cn(
                                                        'px-3 py-1.5 text-sm rounded-full transition-colors',
                                                        filters.expertise?.includes(expertise)
                                                            ? 'bg-primary text-white'
                                                            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                                    )}
                                                >
                                                    {expertise}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Rating & Verified */}
                                    <div className="flex flex-wrap gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Minimum Rating
                                            </label>
                                            <div className="flex gap-2">
                                                {[0, 4, 4.5, 4.8].map((rating) => (
                                                    <button
                                                        key={rating}
                                                        onClick={() => setFilters(prev => ({ ...prev, rating }))}
                                                        className={cn(
                                                            'flex items-center gap-1 px-3 py-1.5 text-sm rounded transition-colors',
                                                            filters.rating === rating
                                                                ? 'bg-primary text-white'
                                                                : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                                                        )}
                                                    >
                                                        {rating === 0 ? 'Any' : (
                                                            <>
                                                                <Star className="w-3 h-3" />
                                                                {rating}+
                                                            </>
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Verified Only
                                            </label>
                                            <button
                                                onClick={() => setFilters(prev => ({ ...prev, verified: !prev.verified }))}
                                                className={cn(
                                                    'flex items-center gap-2 px-3 py-1.5 text-sm rounded transition-colors',
                                                    filters.verified
                                                        ? 'bg-primary text-white'
                                                        : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                                                )}
                                            >
                                                <CheckCircle className="w-4 h-4" />
                                                Verified
                                            </button>
                                        </div>
                                    </div>

                                    {/* Clear Filters */}
                                    <div className="flex justify-end">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setFilters({
                                                expertise: [],
                                                rating: 0,
                                                availability: [],
                                                priceRange: { min: 0, max: 500 },
                                                verified: false,
                                            })}
                                        >
                                            Clear All Filters
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Card>
            </FadeIn>

            {/* Mentor Grid */}
            {loading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Card key={i} className="p-6 animate-pulse">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700" />
                                <div className="flex-1">
                                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                                </div>
                            </div>
                            <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
                            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded" />
                        </Card>
                    ))}
                </div>
            ) : (
                <StaggerChildren staggerDelay={0.05}>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredMentors.map((mentor) => (
                            <motion.div key={mentor.id} whileHover={{ y: -4 }}>
                                <Card className="p-6 h-full flex flex-col">
                                    {/* Header */}
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="relative">
                                            <Avatar src={mentor.avatar} alt={mentor.name} size="lg" />
                                            {mentor.verified && (
                                                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                                    <CheckCircle className="w-4 h-4 text-white" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                                    {mentor.name}
                                                </h3>
                                                {mentor.featured && (
                                                    <Badge variant="warning" className="text-xs">Featured</Badge>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {mentor.title}
                                            </p>
                                            <p className="text-xs text-gray-500">{mentor.company}</p>
                                        </div>
                                        {mentor.matchScore && (
                                            <div className={cn('text-right', getMatchColor(mentor.matchScore))}>
                                                <div className="text-lg font-bold">{mentor.matchScore}%</div>
                                                <div className="text-xs">match</div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Bio */}
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 flex-grow line-clamp-2">
                                        {mentor.bio}
                                    </p>

                                    {/* Expertise Tags */}
                                    <div className="flex flex-wrap gap-1 mb-4">
                                        {mentor.expertise.slice(0, 3).map((skill) => (
                                            <Badge key={skill} variant="secondary" className="text-xs">
                                                {skill}
                                            </Badge>
                                        ))}
                                        {mentor.expertise.length > 3 && (
                                            <Badge variant="secondary" className="text-xs">
                                                +{mentor.expertise.length - 3}
                                            </Badge>
                                        )}
                                    </div>

                                    {/* Stats */}
                                    <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                                        <div className="p-2 rounded bg-gray-50 dark:bg-gray-800/50">
                                            <div className="flex items-center justify-center gap-1 text-yellow-500">
                                                <Star className="w-4 h-4 fill-current" />
                                                <span className="font-semibold">{mentor.rating}</span>
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {mentor.reviewCount} reviews
                                            </div>
                                        </div>
                                        <div className="p-2 rounded bg-gray-50 dark:bg-gray-800/50">
                                            <div className="font-semibold text-gray-900 dark:text-white">
                                                {mentor.sessionCount}
                                            </div>
                                            <div className="text-xs text-gray-500">sessions</div>
                                        </div>
                                        <div className="p-2 rounded bg-gray-50 dark:bg-gray-800/50">
                                            <div className="font-semibold text-gray-900 dark:text-white">
                                                {mentor.responseTime}
                                            </div>
                                            <div className="text-xs text-gray-500">response</div>
                                        </div>
                                    </div>

                                    {/* Price & Actions */}
                                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                                        <div className="flex items-center gap-1 text-gray-900 dark:text-white">
                                            <DollarSign className="w-4 h-4" />
                                            <span className="font-semibold">{mentor.hourlyRate}</span>
                                            <span className="text-sm text-gray-500">/hour</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => navigate(`/mentorship/mentor/${mentor.id}`)}
                                            >
                                                View
                                            </Button>
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                onClick={() => {
                                                    setSelectedMentor(mentor)
                                                    setShowRequestModal(true)
                                                }}
                                            >
                                                Request
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </StaggerChildren>
            )}

            {/* Request Mentorship Modal */}
            <Modal
                isOpen={showRequestModal}
                onClose={() => {
                    setShowRequestModal(false)
                    setSelectedMentor(null)
                }}
                title="Request Mentorship"
            >
                {selectedMentor && (
                    <div className="space-y-6">
                        {/* Mentor Preview */}
                        <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                            <Avatar src={selectedMentor.avatar} alt={selectedMentor.name} size="lg" />
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                    {selectedMentor.name}
                                </h3>
                                <p className="text-sm text-gray-500">{selectedMentor.title}</p>
                            </div>
                        </div>

                        {/* Goals Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                What are your goals? (Select at least one)
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {goalOptions.map((goal) => (
                                    <button
                                        key={goal}
                                        onClick={() => {
                                            setSelectedGoals(prev =>
                                                prev.includes(goal)
                                                    ? prev.filter(g => g !== goal)
                                                    : [...prev, goal]
                                            )
                                        }}
                                        className={cn(
                                            'px-3 py-1.5 text-sm rounded-full transition-colors',
                                            selectedGoals.includes(goal)
                                                ? 'bg-primary text-white'
                                                : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                                        )}
                                    >
                                        {goal}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Message */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Introduce yourself
                            </label>
                            <Textarea
                                value={requestMessage}
                                onChange={(e) => setRequestMessage(e.target.value)}
                                placeholder="Tell the mentor about yourself, your background, and what you hope to achieve..."
                                rows={4}
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                fullWidth
                                onClick={() => {
                                    setShowRequestModal(false)
                                    setSelectedMentor(null)
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="primary"
                                fullWidth
                                onClick={handleRequestMentorship}
                                disabled={selectedGoals.length === 0 || !requestMessage.trim()}
                            >
                                Send Request
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    )
}

export default MentorMatching
