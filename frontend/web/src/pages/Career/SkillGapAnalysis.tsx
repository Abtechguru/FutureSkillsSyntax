import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
    ArrowLeft,
    Target,
    Clock,
    BookOpen,
    TrendingUp,
    AlertCircle,
    CheckCircle,
    ArrowRight,
    Download,
    Share2,
    Zap,
} from 'lucide-react'
import { toast } from 'react-hot-toast'

import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Progress } from '@/components/ui/Progress'
import FadeIn from '@/components/animations/FadeIn'
import StaggerChildren from '@/components/animations/StaggerChildren'
import RadarChart from '@/components/charts/RadarChart'
import careerService, { SkillGap } from '@/services/career'
import { cn } from '@/utils/cn'

// Mock data for production
const mockSkillGaps: SkillGap[] = [
    {
        skill: 'React',
        currentLevel: 75,
        requiredLevel: 90,
        gap: 15,
        priority: 'high',
        estimatedTime: '2 weeks',
        resources: [
            { id: 'r1', title: 'Advanced React Patterns', type: 'course', duration: '4h', url: '/learning/path/1' },
            { id: 'r2', title: 'React Performance Guide', type: 'article', duration: '30m', url: '/learning/module/1' },
        ],
    },
    {
        skill: 'TypeScript',
        currentLevel: 60,
        requiredLevel: 85,
        gap: 25,
        priority: 'high',
        estimatedTime: '4 weeks',
        resources: [
            { id: 'r3', title: 'TypeScript Fundamentals', type: 'course', duration: '8h', url: '/learning/path/2' },
            { id: 'r4', title: 'TypeScript with React', type: 'course', duration: '6h', url: '/learning/path/3' },
        ],
    },
    {
        skill: 'Testing',
        currentLevel: 40,
        requiredLevel: 70,
        gap: 30,
        priority: 'medium',
        estimatedTime: '3 weeks',
        resources: [
            { id: 'r5', title: 'Jest & React Testing Library', type: 'course', duration: '5h', url: '/learning/path/4' },
        ],
    },
    {
        skill: 'CSS/Tailwind',
        currentLevel: 85,
        requiredLevel: 85,
        gap: 0,
        priority: 'low',
        estimatedTime: '0 weeks',
        resources: [],
    },
    {
        skill: 'Git',
        currentLevel: 80,
        requiredLevel: 75,
        gap: 0,
        priority: 'low',
        estimatedTime: '0 weeks',
        resources: [],
    },
    {
        skill: 'REST APIs',
        currentLevel: 70,
        requiredLevel: 80,
        gap: 10,
        priority: 'medium',
        estimatedTime: '1 week',
        resources: [
            { id: 'r6', title: 'API Integration Best Practices', type: 'article', duration: '45m', url: '/learning/module/2' },
        ],
    },
]

const priorityColors = {
    low: 'text-gray-500 bg-gray-100 dark:bg-gray-800',
    medium: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30',
    high: 'text-red-600 bg-red-100 dark:bg-red-900/30',
}

const SkillGapAnalysis: React.FC = () => {
    const { roleId } = useParams<{ roleId: string }>()
    const navigate = useNavigate()
    const [skillGaps, setSkillGaps] = useState<SkillGap[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedSkill, setSelectedSkill] = useState<SkillGap | null>(null)

    useEffect(() => {
        loadSkillGaps()
    }, [roleId])

    const loadSkillGaps = async () => {
        setLoading(true)
        try {
            // In production: const data = await careerService.getSkillGapAnalysis(roleId!)
            await new Promise(resolve => setTimeout(resolve, 500))
            setSkillGaps(mockSkillGaps)
        } catch (error) {
            toast.error('Failed to load skill gap analysis')
        } finally {
            setLoading(false)
        }
    }

    // Prepare radar chart data
    const radarCurrentData = skillGaps.map(skill => ({
        label: skill.skill,
        value: skill.currentLevel,
        maxValue: 100,
    }))

    const radarRequiredData = skillGaps.map(skill => ({
        label: skill.skill,
        value: skill.requiredLevel,
        maxValue: 100,
    }))

    // Calculate overall stats
    const totalGaps = skillGaps.filter(s => s.gap > 0).length
    const highPriorityGaps = skillGaps.filter(s => s.priority === 'high').length
    const totalTimeWeeks = skillGaps.reduce((acc, s) => {
        const weeks = parseInt(s.estimatedTime) || 0
        return acc + weeks
    }, 0)
    const overallReadiness = Math.round(
        skillGaps.reduce((acc, s) => acc + (s.currentLevel / s.requiredLevel) * 100, 0) / skillGaps.length
    )

    if (loading) {
        return (
            <div className="animate-pulse space-y-6">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded" />
                    <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Back Button */}
            <Button variant="ghost" icon={<ArrowLeft />} onClick={() => navigate(-1)}>
                Back
            </Button>

            {/* Header */}
            <FadeIn>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Skill Gap Analysis
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Compare your current skills with role requirements
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" icon={<Download />}>
                            Export Report
                        </Button>
                        <Button variant="outline" icon={<Share2 />}>
                            Share
                        </Button>
                    </div>
                </div>
            </FadeIn>

            {/* Stats Overview */}
            <FadeIn delay={0.1}>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <Target className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {overallReadiness}%
                                </div>
                                <div className="text-sm text-gray-500">Overall Readiness</div>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
                                <AlertCircle className="w-5 h-5 text-red-500" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {highPriorityGaps}
                                </div>
                                <div className="text-sm text-gray-500">High Priority Gaps</div>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/30">
                                <BookOpen className="w-5 h-5 text-yellow-500" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {totalGaps}
                                </div>
                                <div className="text-sm text-gray-500">Skills to Improve</div>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                                <Clock className="w-5 h-5 text-green-500" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                    ~{totalTimeWeeks} weeks
                                </div>
                                <div className="text-sm text-gray-500">Estimated Time</div>
                            </div>
                        </div>
                    </Card>
                </div>
            </FadeIn>

            {/* Main Content */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Radar Chart */}
                <FadeIn delay={0.2}>
                    <Card className="p-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Skills Comparison
                        </h2>
                        <div className="flex justify-center">
                            <RadarChart
                                data={radarCurrentData}
                                comparisonData={radarRequiredData}
                                size={350}
                                primaryColor="#4F46E5"
                                secondaryColor="#10B981"
                            />
                        </div>
                        <div className="flex justify-center gap-8 mt-4">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-primary" />
                                <span className="text-sm text-gray-600 dark:text-gray-400">Your Skills</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-green-500" />
                                <span className="text-sm text-gray-600 dark:text-gray-400">Required Level</span>
                            </div>
                        </div>
                    </Card>
                </FadeIn>

                {/* Skill Bars */}
                <FadeIn delay={0.3}>
                    <Card className="p-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Detailed Breakdown
                        </h2>
                        <div className="space-y-4">
                            {skillGaps.map((skill) => (
                                <div
                                    key={skill.skill}
                                    className={cn(
                                        'p-4 rounded-lg border cursor-pointer transition-all',
                                        selectedSkill?.skill === skill.skill
                                            ? 'border-primary bg-primary/5'
                                            : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
                                    )}
                                    onClick={() => setSelectedSkill(skill)}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            {skill.gap === 0 ? (
                                                <CheckCircle className="w-4 h-4 text-green-500" />
                                            ) : (
                                                <AlertCircle className="w-4 h-4 text-orange-500" />
                                            )}
                                            <span className="font-medium text-gray-900 dark:text-white">
                                                {skill.skill}
                                            </span>
                                        </div>
                                        {skill.gap > 0 && (
                                            <Badge className={priorityColors[skill.priority]}>
                                                {skill.priority}
                                            </Badge>
                                        )}
                                    </div>
                                    <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                        <motion.div
                                            className="absolute left-0 top-0 h-full bg-primary rounded-full"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${skill.currentLevel}%` }}
                                            transition={{ duration: 0.8 }}
                                        />
                                        <div
                                            className="absolute top-0 h-full w-0.5 bg-green-500"
                                            style={{ left: `${skill.requiredLevel}%` }}
                                        />
                                    </div>
                                    <div className="flex justify-between mt-1 text-xs text-gray-500">
                                        <span>Current: {skill.currentLevel}%</span>
                                        <span>Required: {skill.requiredLevel}%</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </FadeIn>
            </div>

            {/* Resources Section */}
            <FadeIn delay={0.4}>
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Recommended Learning Path
                        </h2>
                        <Button variant="primary" icon={<Zap />} as={Link} to="/learning">
                            Start Learning
                        </Button>
                    </div>

                    <StaggerChildren staggerDelay={0.1}>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {skillGaps
                                .filter(s => s.resources.length > 0)
                                .sort((a, b) => {
                                    const priorityOrder = { high: 0, medium: 1, low: 2 }
                                    return priorityOrder[a.priority] - priorityOrder[b.priority]
                                })
                                .map((skill) => (
                                    <motion.div
                                        key={skill.skill}
                                        whileHover={{ y: -2 }}
                                        className="p-4 rounded-lg border border-gray-200 dark:border-gray-700"
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <h3 className="font-medium text-gray-900 dark:text-white">
                                                {skill.skill}
                                            </h3>
                                            <Badge className={priorityColors[skill.priority]}>
                                                {skill.priority}
                                            </Badge>
                                        </div>
                                        <div className="space-y-2 mb-4">
                                            {skill.resources.map((resource) => (
                                                <Link
                                                    key={resource.id}
                                                    to={resource.url}
                                                    className="flex items-center justify-between p-2 rounded bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <BookOpen className="w-4 h-4 text-gray-400" />
                                                        <span className="text-sm text-gray-700 dark:text-gray-300">
                                                            {resource.title}
                                                        </span>
                                                    </div>
                                                    <span className="text-xs text-gray-500">{resource.duration}</span>
                                                </Link>
                                            ))}
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-500">Est. time: {skill.estimatedTime}</span>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                icon={<ArrowRight className="w-4 h-4" />}
                                            >
                                                Start
                                            </Button>
                                        </div>
                                    </motion.div>
                                ))}
                        </div>
                    </StaggerChildren>
                </Card>
            </FadeIn>
        </div>
    )
}

export default SkillGapAnalysis
