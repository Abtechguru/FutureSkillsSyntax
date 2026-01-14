import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
    Sparkles,
    CheckCircle,
    ArrowRight,
    User,
    BookOpen,
    Users,
    Target,
    Rocket,
} from 'lucide-react'

import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import FadeIn from '@/components/animations/FadeIn'
import { useAuth } from '@/hooks/useAuth'

const OnboardingComplete: React.FC = () => {
    const navigate = useNavigate()
    const { user, isAuthenticated, refreshProfile } = useAuth()
    const [showContent, setShowContent] = useState(false)

    useEffect(() => {
        // Refresh user profile on mount
        refreshProfile()

        // Dynamic import confetti to avoid SSR issues
        import('canvas-confetti').then((confetti) => {
            const end = Date.now() + 2000
            const colors = ['#4F46E5', '#10B981', '#F59E0B']

            const frame = () => {
                confetti.default({
                    particleCount: 3,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 },
                    colors,
                })
                confetti.default({
                    particleCount: 3,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 },
                    colors,
                })

                if (Date.now() < end) {
                    requestAnimationFrame(frame)
                }
            }

            frame()
        })

        // Show content after animation
        setTimeout(() => setShowContent(true), 500)
    }, [refreshProfile])

    // Redirect if not authenticated
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login')
        }
    }, [isAuthenticated, navigate])

    const quickStartItems = [
        {
            icon: User,
            title: 'Complete Your Profile',
            description: 'Add a photo and more details',
            href: '/profile',
            done: !!user?.avatar,
        },
        {
            icon: Target,
            title: 'Take Career Assessment',
            description: 'Discover your ideal career path',
            href: '/career/assessment',
            done: false,
        },
        {
            icon: Users,
            title: 'Find a Mentor',
            description: 'Connect with industry experts',
            href: '/mentorship',
            done: false,
        },
        {
            icon: BookOpen,
            title: 'Start Learning',
            description: 'Explore courses and resources',
            href: '/learning',
            done: false,
        },
    ]

    return (
        <div className="min-h-screen flex items-center justify-center p-4 py-12">
            <div className="w-full max-w-2xl">
                <FadeIn direction="up">
                    {/* Welcome Animation */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                        className="text-center mb-8"
                    >
                        <div className="inline-flex p-6 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 mb-6">
                            <motion.div
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                            >
                                <Sparkles className="w-16 h-16 text-primary" />
                            </motion.div>
                        </div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-4xl font-bold text-gray-900 dark:text-white mb-4"
                        >
                            Welcome{user?.firstName ? `, ${user.firstName}` : ''}! 🎉
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="text-xl text-gray-600 dark:text-gray-400"
                        >
                            Your account is ready. Let's get you started on your journey!
                        </motion.p>
                    </motion.div>

                    {showContent && (
                        <>
                            {/* Dashboard Introduction */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                            >
                                <Card className="p-6 mb-6 bg-gradient-to-r from-primary/5 to-secondary/5">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 rounded-lg bg-primary/10">
                                            <Rocket className="w-6 h-6 text-primary" />
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                                                Your Dashboard Awaits
                                            </h2>
                                            <p className="text-gray-600 dark:text-gray-400">
                                                Track your progress, access learning materials, connect with mentors, and manage your career journey all in one place.
                                            </p>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>

                            {/* Quick Start Guide */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.7 }}
                            >
                                <Card className="p-6 mb-6">
                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                        Quick Start Guide
                                    </h2>
                                    <div className="space-y-3">
                                        {quickStartItems.map((item, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.8 + index * 0.1 }}
                                            >
                                                <Link
                                                    to={item.href}
                                                    className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary/50 hover:bg-primary/5 transition-all group"
                                                >
                                                    <div className={`p-2 rounded-lg ${item.done ? 'bg-success/10' : 'bg-gray-100 dark:bg-gray-800'}`}>
                                                        {item.done ? (
                                                            <CheckCircle className="w-5 h-5 text-success" />
                                                        ) : (
                                                            <item.icon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="font-medium text-gray-900 dark:text-white">
                                                            {item.title}
                                                        </h3>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                                            {item.description}
                                                        </p>
                                                    </div>
                                                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                                </Link>
                                            </motion.div>
                                        ))}
                                    </div>
                                </Card>
                            </motion.div>

                            {/* CTA Buttons */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.2 }}
                                className="flex flex-col sm:flex-row gap-4"
                            >
                                <Button
                                    variant="primary"
                                    size="lg"
                                    fullWidth
                                    icon={<ArrowRight />}
                                    iconPosition="right"
                                    onClick={() => navigate('/dashboard')}
                                >
                                    Go to Dashboard
                                </Button>
                                <Button
                                    variant="outline"
                                    size="lg"
                                    fullWidth
                                    onClick={() => navigate('/profile')}
                                >
                                    Complete Profile
                                </Button>
                            </motion.div>
                        </>
                    )}
                </FadeIn>
            </div>
        </div>
    )
}

export default OnboardingComplete
