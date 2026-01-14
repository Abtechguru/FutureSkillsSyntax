import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
    Search,
    Filter,
    BookOpen,
    Clock,
    Star,
    Users,
    Award,
    Play,
    TrendingUp,
    ChevronRight,
    BarChart3,
    Target,
    Zap,
} from 'lucide-react'
import { toast } from 'react-hot-toast'

import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Progress } from '@/components/ui/Progress'
import FadeIn from '@/components/animations/FadeIn'
import StaggerChildren from '@/components/animations/StaggerChildren'
import careerService, { LearningPath } from '@/services/career'
import { cn } from '@/utils/cn'

const difficultyColors = {
    beginner: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    intermediate: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    advanced: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}

// Mock data for production
const mockPaths: LearningPath[] = [
    {
        id: '1',
        title: 'React Mastery',
        description: 'Master React from fundamentals to advanced patterns including hooks, context, and performance optimization.',
        thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400',
        category: 'Frontend',
        difficulty: 'intermediate',
        duration: '40 hours',
        durationHours: 40,
        modules: [],
        skills: ['React', 'Hooks', 'Context', 'Redux'],
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
    },
    {
        id: '2',
        title: 'TypeScript Complete Guide',
        description: 'Learn TypeScript from scratch and understand how to build type-safe applications.',
        thumbnail: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400',
        category: 'Programming',
        difficulty: 'beginner',
        duration: '25 hours',
        durationHours: 25,
        modules: [],
        skills: ['TypeScript', 'Generics', 'Type Safety'],
        enrolledCount: 8920,
        rating: 4.9,
        ratingCount: 1876,
        instructor: {
            name: 'John Smith',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
            title: 'Tech Lead @ Microsoft',
        },
        certificate: true,
        price: 0,
        enrolled: true,
        progress: 30,
    },
    {
        id: '3',
        title: 'Node.js Backend Development',
        description: 'Build scalable backend APIs with Node.js, Express, and PostgreSQL.',
        thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400',
        category: 'Backend',
        difficulty: 'intermediate',
        duration: '35 hours',
        durationHours: 35,
        modules: [],
        skills: ['Node.js', 'Express', 'PostgreSQL', 'REST API'],
        enrolledCount: 6540,
        rating: 4.7,
        ratingCount: 1234,
        instructor: {
            name: 'Maria Garcia',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
            title: 'Backend Lead @ Netflix',
        },
        certificate: true,
        price: 0,
        enrolled: false,
    },
    {
        id: '4',
        title: 'System Design Fundamentals',
        description: 'Learn how to design scalable systems and ace system design interviews.',
        thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400',
        category: 'Architecture',
        difficulty: 'advanced',
        duration: '30 hours',
        durationHours: 30,
        modules: [],
        skills: ['System Design', 'Scalability', 'Microservices'],
        enrolledCount: 4320,
        rating: 4.9,
        ratingCount: 876,
        instructor: {
            name: 'Alex Johnson',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
            title: 'Staff Engineer @ Meta',
        },
        certificate: true,
        price: 0,
        enrolled: false,
    },
    {
        id: '5',
        title: 'Testing with Jest & RTL',
        description: 'Master testing React applications with Jest and React Testing Library.',
        thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400',
        category: 'Testing',
        difficulty: 'intermediate',
        duration: '20 hours',
        durationHours: 20,
        modules: [],
        skills: ['Jest', 'React Testing Library', 'TDD'],
        enrolledCount: 3210,
        rating: 4.6,
        ratingCount: 654,
        instructor: {
            name: 'Emma Wilson',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
            title: 'QA Lead @ Spotify',
        },
        certificate: true,
        price: 0,
        enrolled: false,
    },
]

const LearningDashboard: React.FC = () => {
    const [paths, setPaths] = useState<LearningPath[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
    const [showEnrolledOnly, setShowEnrolledOnly] = useState(false)

    const categories = ['Frontend', 'Backend', 'Programming', 'Architecture', 'Testing', 'DevOps']

    useEffect(() => {
        loadPaths()
    }, [])

    const loadPaths = async () => {
        setLoading(true)
        try {
            // In production: const data = await careerService.getPaths()
            await new Promise(resolve => setTimeout(resolve, 500))
            setPaths(mockPaths)
        } catch (error) {
            toast.error('Failed to load learning paths')
        } finally {
            setLoading(false)
        }
    }

    const filteredPaths = paths.filter(path => {
        const matchesSearch = path.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            path.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
        const matchesCategory = !selectedCategory || path.category === selectedCategory
        const matchesEnrolled = !showEnrolledOnly || path.enrolled
        return matchesSearch && matchesCategory && matchesEnrolled
    })

    const enrolledPaths = paths.filter(p => p.enrolled)
    const totalProgress = enrolledPaths.length > 0
        ? Math.round(enrolledPaths.reduce((acc, p) => acc + (p.progress || 0), 0) / enrolledPaths.length)
        : 0

    return (
        <div className="space-y-6">
            {/* Header with Stats */}
            <FadeIn>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Learning Paths
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Master new skills with structured learning paths
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant={showEnrolledOnly ? 'primary' : 'outline'}
                            icon={<BookOpen />}
                            onClick={() => setShowEnrolledOnly(!showEnrolledOnly)}
                        >
                            My Courses ({enrolledPaths.length})
                        </Button>
                        <Button variant="outline" as={Link} to="/progress">
                            <BarChart3 className="w-4 h-4 mr-2" />
                            View Analytics
                        </Button>
                    </div>
                </div>
            </FadeIn>

            {/* Progress Overview */}
            {enrolledPaths.length > 0 && (
                <FadeIn delay={0.1}>
                    <Card className="p-6 bg-gradient-to-r from-primary/5 to-secondary/5">
                        <div className="grid md:grid-cols-4 gap-6">
                            <div>
                                <div className="flex items-center gap-2 text-gray-500 mb-1">
                                    <BookOpen className="w-4 h-4" />
                                    <span className="text-sm">In Progress</span>
                                </div>
                                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {enrolledPaths.length} courses
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center gap-2 text-gray-500 mb-1">
                                    <Target className="w-4 h-4" />
                                    <span className="text-sm">Average Progress</span>
                                </div>
                                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {totalProgress}%
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center gap-2 text-gray-500 mb-1">
                                    <Clock className="w-4 h-4" />
                                    <span className="text-sm">Hours Remaining</span>
                                </div>
                                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {Math.round(enrolledPaths.reduce((acc, p) => acc + (p.durationHours * (1 - (p.progress || 0) / 100)), 0))}h
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center gap-2 text-gray-500 mb-1">
                                    <Award className="w-4 h-4" />
                                    <span className="text-sm">Certificates</span>
                                </div>
                                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                    0 earned
                                </div>
                            </div>
                        </div>
                    </Card>
                </FadeIn>
            )}

            {/* Continue Learning */}
            {enrolledPaths.length > 0 && (
                <FadeIn delay={0.15}>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Continue Learning
                    </h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        {enrolledPaths.map((path) => (
                            <motion.div key={path.id} whileHover={{ scale: 1.01 }}>
                                <Card className="p-4 flex gap-4">
                                    <img
                                        src={path.thumbnail}
                                        alt={path.title}
                                        className="w-24 h-24 rounded-lg object-cover"
                                    />
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900 dark:text-white">
                                            {path.title}
                                        </h3>
                                        <p className="text-sm text-gray-500 mb-2">
                                            {path.instructor.name}
                                        </p>
                                        <Progress value={path.progress || 0} size="sm" />
                                        <div className="flex items-center justify-between mt-2">
                                            <span className="text-xs text-gray-500">
                                                {path.progress}% complete
                                            </span>
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                icon={<Play className="w-4 h-4" />}
                                                as={Link}
                                                to={`/learning/path/${path.id}`}
                                            >
                                                Continue
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </FadeIn>
            )}

            {/* Search and Filters */}
            <FadeIn delay={0.2}>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search courses or skills..."
                            leftIcon={<Search className="w-4 h-4" />}
                        />
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        <Button
                            variant={selectedCategory === null ? 'primary' : 'outline'}
                            size="sm"
                            onClick={() => setSelectedCategory(null)}
                        >
                            All
                        </Button>
                        {categories.map((cat) => (
                            <Button
                                key={cat}
                                variant={selectedCategory === cat ? 'primary' : 'outline'}
                                size="sm"
                                onClick={() => setSelectedCategory(cat)}
                            >
                                {cat}
                            </Button>
                        ))}
                    </div>
                </div>
            </FadeIn>

            {/* Course Grid */}
            {loading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Card key={i} className="animate-pulse">
                            <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-t-lg" />
                            <div className="p-4 space-y-3">
                                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded" />
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <StaggerChildren staggerDelay={0.05}>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredPaths.map((path) => (
                            <motion.div key={path.id} whileHover={{ y: -4 }}>
                                <Card className="overflow-hidden h-full flex flex-col">
                                    <div className="relative">
                                        <img
                                            src={path.thumbnail}
                                            alt={path.title}
                                            className="w-full h-40 object-cover"
                                        />
                                        <Badge className={cn('absolute top-3 left-3', difficultyColors[path.difficulty])}>
                                            {path.difficulty}
                                        </Badge>
                                        {path.certificate && (
                                            <Badge className="absolute top-3 right-3 bg-yellow-500/90 text-white">
                                                <Award className="w-3 h-3 mr-1" />
                                                Certificate
                                            </Badge>
                                        )}
                                    </div>

                                    <div className="p-4 flex-1 flex flex-col">
                                        <Badge variant="secondary" className="w-fit mb-2">{path.category}</Badge>
                                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                                            {path.title}
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 flex-grow line-clamp-2">
                                            {path.description}
                                        </p>

                                        {/* Instructor */}
                                        <div className="flex items-center gap-2 mb-4">
                                            <img
                                                src={path.instructor.avatar}
                                                alt={path.instructor.name}
                                                className="w-8 h-8 rounded-full"
                                            />
                                            <div>
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {path.instructor.name}
                                                </div>
                                                <div className="text-xs text-gray-500">{path.instructor.title}</div>
                                            </div>
                                        </div>

                                        {/* Stats */}
                                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                                            <span className="flex items-center gap-1">
                                                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                                {path.rating}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Users className="w-4 h-4" />
                                                {path.enrolledCount.toLocaleString()}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-4 h-4" />
                                                {path.duration}
                                            </span>
                                        </div>

                                        {/* Skills */}
                                        <div className="flex flex-wrap gap-1 mb-4">
                                            {path.skills.slice(0, 3).map((skill) => (
                                                <Badge key={skill} variant="secondary" className="text-xs">
                                                    {skill}
                                                </Badge>
                                            ))}
                                        </div>

                                        {/* Action */}
                                        <Button
                                            variant={path.enrolled ? 'outline' : 'primary'}
                                            fullWidth
                                            icon={path.enrolled ? <Play className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
                                            as={Link}
                                            to={`/learning/path/${path.id}`}
                                        >
                                            {path.enrolled ? 'Continue Learning' : 'Enroll Now'}
                                        </Button>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </StaggerChildren>
            )}
        </div>
    )
}

export default LearningDashboard
