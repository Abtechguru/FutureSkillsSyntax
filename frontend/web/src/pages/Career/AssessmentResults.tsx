import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
    TrendingUp,
    Target,
    BookOpen,
    ArrowRight,
    CheckCircle,
    AlertCircle,
    Sparkles,
    Download,
    Share2,
} from 'lucide-react'

import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { Progress } from '@/components/ui/Progress'
import { Badge } from '@/components/ui/Badge'
import FadeIn from '@/components/animations/FadeIn'
import StaggerChildren from '@/components/animations/StaggerChildren'
import { cn } from '@/utils/cn'

const AssessmentResults: React.FC = () => {
    // Mock results data - replace with API data
    const careerMatches = [
        {
            id: '1',
            title: 'Frontend Developer',
            match: 92,
            description: 'Build user interfaces and web applications',
            skills: ['React', 'TypeScript', 'CSS', 'JavaScript'],
            salary: '$80k - $130k',
            growth: '+22%',
        },
        {
            id: '2',
            title: 'Full Stack Developer',
            match: 87,
            description: 'Work on both frontend and backend systems',
            skills: ['Node.js', 'React', 'PostgreSQL', 'AWS'],
            salary: '$90k - $150k',
            growth: '+20%',
        },
        {
            id: '3',
            title: 'UX Engineer',
            match: 78,
            description: 'Bridge design and development',
            skills: ['Figma', 'React', 'CSS', 'User Research'],
            salary: '$85k - $140k',
            growth: '+18%',
        },
    ]

    const skillGaps = [
        { skill: 'TypeScript', current: 60, required: 85, status: 'gap' },
        { skill: 'React', current: 75, required: 85, status: 'close' },
        { skill: 'System Design', current: 40, required: 70, status: 'gap' },
        { skill: 'Testing', current: 50, required: 75, status: 'gap' },
        { skill: 'CSS/Styling', current: 80, required: 80, status: 'met' },
    ]

    const learningRoadmap = [
        {
            phase: 1,
            title: 'Foundation',
            duration: '4 weeks',
            items: ['TypeScript Fundamentals', 'Advanced React Patterns', 'State Management'],
            completed: false,
        },
        {
            phase: 2,
            title: 'Intermediate',
            duration: '6 weeks',
            items: ['Testing with Jest & RTL', 'API Design', 'Performance Optimization'],
            completed: false,
        },
        {
            phase: 3,
            title: 'Advanced',
            duration: '4 weeks',
            items: ['System Design', 'CI/CD Pipelines', 'Cloud Deployment'],
            completed: false,
        },
    ]

    const personalityTraits = [
        { trait: 'Analytical', score: 85 },
        { trait: 'Creative', score: 72 },
        { trait: 'Collaborative', score: 80 },
        { trait: 'Detail-oriented', score: 88 },
    ]

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <FadeIn>
                <Card className="p-8 text-center bg-gradient-to-r from-primary/5 to-secondary/5">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200 }}
                        className="inline-flex p-6 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 mb-6"
                    >
                        <Sparkles className="w-12 h-12 text-primary" />
                    </motion.div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Your Career Assessment Results
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-6">
                        Based on your personality, skills, and interests, here are your personalized career recommendations
                    </p>
                    <div className="flex justify-center gap-3">
                        <Button variant="outline" icon={<Download />}>
                            Download Report
                        </Button>
                        <Button variant="outline" icon={<Share2 />}>
                            Share Results
                        </Button>
                    </div>
                </Card>
            </FadeIn>

            {/* Career Matches */}
            <FadeIn delay={0.1}>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Top Career Matches
                </h2>
                <StaggerChildren staggerDelay={0.1}>
                    <div className="grid md:grid-cols-3 gap-6">
                        {careerMatches.map((career, index) => (
                            <motion.div
                                key={career.id}
                                whileHover={{ y: -4 }}
                                className="relative"
                            >
                                <Card className={cn(
                                    'p-6 h-full',
                                    index === 0 && 'ring-2 ring-primary'
                                )}>
                                    {index === 0 && (
                                        <Badge variant="primary" className="absolute -top-2 -right-2">
                                            Best Match
                                        </Badge>
                                    )}
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                            {career.title}
                                        </h3>
                                        <div className="text-2xl font-bold text-primary">
                                            {career.match}%
                                        </div>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                                        {career.description}
                                    </p>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {career.skills.map((skill) => (
                                            <Badge key={skill} variant="secondary">{skill}</Badge>
                                        ))}
                                    </div>
                                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                                        <span>{career.salary}</span>
                                        <span className="text-green-500 flex items-center gap-1">
                                            <TrendingUp className="w-4 h-4" />
                                            {career.growth} growth
                                        </span>
                                    </div>
                                    <Button variant="primary" fullWidth icon={<ArrowRight />} iconPosition="right">
                                        Explore Path
                                    </Button>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </StaggerChildren>
            </FadeIn>

            {/* Skill Gap Analysis */}
            <FadeIn delay={0.2}>
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                Skill Gap Analysis
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400">
                                For: Frontend Developer role
                            </p>
                        </div>
                        <Button variant="outline" as={Link} to="/learning">
                            Start Learning
                        </Button>
                    </div>
                    <div className="space-y-4">
                        {skillGaps.map((item) => (
                            <div key={item.skill} className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-gray-900 dark:text-white">
                                            {item.skill}
                                        </span>
                                        {item.status === 'met' && (
                                            <CheckCircle className="w-4 h-4 text-green-500" />
                                        )}
                                        {item.status === 'gap' && (
                                            <AlertCircle className="w-4 h-4 text-orange-500" />
                                        )}
                                    </div>
                                    <span className="text-sm text-gray-500">
                                        {item.current}% / {item.required}% required
                                    </span>
                                </div>
                                <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <motion.div
                                        className="absolute left-0 top-0 h-full bg-primary rounded-full"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${item.current}%` }}
                                        transition={{ duration: 1, delay: 0.5 }}
                                    />
                                    <div
                                        className="absolute top-0 h-full w-0.5 bg-orange-500"
                                        style={{ left: `${item.required}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </FadeIn>

            {/* Learning Roadmap */}
            <FadeIn delay={0.3}>
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                Learning Roadmap Preview
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400">
                                Estimated time: 14 weeks
                            </p>
                        </div>
                        <Button variant="primary" icon={<BookOpen />}>
                            Start Learning Path
                        </Button>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        {learningRoadmap.map((phase, index) => (
                            <div
                                key={phase.phase}
                                className={cn(
                                    'p-4 rounded-lg border-2',
                                    phase.completed
                                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                                        : 'border-gray-200 dark:border-gray-700'
                                )}
                            >
                                <div className="flex items-center gap-2 mb-3">
                                    <div className={cn(
                                        'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                                        phase.completed
                                            ? 'bg-green-500 text-white'
                                            : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                                    )}>
                                        {phase.phase}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white">
                                            {phase.title}
                                        </h3>
                                        <p className="text-xs text-gray-500">{phase.duration}</p>
                                    </div>
                                </div>
                                <ul className="space-y-2">
                                    {phase.items.map((item, i) => (
                                        <li key={i} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                            <Target className="w-3 h-3 text-primary" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </Card>
            </FadeIn>

            {/* Personality Insights */}
            <FadeIn delay={0.4}>
                <Card className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                        Personality Insights
                    </h2>
                    <div className="grid md:grid-cols-4 gap-6">
                        {personalityTraits.map((trait) => (
                            <div key={trait.trait} className="text-center">
                                <div className="relative w-24 h-24 mx-auto mb-3">
                                    <svg className="w-full h-full -rotate-90">
                                        <circle
                                            cx="48"
                                            cy="48"
                                            r="40"
                                            stroke="currentColor"
                                            strokeWidth="8"
                                            fill="none"
                                            className="text-gray-200 dark:text-gray-700"
                                        />
                                        <motion.circle
                                            cx="48"
                                            cy="48"
                                            r="40"
                                            stroke="currentColor"
                                            strokeWidth="8"
                                            fill="none"
                                            strokeLinecap="round"
                                            className="text-primary"
                                            initial={{ strokeDasharray: '0 251' }}
                                            animate={{ strokeDasharray: `${trait.score * 2.51} 251` }}
                                            transition={{ duration: 1, delay: 0.5 }}
                                        />
                                    </svg>
                                    <span className="absolute inset-0 flex items-center justify-center text-xl font-bold text-gray-900 dark:text-white">
                                        {trait.score}%
                                    </span>
                                </div>
                                <h3 className="font-medium text-gray-900 dark:text-white">
                                    {trait.trait}
                                </h3>
                            </div>
                        ))}
                    </div>
                </Card>
            </FadeIn>

            {/* CTA */}
            <FadeIn delay={0.5}>
                <Card className="p-8 text-center bg-gradient-to-r from-primary/10 to-secondary/10">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Ready to Start Your Journey?
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Connect with a mentor to get personalized guidance on your career path
                    </p>
                    <div className="flex justify-center gap-4">
                        <Button variant="outline" as={Link} to="/dashboard">
                            Go to Dashboard
                        </Button>
                        <Button variant="primary" icon={<ArrowRight />} iconPosition="right" as={Link} to="/mentorship">
                            Find a Mentor
                        </Button>
                    </div>
                </Card>
            </FadeIn>
        </div>
    )
}

export default AssessmentResults
