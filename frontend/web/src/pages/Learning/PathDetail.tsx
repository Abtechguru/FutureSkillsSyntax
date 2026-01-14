import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
    ArrowLeft,
    Play,
    Clock,
    Star,
    Users,
    Award,
    BookOpen,
    CheckCircle,
    Lock,
    FileText,
    Video,
    Code,
    HelpCircle,
    Download,
    Share2,
    ChevronDown,
    ChevronRight,
} from 'lucide-react'
import { toast } from 'react-hot-toast'

import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Progress } from '@/components/ui/Progress'
import { Avatar } from '@/components/ui/Avatar'
import Modal from '@/components/ui/Modal'
import FadeIn from '@/components/animations/FadeIn'
import careerService, { LearningPath, LearningModule } from '@/services/career'
import { cn } from '@/utils/cn'

const moduleTypeIcons = {
    video: Video,
    article: FileText,
    exercise: Code,
    quiz: HelpCircle,
    project: Code,
}

const moduleTypeColors = {
    video: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30',
    article: 'bg-green-100 text-green-600 dark:bg-green-900/30',
    exercise: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30',
    quiz: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30',
    project: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30',
}

// Mock data with full modules
const mockPathData: LearningPath & { modules: LearningModule[] } = {
    id: '1',
    title: 'React Mastery',
    description: 'Master React from fundamentals to advanced patterns including hooks, context, and performance optimization. Learn to build production-ready applications with best practices.',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
    category: 'Frontend',
    difficulty: 'intermediate',
    duration: '40 hours',
    durationHours: 40,
    skills: ['React', 'Hooks', 'Context', 'Redux', 'Performance'],
    enrolledCount: 12450,
    rating: 4.8,
    ratingCount: 2341,
    instructor: {
        name: 'Sarah Chen',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
        title: 'Senior Engineer @ Google',
    },
    certificate: true,
    price: 0,
    enrolled: true,
    progress: 65,
    modules: [
        {
            id: 'm1',
            title: 'Introduction to React',
            description: 'Learn the fundamentals of React including JSX, components, and props.',
            type: 'video',
            duration: '45 min',
            durationMinutes: 45,
            order: 1,
            completed: true,
            locked: false,
            resources: [
                { type: 'video', title: 'React Basics Overview', url: '/video/1', duration: '20 min' },
                { type: 'article', title: 'Understanding JSX', url: '/article/1' },
                { type: 'download', title: 'Starter Code', url: '/download/1' },
            ],
        },
        {
            id: 'm2',
            title: 'React Hooks Deep Dive',
            description: 'Master useState, useEffect, and custom hooks.',
            type: 'video',
            duration: '1h 30min',
            durationMinutes: 90,
            order: 2,
            completed: true,
            locked: false,
            resources: [
                { type: 'video', title: 'useState & useEffect', url: '/video/2', duration: '45 min' },
                { type: 'video', title: 'Custom Hooks', url: '/video/3', duration: '45 min' },
                { type: 'article', title: 'Hooks Best Practices', url: '/article/2' },
            ],
        },
        {
            id: 'm3',
            title: 'State Management',
            description: 'Learn Context API and Redux for state management.',
            type: 'video',
            duration: '2h',
            durationMinutes: 120,
            order: 3,
            completed: true,
            locked: false,
            resources: [
                { type: 'video', title: 'Context API Fundamentals', url: '/video/4', duration: '1h' },
                { type: 'video', title: 'Redux Essentials', url: '/video/5', duration: '1h' },
            ],
        },
        {
            id: 'm4',
            title: 'Hooks Practice',
            description: 'Build a todo app using React hooks.',
            type: 'exercise',
            duration: '1h',
            durationMinutes: 60,
            order: 4,
            completed: true,
            locked: false,
            resources: [
                { type: 'download', title: 'Exercise Files', url: '/download/2' },
                { type: 'link', title: 'Solution Code', url: '/solution/1' },
            ],
        },
        {
            id: 'm5',
            title: 'React Fundamentals Quiz',
            description: 'Test your knowledge of React basics and hooks.',
            type: 'quiz',
            duration: '30 min',
            durationMinutes: 30,
            order: 5,
            completed: true,
            locked: false,
            resources: [],
            quiz: {
                questions: 20,
                passingScore: 80,
                attempts: 2,
                bestScore: 95,
            },
        },
        {
            id: 'm6',
            title: 'Performance Optimization',
            description: 'Learn React.memo, useMemo, useCallback and other performance techniques.',
            type: 'video',
            duration: '1h 45min',
            durationMinutes: 105,
            order: 6,
            completed: false,
            locked: false,
            resources: [
                { type: 'video', title: 'React Performance Basics', url: '/video/6', duration: '45 min' },
                { type: 'video', title: 'Advanced Optimization', url: '/video/7', duration: '1h' },
            ],
        },
        {
            id: 'm7',
            title: 'Testing React Apps',
            description: 'Write tests with Jest and React Testing Library.',
            type: 'video',
            duration: '2h',
            durationMinutes: 120,
            order: 7,
            completed: false,
            locked: false,
            resources: [
                { type: 'video', title: 'Jest Fundamentals', url: '/video/8', duration: '1h' },
                { type: 'video', title: 'React Testing Library', url: '/video/9', duration: '1h' },
            ],
        },
        {
            id: 'm8',
            title: 'Final Project',
            description: 'Build a complete React application from scratch.',
            type: 'project',
            duration: '5h',
            durationMinutes: 300,
            order: 8,
            completed: false,
            locked: true,
            resources: [
                { type: 'download', title: 'Project Requirements', url: '/download/3' },
                { type: 'article', title: 'Project Guidelines', url: '/article/3' },
            ],
        },
    ],
}

const PathDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const [path, setPath] = useState<LearningPath & { modules: LearningModule[] } | null>(null)
    const [loading, setLoading] = useState(true)
    const [expandedModules, setExpandedModules] = useState<string[]>([])
    const [showCertificatePreview, setShowCertificatePreview] = useState(false)

    useEffect(() => {
        loadPath()
    }, [id])

    const loadPath = async () => {
        setLoading(true)
        try {
            // In production: const data = await careerService.getPath(id!)
            await new Promise(resolve => setTimeout(resolve, 300))
            setPath(mockPathData)
        } catch (error) {
            toast.error('Failed to load learning path')
        } finally {
            setLoading(false)
        }
    }

    const toggleModule = (moduleId: string) => {
        setExpandedModules(prev =>
            prev.includes(moduleId)
                ? prev.filter(id => id !== moduleId)
                : [...prev, moduleId]
        )
    }

    const handleEnroll = async () => {
        try {
            // await careerService.enrollPath(id!)
            toast.success('Enrolled successfully!')
            setPath(prev => prev ? { ...prev, enrolled: true, progress: 0 } : null)
        } catch (error) {
            toast.error('Failed to enroll')
        }
    }

    const getNextModule = () => {
        if (!path) return null
        return path.modules.find(m => !m.completed && !m.locked)
    }

    if (loading) {
        return (
            <div className="animate-pulse space-y-6">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
        )
    }

    if (!path) {
        return (
            <div className="text-center py-12">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Path not found</h2>
                <Button variant="primary" className="mt-4" onClick={() => navigate('/learning')}>
                    Back to Learning
                </Button>
            </div>
        )
    }

    const nextModule = getNextModule()
    const completedModules = path.modules.filter(m => m.completed).length
    const progressPercent = Math.round((completedModules / path.modules.length) * 100)

    return (
        <div className="space-y-6">
            {/* Back Button */}
            <Button variant="ghost" icon={<ArrowLeft />} onClick={() => navigate('/learning')}>
                Back to Learning
            </Button>

            {/* Hero Section */}
            <FadeIn>
                <Card className="overflow-hidden">
                    <div className="relative">
                        <img
                            src={path.thumbnail}
                            alt={path.title}
                            className="w-full h-48 md:h-64 object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                            <Badge className="mb-2">{path.category}</Badge>
                            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                                {path.title}
                            </h1>
                            <div className="flex items-center gap-4 text-white/80 text-sm">
                                <span className="flex items-center gap-1">
                                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                    {path.rating} ({path.ratingCount.toLocaleString()} reviews)
                                </span>
                                <span className="flex items-center gap-1">
                                    <Users className="w-4 h-4" />
                                    {path.enrolledCount.toLocaleString()} enrolled
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {path.duration}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <Avatar src={path.instructor.avatar} alt={path.instructor.name} size="lg" />
                                <div>
                                    <div className="font-medium text-gray-900 dark:text-white">
                                        {path.instructor.name}
                                    </div>
                                    <div className="text-sm text-gray-500">{path.instructor.title}</div>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                {path.enrolled ? (
                                    <>
                                        {nextModule && (
                                            <Button
                                                variant="primary"
                                                icon={<Play className="w-4 h-4" />}
                                                as={Link}
                                                to={`/learning/module/${nextModule.id}`}
                                            >
                                                Continue Learning
                                            </Button>
                                        )}
                                        {path.certificate && (
                                            <Button
                                                variant="outline"
                                                icon={<Award className="w-4 h-4" />}
                                                onClick={() => setShowCertificatePreview(true)}
                                            >
                                                Certificate
                                            </Button>
                                        )}
                                    </>
                                ) : (
                                    <Button variant="primary" size="lg" onClick={handleEnroll}>
                                        Enroll Now - Free
                                    </Button>
                                )}
                            </div>
                        </div>

                        {path.enrolled && (
                            <div className="mt-6">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Your Progress
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        {completedModules} of {path.modules.length} modules completed
                                    </span>
                                </div>
                                <Progress value={progressPercent} size="md" />
                            </div>
                        )}
                    </div>
                </Card>
            </FadeIn>

            {/* Description & Skills */}
            <FadeIn delay={0.1}>
                <Card className="p-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        About This Path
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        {path.description}
                    </p>
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Skills You'll Learn
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {path.skills.map((skill) => (
                            <Badge key={skill} variant="secondary">{skill}</Badge>
                        ))}
                    </div>
                </Card>
            </FadeIn>

            {/* Modules */}
            <FadeIn delay={0.2}>
                <Card className="p-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                        Course Curriculum
                    </h2>
                    <div className="space-y-3">
                        {path.modules.map((module, index) => {
                            const Icon = moduleTypeIcons[module.type]
                            const isExpanded = expandedModules.includes(module.id)

                            return (
                                <motion.div
                                    key={module.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className={cn(
                                        'border rounded-lg overflow-hidden',
                                        module.locked
                                            ? 'border-gray-200 dark:border-gray-700 opacity-60'
                                            : module.completed
                                                ? 'border-green-200 dark:border-green-900/50 bg-green-50/50 dark:bg-green-900/10'
                                                : 'border-gray-200 dark:border-gray-700'
                                    )}
                                >
                                    <button
                                        className="w-full flex items-center gap-4 p-4 text-left"
                                        onClick={() => toggleModule(module.id)}
                                        disabled={module.locked}
                                    >
                                        {/* Status Icon */}
                                        <div className="flex-shrink-0">
                                            {module.completed ? (
                                                <CheckCircle className="w-6 h-6 text-green-500" />
                                            ) : module.locked ? (
                                                <Lock className="w-6 h-6 text-gray-400" />
                                            ) : (
                                                <div className={cn(
                                                    'w-6 h-6 rounded-full flex items-center justify-center',
                                                    moduleTypeColors[module.type]
                                                )}>
                                                    <Icon className="w-3 h-3" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-gray-900 dark:text-white">
                                                    {module.order}. {module.title}
                                                </span>
                                                <Badge className={moduleTypeColors[module.type]} variant="secondary">
                                                    {module.type}
                                                </Badge>
                                                {module.quiz?.bestScore && (
                                                    <Badge variant="success">Score: {module.quiz.bestScore}%</Badge>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-500 mt-1">
                                                {module.description}
                                            </p>
                                        </div>

                                        {/* Duration & Arrow */}
                                        <div className="flex items-center gap-4">
                                            <span className="text-sm text-gray-500 flex items-center gap-1">
                                                <Clock className="w-4 h-4" />
                                                {module.duration}
                                            </span>
                                            {!module.locked && (
                                                isExpanded ? (
                                                    <ChevronDown className="w-5 h-5 text-gray-400" />
                                                ) : (
                                                    <ChevronRight className="w-5 h-5 text-gray-400" />
                                                )
                                            )}
                                        </div>
                                    </button>

                                    {/* Expanded Content */}
                                    <AnimatePresence>
                                        {isExpanded && !module.locked && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
                                            >
                                                <div className="p-4 space-y-3">
                                                    {module.resources.map((resource, i) => (
                                                        <Link
                                                            key={i}
                                                            to={resource.url}
                                                            className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                {resource.type === 'video' && <Video className="w-4 h-4 text-blue-500" />}
                                                                {resource.type === 'article' && <FileText className="w-4 h-4 text-green-500" />}
                                                                {resource.type === 'download' && <Download className="w-4 h-4 text-purple-500" />}
                                                                {resource.type === 'link' && <BookOpen className="w-4 h-4 text-orange-500" />}
                                                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                                                    {resource.title}
                                                                </span>
                                                            </div>
                                                            {resource.duration && (
                                                                <span className="text-xs text-gray-500">{resource.duration}</span>
                                                            )}
                                                        </Link>
                                                    ))}

                                                    <Button
                                                        variant="primary"
                                                        fullWidth
                                                        icon={module.completed ? <CheckCircle className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                                        as={Link}
                                                        to={`/learning/module/${module.id}`}
                                                    >
                                                        {module.completed ? 'Review' : 'Start Module'}
                                                    </Button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            )
                        })}
                    </div>
                </Card>
            </FadeIn>

            {/* Certificate Preview Modal */}
            <Modal
                isOpen={showCertificatePreview}
                onClose={() => setShowCertificatePreview(false)}
                title="Certificate Preview"
            >
                <div className="text-center space-y-6">
                    <div className="p-8 border-4 border-primary/20 rounded-lg bg-gradient-to-br from-primary/5 to-secondary/5">
                        <Award className="w-16 h-16 text-primary mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            Certificate of Completion
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            This certifies that
                        </p>
                        <p className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                            Your Name
                        </p>
                        <p className="text-gray-600 dark:text-gray-400">
                            has successfully completed the course
                        </p>
                        <p className="text-lg font-medium text-primary mt-2">
                            {path.title}
                        </p>
                    </div>
                    <p className="text-sm text-gray-500">
                        Complete all modules to unlock your certificate
                    </p>
                    <Progress value={progressPercent} size="sm" />
                    <p className="text-sm text-gray-500">
                        {100 - progressPercent}% remaining
                    </p>
                </div>
            </Modal>
        </div>
    )
}

export default PathDetail
