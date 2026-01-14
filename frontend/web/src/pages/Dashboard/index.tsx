import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
    TrendingUp,
    Users,
    BookOpen,
    Target,
    Calendar,
    Clock,
    ArrowRight,
    Play,
    Award,
    Zap,
    ChevronRight,
} from 'lucide-react'
import { useSelector } from 'react-redux'

import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { Progress } from '@/components/ui/Progress'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import StatsCard from '@/components/ui/StatsCard'
import FadeIn from '@/components/animations/FadeIn'
import StaggerChildren from '@/components/animations/StaggerChildren'
import { RootState } from '@/store/store'

const Dashboard: React.FC = () => {
    const { user } = useSelector((state: RootState) => state.auth)
    const gamification = useSelector((state: RootState) => state.gamification)

    // Mock data - replace with API calls
    const stats = [
        {
            title: 'Learning Hours',
            value: '42.5',
            previousValue: '38.2',
            icon: BookOpen,
            trend: 'up' as const,
        },
        {
            title: 'Skills Acquired',
            value: '12',
            previousValue: '10',
            icon: Target,
            trend: 'up' as const,
        },
        {
            title: 'Mentorship Sessions',
            value: '8',
            previousValue: '6',
            icon: Users,
            trend: 'up' as const,
        },
        {
            title: 'XP Earned',
            value: gamification?.currentXp || '850',
            previousValue: '720',
            icon: Zap,
            trend: 'up' as const,
        },
    ]

    const upcomingSessions = [
        {
            id: '1',
            title: 'React Best Practices',
            mentor: { name: 'Sarah Chen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
            date: '2026-01-14',
            time: '10:00 AM',
            type: 'video',
        },
        {
            id: '2',
            title: 'Career Path Discussion',
            mentor: { name: 'John Smith', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John' },
            date: '2026-01-15',
            time: '2:00 PM',
            type: 'chat',
        },
    ]

    const learningProgress = [
        { name: 'React Fundamentals', progress: 85, total: 12, completed: 10 },
        { name: 'TypeScript Mastery', progress: 60, total: 15, completed: 9 },
        { name: 'Node.js Backend', progress: 30, total: 20, completed: 6 },
    ]

    const recentActivity = [
        { id: '1', type: 'badge', title: 'Earned "Quick Learner" badge', time: '2 hours ago', icon: Award },
        { id: '2', type: 'session', title: 'Completed mentorship session', time: '5 hours ago', icon: Users },
        { id: '3', type: 'course', title: 'Finished React Module 5', time: '1 day ago', icon: BookOpen },
        { id: '4', type: 'xp', title: 'Earned 50 XP', time: '1 day ago', icon: Zap },
    ]

    const recommendedPaths = [
        {
            id: '1',
            title: 'Frontend Developer',
            match: 92,
            skills: ['React', 'TypeScript', 'CSS'],
            duration: '6 months',
        },
        {
            id: '2',
            title: 'Full Stack Engineer',
            match: 85,
            skills: ['Node.js', 'React', 'PostgreSQL'],
            duration: '9 months',
        },
    ]

    return (
        <div className="space-y-8">
            {/* Welcome Header */}
            <FadeIn>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Welcome back, {user?.firstName || 'Learner'}! 👋
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Here's what's happening with your learning journey
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" as={Link} to="/career/assessment">
                            Take Assessment
                        </Button>
                        <Button variant="primary" icon={<Play />} as={Link} to="/learning">
                            Continue Learning
                        </Button>
                    </div>
                </div>
            </FadeIn>

            {/* Stats Grid */}
            <StaggerChildren staggerDelay={0.1}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                        <StatsCard
                            key={index}
                            title={stat.title}
                            value={stat.value}
                            previousValue={stat.previousValue}
                            icon={<stat.icon className="w-5 h-5" />}
                            trend={stat.trend}
                        />
                    ))}
                </div>
            </StaggerChildren>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - 2/3 width */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Learning Progress */}
                    <FadeIn delay={0.2}>
                        <Card className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Learning Progress
                                </h2>
                                <Link to="/learning" className="text-sm text-primary hover:underline flex items-center gap-1">
                                    View All <ChevronRight className="w-4 h-4" />
                                </Link>
                            </div>
                            <div className="space-y-6">
                                {learningProgress.map((course, index) => (
                                    <div key={index} className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium text-gray-900 dark:text-white">
                                                {course.name}
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                {course.completed}/{course.total} modules
                                            </span>
                                        </div>
                                        <Progress value={course.progress} size="md" showLabel />
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </FadeIn>

                    {/* Upcoming Sessions */}
                    <FadeIn delay={0.3}>
                        <Card className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Upcoming Sessions
                                </h2>
                                <Link to="/mentorship" className="text-sm text-primary hover:underline flex items-center gap-1">
                                    View All <ChevronRight className="w-4 h-4" />
                                </Link>
                            </div>
                            <div className="space-y-4">
                                {upcomingSessions.map((session) => (
                                    <motion.div
                                        key={session.id}
                                        whileHover={{ scale: 1.01 }}
                                        className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary/50 transition-colors"
                                    >
                                        <Avatar src={session.mentor.avatar} alt={session.mentor.name} size="md" />
                                        <div className="flex-1">
                                            <h3 className="font-medium text-gray-900 dark:text-white">
                                                {session.title}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                with {session.mentor.name}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                                                <Calendar className="w-4 h-4" />
                                                {new Date(session.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                            </div>
                                            <div className="flex items-center gap-1 text-sm text-gray-500">
                                                <Clock className="w-4 h-4" />
                                                {session.time}
                                            </div>
                                        </div>
                                        <Button variant="outline" size="sm">
                                            Join
                                        </Button>
                                    </motion.div>
                                ))}
                            </div>
                        </Card>
                    </FadeIn>

                    {/* Recommended Career Paths */}
                    <FadeIn delay={0.4}>
                        <Card className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Recommended Career Paths
                                </h2>
                                <Link to="/career/pathways" className="text-sm text-primary hover:underline flex items-center gap-1">
                                    Explore All <ChevronRight className="w-4 h-4" />
                                </Link>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                {recommendedPaths.map((path) => (
                                    <motion.div
                                        key={path.id}
                                        whileHover={{ scale: 1.02 }}
                                        className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary/50 transition-all cursor-pointer"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <h3 className="font-semibold text-gray-900 dark:text-white">
                                                {path.title}
                                            </h3>
                                            <Badge variant="success">{path.match}% Match</Badge>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {path.skills.map((skill) => (
                                                <Badge key={skill} variant="secondary">{skill}</Badge>
                                            ))}
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-500">{path.duration}</span>
                                            <Button variant="ghost" size="sm" icon={<ArrowRight className="w-4 h-4" />}>
                                                Start Path
                                            </Button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </Card>
                    </FadeIn>
                </div>

                {/* Right Column - 1/3 width */}
                <div className="space-y-6">
                    {/* Recent Activity */}
                    <FadeIn delay={0.3}>
                        <Card className="p-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Recent Activity
                            </h2>
                            <div className="space-y-4">
                                {recentActivity.map((activity) => (
                                    <div key={activity.id} className="flex items-start gap-3">
                                        <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                                            <activity.icon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-900 dark:text-white">
                                                {activity.title}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {activity.time}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </FadeIn>

                    {/* Quick Actions */}
                    <FadeIn delay={0.4}>
                        <Card className="p-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Quick Actions
                            </h2>
                            <div className="space-y-2">
                                <Button variant="outline" fullWidth as={Link} to="/mentorship/find" className="justify-start">
                                    <Users className="w-4 h-4 mr-2" />
                                    Find a Mentor
                                </Button>
                                <Button variant="outline" fullWidth as={Link} to="/career/assessment" className="justify-start">
                                    <Target className="w-4 h-4 mr-2" />
                                    Career Assessment
                                </Button>
                                <Button variant="outline" fullWidth as={Link} to="/learning" className="justify-start">
                                    <BookOpen className="w-4 h-4 mr-2" />
                                    Browse Courses
                                </Button>
                                <Button variant="outline" fullWidth as={Link} to="/leaderboard" className="justify-start">
                                    <TrendingUp className="w-4 h-4 mr-2" />
                                    View Leaderboard
                                </Button>
                            </div>
                        </Card>
                    </FadeIn>

                    {/* Daily Streak */}
                    <FadeIn delay={0.5}>
                        <Card className="p-6 bg-gradient-to-br from-orange-500/10 to-yellow-500/10">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-3 rounded-full bg-orange-500/20">
                                    <Zap className="w-6 h-6 text-orange-500" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white">
                                        7 Day Streak! 🔥
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Keep learning to maintain your streak
                                    </p>
                                </div>
                            </div>
                            <div className="flex justify-between">
                                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                                    <div
                                        key={i}
                                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${i < 7
                                                ? 'bg-orange-500 text-white'
                                                : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                                            }`}
                                    >
                                        {day}
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

export default Dashboard
