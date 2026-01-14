import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
    TrendingUp,
    Clock,
    Award,
    BookOpen,
    Target,
    Calendar,
    Share2,
    Download,
    ChevronRight,
    Zap,
    Star,
} from 'lucide-react'

import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Progress } from '@/components/ui/Progress'
import { Avatar } from '@/components/ui/Avatar'
import FadeIn from '@/components/animations/FadeIn'
import StaggerChildren from '@/components/animations/StaggerChildren'
import { cn } from '@/utils/cn'

// Mock analytics data
const analyticsData = {
    totalHoursLearned: 42.5,
    coursesCompleted: 3,
    coursesInProgress: 2,
    certificatesEarned: 3,
    skillsImproved: 8,
    currentStreak: 14,
    longestStreak: 21,
    totalXp: 2450,
    level: 12,
    weeklyProgress: [
        { week: 'Week 1', hours: 6.5 },
        { week: 'Week 2', hours: 8.2 },
        { week: 'Week 3', hours: 5.0 },
        { week: 'Week 4', hours: 7.8 },
        { week: 'Week 5', hours: 4.5 },
        { week: 'Week 6', hours: 6.0 },
        { week: 'This Week', hours: 4.5 },
    ],
    skillProgress: [
        { skill: 'React', before: 40, after: 75 },
        { skill: 'TypeScript', before: 20, after: 60 },
        { skill: 'Node.js', before: 30, after: 55 },
        { skill: 'CSS', before: 60, after: 85 },
        { skill: 'Testing', before: 10, after: 45 },
    ],
    recentActivities: [
        { date: '2026-01-13', type: 'course', title: 'Completed React Hooks Module', xpEarned: 50 },
        { date: '2026-01-12', type: 'quiz', title: 'Passed TypeScript Quiz (95%)', xpEarned: 30 },
        { date: '2026-01-11', type: 'badge', title: 'Earned "Quick Learner" badge', xpEarned: 100 },
        { date: '2026-01-10', type: 'exercise', title: 'Completed Performance Exercise', xpEarned: 25 },
        { date: '2026-01-09', type: 'course', title: 'Started System Design Course', xpEarned: 10 },
    ],
    certificates: [
        { id: '1', title: 'React Fundamentals', date: '2026-01-01', issuer: 'FutureSkillsSyntax' },
        { id: '2', title: 'JavaScript Mastery', date: '2025-12-15', issuer: 'FutureSkillsSyntax' },
        { id: '3', title: 'CSS Advanced', date: '2025-11-28', issuer: 'FutureSkillsSyntax' },
    ],
    monthlyGoal: { target: 50, current: 42.5 },
}

const ProgressAnalytics: React.FC = () => {
    const [selectedTimeRange, setSelectedTimeRange] = useState<'week' | 'month' | 'year'>('month')

    const maxWeeklyHours = Math.max(...analyticsData.weeklyProgress.map(w => w.hours))

    return (
        <div className="space-y-6">
            {/* Header */}
            <FadeIn>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Progress Analytics
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Track your learning journey and skill improvements
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" icon={<Download />}>
                            Export Report
                        </Button>
                        <Button variant="outline" icon={<Share2 />}>
                            Share Progress
                        </Button>
                    </div>
                </div>
            </FadeIn>

            {/* Time Range Toggle */}
            <FadeIn delay={0.05}>
                <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg w-fit">
                    {(['week', 'month', 'year'] as const).map((range) => (
                        <button
                            key={range}
                            onClick={() => setSelectedTimeRange(range)}
                            className={cn(
                                'px-4 py-2 text-sm font-medium rounded-md transition-all capitalize',
                                selectedTimeRange === range
                                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                            )}
                        >
                            This {range}
                        </button>
                    ))}
                </div>
            </FadeIn>

            {/* Stats Overview */}
            <StaggerChildren staggerDelay={0.05}>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    <Card className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                                <Clock className="w-5 h-5 text-blue-500" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {analyticsData.totalHoursLearned}h
                                </div>
                                <div className="text-xs text-gray-500">Hours Learned</div>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                                <BookOpen className="w-5 h-5 text-green-500" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {analyticsData.coursesCompleted}
                                </div>
                                <div className="text-xs text-gray-500">Courses Done</div>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/30">
                                <Award className="w-5 h-5 text-yellow-500" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {analyticsData.certificatesEarned}
                                </div>
                                <div className="text-xs text-gray-500">Certificates</div>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                                <Target className="w-5 h-5 text-purple-500" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {analyticsData.skillsImproved}
                                </div>
                                <div className="text-xs text-gray-500">Skills Improved</div>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                                <Zap className="w-5 h-5 text-orange-500" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {analyticsData.currentStreak}
                                </div>
                                <div className="text-xs text-gray-500">Day Streak 🔥</div>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <Star className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {analyticsData.totalXp}
                                </div>
                                <div className="text-xs text-gray-500">Total XP</div>
                            </div>
                        </div>
                    </Card>
                </div>
            </StaggerChildren>

            {/* Charts Row */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Weekly Activity Chart */}
                <FadeIn delay={0.2}>
                    <Card className="p-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                            Weekly Learning Activity
                        </h2>
                        <div className="flex items-end justify-between h-48 gap-2">
                            {analyticsData.weeklyProgress.map((week, index) => (
                                <div key={week.week} className="flex-1 flex flex-col items-center">
                                    <motion.div
                                        className="w-full bg-primary rounded-t-md"
                                        initial={{ height: 0 }}
                                        animate={{ height: `${(week.hours / maxWeeklyHours) * 100}%` }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                    />
                                    <span className="text-xs text-gray-500 mt-2 whitespace-nowrap">
                                        {week.week.replace('Week ', 'W')}
                                    </span>
                                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                        {week.hours}h
                                    </span>
                                </div>
                            ))}
                        </div>
                    </Card>
                </FadeIn>

                {/* Monthly Goal */}
                <FadeIn delay={0.25}>
                    <Card className="p-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Monthly Goal Progress
                        </h2>
                        <div className="flex items-center justify-center mb-6">
                            <div className="relative w-40 h-40">
                                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r="40"
                                        stroke="currentColor"
                                        strokeWidth="8"
                                        fill="none"
                                        className="text-gray-200 dark:text-gray-700"
                                    />
                                    <motion.circle
                                        cx="50"
                                        cy="50"
                                        r="40"
                                        stroke="currentColor"
                                        strokeWidth="8"
                                        fill="none"
                                        strokeLinecap="round"
                                        className="text-primary"
                                        initial={{ strokeDasharray: '0 251' }}
                                        animate={{
                                            strokeDasharray: `${(analyticsData.monthlyGoal.current / analyticsData.monthlyGoal.target) * 251} 251`,
                                        }}
                                        transition={{ duration: 1 }}
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
                                        {Math.round((analyticsData.monthlyGoal.current / analyticsData.monthlyGoal.target) * 100)}%
                                    </span>
                                    <span className="text-sm text-gray-500">Complete</span>
                                </div>
                            </div>
                        </div>
                        <div className="text-center">
                            <p className="text-gray-600 dark:text-gray-400">
                                <span className="font-semibold text-gray-900 dark:text-white">
                                    {analyticsData.monthlyGoal.current}h
                                </span>
                                {' '}of{' '}
                                <span className="font-semibold text-gray-900 dark:text-white">
                                    {analyticsData.monthlyGoal.target}h
                                </span>
                                {' '}goal
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                                {analyticsData.monthlyGoal.target - analyticsData.monthlyGoal.current}h remaining this month
                            </p>
                        </div>
                    </Card>
                </FadeIn>
            </div>

            {/* Skill Improvement */}
            <FadeIn delay={0.3}>
                <Card className="p-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                        Skill Improvement
                    </h2>
                    <div className="space-y-4">
                        {analyticsData.skillProgress.map((skill, index) => (
                            <div key={skill.skill} className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="font-medium text-gray-900 dark:text-white">
                                        {skill.skill}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-500">
                                            {skill.before}%
                                        </span>
                                        <TrendingUp className="w-4 h-4 text-green-500" />
                                        <span className="text-sm font-medium text-green-500">
                                            {skill.after}%
                                        </span>
                                        <Badge variant="success" className="text-xs">
                                            +{skill.after - skill.before}%
                                        </Badge>
                                    </div>
                                </div>
                                <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <motion.div
                                        className="absolute left-0 top-0 h-full bg-gray-400 rounded-full"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${skill.before}%` }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                    />
                                    <motion.div
                                        className="absolute left-0 top-0 h-full bg-primary rounded-full"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${skill.after}%` }}
                                        transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </FadeIn>

            {/* Recent Activity & Certificates */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Recent Activity */}
                <FadeIn delay={0.35}>
                    <Card className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Recent Activity
                            </h2>
                            <Button variant="ghost" size="sm" as={Link} to="/activity">
                                View All <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                        </div>
                        <div className="space-y-3">
                            {analyticsData.recentActivities.map((activity, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50"
                                >
                                    <div className={cn(
                                        'p-2 rounded-lg',
                                        activity.type === 'course' && 'bg-blue-100 dark:bg-blue-900/30',
                                        activity.type === 'quiz' && 'bg-green-100 dark:bg-green-900/30',
                                        activity.type === 'badge' && 'bg-yellow-100 dark:bg-yellow-900/30',
                                        activity.type === 'exercise' && 'bg-purple-100 dark:bg-purple-900/30',
                                    )}>
                                        {activity.type === 'course' && <BookOpen className="w-4 h-4 text-blue-500" />}
                                        {activity.type === 'quiz' && <Target className="w-4 h-4 text-green-500" />}
                                        {activity.type === 'badge' && <Award className="w-4 h-4 text-yellow-500" />}
                                        {activity.type === 'exercise' && <Zap className="w-4 h-4 text-purple-500" />}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {activity.title}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {new Date(activity.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                        </p>
                                    </div>
                                    <Badge variant="success" className="text-xs">
                                        +{activity.xpEarned} XP
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </Card>
                </FadeIn>

                {/* Certificates */}
                <FadeIn delay={0.4}>
                    <Card className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Earned Certificates
                            </h2>
                            <Badge>{analyticsData.certificates.length}</Badge>
                        </div>
                        <div className="space-y-3">
                            {analyticsData.certificates.map((cert) => (
                                <div
                                    key={cert.id}
                                    className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary/50 transition-colors cursor-pointer"
                                >
                                    <div className="p-3 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10">
                                        <Award className="w-6 h-6 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-medium text-gray-900 dark:text-white">
                                            {cert.title}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            {cert.issuer} • {new Date(cert.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                        </p>
                                    </div>
                                    <Button variant="outline" size="sm" icon={<Download className="w-4 h-4" />}>
                                        PDF
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </Card>
                </FadeIn>
            </div>
        </div>
    )
}

export default ProgressAnalytics
