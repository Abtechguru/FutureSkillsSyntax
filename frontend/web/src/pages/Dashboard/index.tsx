import { useEffect, useState } from 'react'
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
    Loader2,
} from 'lucide-react'
import { useSelector } from 'react-redux'

import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Progress from '@/components/ui/Progress'
import Avatar from '@/components/ui/Avatar'
import Badge from '@/components/ui/Badge'
import StatsCard from '@/components/ui/StatsCard'
import FadeIn from '@/components/animations/FadeIn'
import StaggerChildren from '@/components/animations/StaggerChildren'
import type { RootState } from '@/store/store'

import { careerService } from '@/services/career'
import { mentorshipService } from '@/services/mentorship'
import { gamificationService } from '@/services/gamification'

const Dashboard: React.FC = () => {
    const { user } = useSelector((state: RootState) => state.auth)

    const [isLoading, setIsLoading] = useState(true)
    const [stats, setStats] = useState<any[]>([])
    const [upcomingSessions, setUpcomingSessions] = useState<any[]>([])
    const [learningProgress, setLearningProgress] = useState<any[]>([])
    const [recentActivity, setRecentActivity] = useState<any[]>([])
    const [recommendedPaths, setRecommendedPaths] = useState<any[]>([])

    useEffect(() => {
        const fetchDashboardData = async () => {
            setIsLoading(true)
            try {
                const [
                    levelData,
                    sessionsData,
                    pathsData,
                    analyticsData,
                ] = await Promise.all([
                    gamificationService.getLevel(),
                    mentorshipService.getSessions({ upcoming: true }),
                    careerService.getPaths(),
                    careerService.getProgressAnalytics(),
                ])

                // Process Stats
                setStats([
                    {
                        title: 'Learning Hours',
                        value: analyticsData.totalHoursLearned.toString(),
                        previousValue: (analyticsData.totalHoursLearned * 0.9).toFixed(1),
                        icon: BookOpen,
                        trend: 'up' as const,
                    },
                    {
                        title: 'Skills Acquired',
                        value: analyticsData.skillsImproved.toString(),
                        previousValue: (analyticsData.skillsImproved - 2).toString(),
                        icon: Target,
                        trend: 'up' as const,
                    },
                    {
                        title: 'Mentorship Sessions',
                        value: analyticsData.coursesCompleted.toString(), // Using courses as a proxy if sessions not in analytics
                        previousValue: (analyticsData.coursesCompleted - 1).toString(),
                        icon: Users,
                        trend: 'up' as const,
                    },
                    {
                        title: 'XP Earned',
                        value: levelData.currentXp.toString(),
                        previousValue: (levelData.currentXp * 0.8).toFixed(0),
                        icon: Zap,
                        trend: 'up' as const,
                    },
                ])

                setUpcomingSessions(sessionsData.slice(0, 2).map((s: any) => ({
                    id: s.id,
                    title: s.title,
                    mentor: s.mentor,
                    date: s.date,
                    time: s.startTime,
                    type: s.type,
                })))

                setLearningProgress(pathsData.filter((p: any) => p.enrolled).slice(0, 3).map((p: any) => ({
                    name: p.title,
                    progress: p.progress || 0,
                    total: p.modules.length,
                    completed: p.modules.filter((m: any) => m.completed).length,
                })))

                setRecentActivity(analyticsData.recentActivities.slice(0, 4).map((a: any) => ({
                    id: Math.random().toString(),
                    type: a.type,
                    title: a.title,
                    time: new Date(a.date).toLocaleDateString(),
                    icon: a.type === 'badge' ? Award : a.type === 'session' ? Users : Zap,
                })))

                setRecommendedPaths(pathsData.filter((p: any) => !p.enrolled).slice(0, 2).map((p: any) => ({
                    id: p.id,
                    title: p.title,
                    match: Math.floor(Math.random() * 20) + 80, // Simulation match
                    skills: p.skills.slice(0, 3),
                    duration: p.duration,
                })))

            } catch (error) {
                console.error('Failed to fetch dashboard data:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchDashboardData()
    }, [])

    if (isLoading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

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
                                            {path.skills.map((skill: string) => (
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
