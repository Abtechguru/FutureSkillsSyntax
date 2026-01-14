import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Calendar,
    Clock,
    Video,
    MessageSquare,
    Star,
    Search,
    Filter,
    ChevronLeft,
    ChevronRight,
    X,
    Send,
    Phone,
    User,
    MapPin,
    Briefcase,
    Award,
} from 'lucide-react'

import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { Avatar, AvatarGroup } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import Modal from '@/components/ui/Modal'
import { Progress } from '@/components/ui/Progress'
import FadeIn from '@/components/animations/FadeIn'
import StaggerChildren from '@/components/animations/StaggerChildren'
import { cn } from '@/utils/cn'

interface Mentor {
    id: string
    name: string
    avatar: string
    title: string
    company: string
    skills: string[]
    rating: number
    sessions: number
    location: string
    bio: string
}

interface Session {
    id: string
    title: string
    mentor: { name: string; avatar: string }
    date: string
    time: string
    duration: number
    type: 'video' | 'chat' | 'phone'
    status: 'upcoming' | 'completed' | 'cancelled'
    notes?: string
}

const MentorshipDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'mentors' | 'sessions' | 'calendar'>('mentors')
    const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null)
    const [selectedSession, setSelectedSession] = useState<Session | null>(null)
    const [showFeedbackModal, setShowFeedbackModal] = useState(false)
    const [feedbackRating, setFeedbackRating] = useState(0)
    const [feedbackText, setFeedbackText] = useState('')
    const [searchQuery, setSearchQuery] = useState('')
    const [currentMonth, setCurrentMonth] = useState(new Date())

    // Mock data
    const mentors: Mentor[] = [
        {
            id: '1',
            name: 'Sarah Chen',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
            title: 'Senior Software Engineer',
            company: 'Google',
            skills: ['React', 'TypeScript', 'System Design'],
            rating: 4.9,
            sessions: 128,
            location: 'San Francisco, CA',
            bio: 'Passionate about helping new developers grow and succeed in tech.',
        },
        {
            id: '2',
            name: 'John Smith',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
            title: 'Engineering Manager',
            company: 'Microsoft',
            skills: ['Leadership', 'Career Growth', 'Node.js'],
            rating: 4.8,
            sessions: 95,
            location: 'Seattle, WA',
            bio: 'Helping engineers transition into leadership roles.',
        },
        {
            id: '3',
            name: 'Maria Garcia',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
            title: 'Frontend Lead',
            company: 'Netflix',
            skills: ['React', 'Performance', 'CSS'],
            rating: 4.7,
            sessions: 72,
            location: 'Los Angeles, CA',
            bio: 'Building beautiful, performant user interfaces.',
        },
    ]

    const sessions: Session[] = [
        {
            id: '1',
            title: 'React Best Practices',
            mentor: { name: 'Sarah Chen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
            date: '2026-01-14',
            time: '10:00 AM',
            duration: 60,
            type: 'video',
            status: 'upcoming',
        },
        {
            id: '2',
            title: 'Career Path Discussion',
            mentor: { name: 'John Smith', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John' },
            date: '2026-01-15',
            time: '2:00 PM',
            duration: 45,
            type: 'chat',
            status: 'upcoming',
        },
        {
            id: '3',
            title: 'Code Review Session',
            mentor: { name: 'Sarah Chen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
            date: '2026-01-10',
            time: '11:00 AM',
            duration: 60,
            type: 'video',
            status: 'completed',
            notes: 'Great session! Learned about clean code principles.',
        },
    ]

    const progressStats = {
        totalSessions: 12,
        hoursLearned: 18,
        goalsCompleted: 5,
        totalGoals: 8,
    }

    const tabs = [
        { id: 'mentors', label: 'Find Mentors', icon: User },
        { id: 'sessions', label: 'My Sessions', icon: Calendar },
        { id: 'calendar', label: 'Calendar', icon: Clock },
    ]

    const getSessionTypeIcon = (type: Session['type']) => {
        switch (type) {
            case 'video': return <Video className="w-4 h-4" />
            case 'chat': return <MessageSquare className="w-4 h-4" />
            case 'phone': return <Phone className="w-4 h-4" />
        }
    }

    const getCalendarDays = () => {
        const year = currentMonth.getFullYear()
        const month = currentMonth.getMonth()
        const firstDay = new Date(year, month, 1).getDay()
        const daysInMonth = new Date(year, month + 1, 0).getDate()
        const days = []

        // Empty cells for days before first day of month
        for (let i = 0; i < firstDay; i++) {
            days.push(null)
        }

        // Days of the month
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(i)
        }

        return days
    }

    const getSessionsForDay = (day: number | null) => {
        if (!day) return []
        const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
        return sessions.filter(s => s.date === dateStr)
    }

    const handleSubmitFeedback = () => {
        // TODO: API call
        setShowFeedbackModal(false)
        setFeedbackRating(0)
        setFeedbackText('')
    }

    return (
        <div className="space-y-6">
            {/* Header with Stats */}
            <FadeIn>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="p-4">
                        <div className="text-2xl font-bold text-primary">{progressStats.totalSessions}</div>
                        <div className="text-sm text-gray-500">Total Sessions</div>
                    </Card>
                    <Card className="p-4">
                        <div className="text-2xl font-bold text-secondary">{progressStats.hoursLearned}h</div>
                        <div className="text-sm text-gray-500">Hours Learned</div>
                    </Card>
                    <Card className="p-4">
                        <div className="text-2xl font-bold text-green-500">{progressStats.goalsCompleted}</div>
                        <div className="text-sm text-gray-500">Goals Completed</div>
                    </Card>
                    <Card className="p-4">
                        <div className="mb-1 text-sm text-gray-500">Overall Progress</div>
                        <Progress value={(progressStats.goalsCompleted / progressStats.totalGoals) * 100} size="sm" />
                        <div className="text-xs text-gray-400 mt-1">
                            {progressStats.goalsCompleted}/{progressStats.totalGoals} goals
                        </div>
                    </Card>
                </div>
            </FadeIn>

            {/* Tabs */}
            <FadeIn delay={0.1}>
                <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-x-auto">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as typeof activeTab)}
                            className={cn(
                                'flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all',
                                activeTab === tab.id
                                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                            )}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </FadeIn>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
                {/* Find Mentors Tab */}
                {activeTab === 'mentors' && (
                    <motion.div
                        key="mentors"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-6"
                    >
                        {/* Search and Filters */}
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <Input
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search mentors by name, skill, or company..."
                                    leftIcon={<Search className="w-4 h-4" />}
                                />
                            </div>
                            <Button variant="outline" icon={<Filter />}>
                                Filters
                            </Button>
                        </div>

                        {/* Mentor Cards */}
                        <StaggerChildren staggerDelay={0.1}>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {mentors.map((mentor) => (
                                    <motion.div key={mentor.id} whileHover={{ y: -4 }}>
                                        <Card className="p-6">
                                            <div className="flex items-start gap-4 mb-4">
                                                <Avatar src={mentor.avatar} alt={mentor.name} size="lg" />
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-gray-900 dark:text-white">
                                                        {mentor.name}
                                                    </h3>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        {mentor.title}
                                                    </p>
                                                    <p className="text-sm text-gray-500">{mentor.company}</p>
                                                </div>
                                                <div className="flex items-center gap-1 text-yellow-500">
                                                    <Star className="w-4 h-4 fill-current" />
                                                    <span className="font-medium">{mentor.rating}</span>
                                                </div>
                                            </div>

                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                                {mentor.bio}
                                            </p>

                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {mentor.skills.map((skill) => (
                                                    <Badge key={skill} variant="secondary">{skill}</Badge>
                                                ))}
                                            </div>

                                            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="w-4 h-4" />
                                                    {mentor.location}
                                                </span>
                                                <span>{mentor.sessions} sessions</span>
                                            </div>

                                            <Button
                                                variant="primary"
                                                fullWidth
                                                onClick={() => setSelectedMentor(mentor)}
                                            >
                                                Book Session
                                            </Button>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        </StaggerChildren>
                    </motion.div>
                )}

                {/* My Sessions Tab */}
                {activeTab === 'sessions' && (
                    <motion.div
                        key="sessions"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-6"
                    >
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Upcoming Sessions */}
                            <Card className="p-6">
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                                    Upcoming Sessions
                                </h3>
                                <div className="space-y-4">
                                    {sessions.filter(s => s.status === 'upcoming').map((session) => (
                                        <div
                                            key={session.id}
                                            className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary/50 cursor-pointer transition-colors"
                                            onClick={() => setSelectedSession(session)}
                                        >
                                            <Avatar src={session.mentor.avatar} alt={session.mentor.name} />
                                            <div className="flex-1">
                                                <h4 className="font-medium text-gray-900 dark:text-white">
                                                    {session.title}
                                                </h4>
                                                <p className="text-sm text-gray-500">
                                                    {session.mentor.name}
                                                </p>
                                            </div>
                                            <div className="text-right text-sm">
                                                <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                                                    <Calendar className="w-4 h-4" />
                                                    {new Date(session.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                </div>
                                                <div className="flex items-center gap-1 text-gray-500">
                                                    {getSessionTypeIcon(session.type)}
                                                    {session.time}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>

                            {/* Past Sessions */}
                            <Card className="p-6">
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                                    Past Sessions
                                </h3>
                                <div className="space-y-4">
                                    {sessions.filter(s => s.status === 'completed').map((session) => (
                                        <div
                                            key={session.id}
                                            className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50"
                                        >
                                            <Avatar src={session.mentor.avatar} alt={session.mentor.name} />
                                            <div className="flex-1">
                                                <h4 className="font-medium text-gray-900 dark:text-white">
                                                    {session.title}
                                                </h4>
                                                <p className="text-sm text-gray-500">
                                                    {new Date(session.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                </p>
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    setSelectedSession(session)
                                                    setShowFeedbackModal(true)
                                                }}
                                            >
                                                Feedback
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>
                    </motion.div>
                )}

                {/* Calendar Tab */}
                {activeTab === 'calendar' && (
                    <motion.div
                        key="calendar"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        <Card className="p-6">
                            {/* Calendar Header */}
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                </h2>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        icon={<ChevronLeft />}
                                        onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                                    />
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentMonth(new Date())}
                                    >
                                        Today
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        icon={<ChevronRight />}
                                        onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                                    />
                                </div>
                            </div>

                            {/* Calendar Grid */}
                            <div className="grid grid-cols-7 gap-1">
                                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                                    <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                                        {day}
                                    </div>
                                ))}
                                {getCalendarDays().map((day, index) => {
                                    const daySessions = getSessionsForDay(day)
                                    const isToday = day === new Date().getDate() &&
                                        currentMonth.getMonth() === new Date().getMonth() &&
                                        currentMonth.getFullYear() === new Date().getFullYear()
                                    return (
                                        <div
                                            key={index}
                                            className={cn(
                                                'min-h-24 p-2 rounded-lg border border-gray-100 dark:border-gray-800',
                                                day ? 'cursor-pointer hover:border-primary/50' : '',
                                                isToday && 'bg-primary/5 border-primary'
                                            )}
                                        >
                                            {day && (
                                                <>
                                                    <div className={cn(
                                                        'text-sm font-medium mb-1',
                                                        isToday ? 'text-primary' : 'text-gray-900 dark:text-white'
                                                    )}>
                                                        {day}
                                                    </div>
                                                    {daySessions.map((session) => (
                                                        <div
                                                            key={session.id}
                                                            className="text-xs p-1 mb-1 rounded bg-primary/10 text-primary truncate"
                                                            onClick={() => setSelectedSession(session)}
                                                        >
                                                            {session.time} - {session.title}
                                                        </div>
                                                    ))}
                                                </>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Session Details Modal */}
            <Modal
                isOpen={!!selectedSession && !showFeedbackModal}
                onClose={() => setSelectedSession(null)}
                title="Session Details"
            >
                {selectedSession && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <Avatar src={selectedSession.mentor.avatar} alt={selectedSession.mentor.name} size="lg" />
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {selectedSession.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    with {selectedSession.mentor.name}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                <Calendar className="w-5 h-5" />
                                {new Date(selectedSession.date).toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </div>
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                <Clock className="w-5 h-5" />
                                {selectedSession.time} ({selectedSession.duration} min)
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {getSessionTypeIcon(selectedSession.type)}
                            <span className="text-gray-600 dark:text-gray-400 capitalize">
                                {selectedSession.type} session
                            </span>
                        </div>

                        {selectedSession.status === 'upcoming' && (
                            <div className="flex gap-3">
                                <Button variant="primary" fullWidth icon={<Video />}>
                                    Join Session
                                </Button>
                                <Button variant="outline">Reschedule</Button>
                            </div>
                        )}
                    </div>
                )}
            </Modal>

            {/* Feedback Modal */}
            <Modal
                isOpen={showFeedbackModal}
                onClose={() => setShowFeedbackModal(false)}
                title="Session Feedback"
            >
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            How was your session?
                        </label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((rating) => (
                                <button
                                    key={rating}
                                    onClick={() => setFeedbackRating(rating)}
                                    className={cn(
                                        'p-2 rounded-lg transition-all',
                                        feedbackRating >= rating
                                            ? 'text-yellow-500'
                                            : 'text-gray-300 hover:text-yellow-400'
                                    )}
                                >
                                    <Star className="w-8 h-8 fill-current" />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Share your thoughts (optional)
                        </label>
                        <Textarea
                            value={feedbackText}
                            onChange={(e) => setFeedbackText(e.target.value)}
                            placeholder="What did you learn? Any suggestions for improvement?"
                            rows={4}
                        />
                    </div>

                    <Button
                        variant="primary"
                        fullWidth
                        onClick={handleSubmitFeedback}
                        disabled={feedbackRating === 0}
                    >
                        Submit Feedback
                    </Button>
                </div>
            </Modal>

            {/* Mentor Details Modal */}
            <Modal
                isOpen={!!selectedMentor}
                onClose={() => setSelectedMentor(null)}
                title="Book a Session"
            >
                {selectedMentor && (
                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <Avatar src={selectedMentor.avatar} alt={selectedMentor.name} size="xl" />
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    {selectedMentor.name}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {selectedMentor.title} at {selectedMentor.company}
                                </p>
                                <div className="flex items-center gap-1 text-yellow-500 mt-1">
                                    <Star className="w-4 h-4 fill-current" />
                                    <span>{selectedMentor.rating}</span>
                                    <span className="text-gray-400">({selectedMentor.sessions} sessions)</span>
                                </div>
                            </div>
                        </div>

                        <p className="text-gray-600 dark:text-gray-400">
                            {selectedMentor.bio}
                        </p>

                        <div>
                            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                                Select Session Type
                            </h4>
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { type: 'video', icon: Video, label: 'Video Call' },
                                    { type: 'chat', icon: MessageSquare, label: 'Chat' },
                                    { type: 'phone', icon: Phone, label: 'Phone' },
                                ].map((option) => (
                                    <button
                                        key={option.type}
                                        className="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary transition-colors"
                                    >
                                        <option.icon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                                        <span className="text-sm">{option.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <Button variant="primary" fullWidth>
                            Continue to Scheduling
                        </Button>
                    </div>
                )}
            </Modal>
        </div>
    )
}

export default MentorshipDashboard
