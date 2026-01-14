import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
    ArrowRight,
    CheckCircle,
    Users,
    Zap,
    TrendingUp,
    Target,
    BookOpen,
    Award,
    Star,
    Play,
    Shield,
    Clock,
} from 'lucide-react'
import { useSelector } from 'react-redux'

import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import FadeIn from '@/components/animations/FadeIn'
import StaggerChildren from '@/components/animations/StaggerChildren'
import { RootState } from '@/store/store'

const LandingPage: React.FC = () => {
    const { isAuthenticated } = useSelector((state: RootState) => state.auth)

    const features = [
        {
            icon: Target,
            title: 'Personalized Career Paths',
            description: 'AI-powered career recommendations based on your skills, interests, and goals',
            color: 'from-blue-500 to-blue-600',
        },
        {
            icon: BookOpen,
            title: 'Structured Learning',
            description: 'Curated learning resources with guided pathways and milestone tracking',
            color: 'from-purple-500 to-purple-600',
        },
        {
            icon: Users,
            title: 'Expert Mentorship',
            description: 'Connect with industry professionals for personalized guidance',
            color: 'from-green-500 to-green-600',
        },
        {
            icon: Award,
            title: 'Gamified Progress',
            description: 'Earn badges, level up, and track your journey with achievements',
            color: 'from-amber-500 to-amber-600',
        },
        {
            icon: TrendingUp,
            title: 'Skill Gap Analysis',
            description: 'Identify and bridge your skill gaps with targeted recommendations',
            color: 'from-pink-500 to-pink-600',
        },
        {
            icon: Zap,
            title: 'FutureSyntax Program',
            description: 'Special mentorship for fatherless boys (10-18) with character building',
            color: 'from-indigo-500 to-indigo-600',
        },
    ]

    const testimonials = [
        {
            name: 'Alex Johnson',
            role: 'Career Switcher → Software Developer',
            content: 'OnaAseyori helped me transition from marketing to software development in just 6 months. The personalized roadmap was exactly what I needed!',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
            rating: 5,
        },
        {
            name: 'Maria Garcia',
            role: 'Student → Mobile Developer',
            content: 'The mentorship program connected me with an amazing mentor who helped me build my first mobile app. Life-changing experience!',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
            rating: 5,
        },
        {
            name: 'David Chen',
            role: 'FutureSyntax Mentee',
            content: 'As someone without a father figure, this platform gave me both technical skills and life guidance. I feel empowered and supported.',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
            rating: 5,
        },
    ]

    const stats = [
        { value: '10,000+', label: 'Users Empowered', color: 'text-primary' },
        { value: '500+', label: 'Expert Mentors', color: 'text-secondary' },
        { value: '95%', label: 'Success Rate', color: 'text-success' },
        { value: '50+', label: 'Career Paths', color: 'text-warning' },
    ]

    const howItWorks = [
        {
            step: '01',
            title: 'Take Career Assessment',
            description: 'Complete our AI-powered assessment to understand your skills, interests, and personality.',
            icon: '📊',
        },
        {
            step: '02',
            title: 'Get Personalized Roadmap',
            description: 'Receive a customized learning path with recommended courses, projects, and milestones.',
            icon: '🗺️',
        },
        {
            step: '03',
            title: 'Connect with Mentors',
            description: 'Get matched with experienced mentors who guide you through your learning journey.',
            icon: '👥',
        },
        {
            step: '04',
            title: 'Track Progress & Earn Rewards',
            description: 'Monitor your growth, earn badges, and level up as you complete milestones.',
            icon: '🏆',
        },
    ]

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative overflow-hidden py-20 lg:py-32">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <FadeIn delay={0.1}>
                            <div className="space-y-8">
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium">
                                    <Zap className="w-4 h-4" />
                                    <span>Join 10,000+ learners building their future</span>
                                </div>

                                <motion.h1
                                    className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6 }}
                                >
                                    <span className="block text-gray-900 dark:text-white">Build Your</span>
                                    <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                        Tech Career
                                    </span>
                                    <span className="block text-gray-900 dark:text-white">With Confidence</span>
                                </motion.h1>

                                <motion.p
                                    className="text-xl text-gray-600 dark:text-gray-300 max-w-lg"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.1 }}
                                >
                                    Personalized career guidance + structured mentorship that turns uncertainty into skills, character, and opportunity.
                                </motion.p>

                                <motion.div
                                    className="flex flex-col sm:flex-row gap-4"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.2 }}
                                >
                                    {isAuthenticated ? (
                                        <>
                                            <Button
                                                size="lg"
                                                variant="primary"
                                                icon={<ArrowRight />}
                                                iconPosition="right"
                                                as={Link}
                                                to="/dashboard"
                                            >
                                                Go to Dashboard
                                            </Button>
                                            <Button
                                                size="lg"
                                                variant="outline"
                                                as={Link}
                                                to="/career/assessment"
                                            >
                                                Career Assessment
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Button
                                                size="lg"
                                                variant="primary"
                                                icon={<ArrowRight />}
                                                iconPosition="right"
                                                as={Link}
                                                to="/register"
                                            >
                                                Get Started Free
                                            </Button>
                                            <Button
                                                size="lg"
                                                variant="outline"
                                                icon={<Play className="w-4 h-4" />}
                                                as={Link}
                                                to="/login"
                                            >
                                                Watch Demo
                                            </Button>
                                        </>
                                    )}
                                </motion.div>

                                {/* Trust badges */}
                                <motion.div
                                    className="flex items-center gap-6 pt-4"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.6, delay: 0.3 }}
                                >
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <Shield className="w-4 h-4 text-success" />
                                        <span>Free to start</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <Clock className="w-4 h-4 text-success" />
                                        <span>Cancel anytime</span>
                                    </div>
                                </motion.div>
                            </div>
                        </FadeIn>

                        <FadeIn delay={0.4} direction="right">
                            <div className="relative">
                                {/* Gradient blur background */}
                                <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur-3xl" />

                                {/* Hero image/illustration placeholder */}
                                <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 aspect-square flex items-center justify-center">
                                    <div className="text-center space-y-4">
                                        <div className="text-6xl">🚀</div>
                                        <h3 className="text-xl font-semibold text-white">Your Career Journey</h3>
                                        <p className="text-gray-400">Starts Here</p>
                                    </div>
                                </div>
                            </div>
                        </FadeIn>
                    </div>

                    {/* Stats */}
                    <motion.div
                        className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-20"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center p-6 rounded-xl bg-white dark:bg-gray-800 shadow-sm">
                                <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{stat.label}</div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <FadeIn direction="up">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                                Everything You Need for Your{' '}
                                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                    Career Journey
                                </span>
                            </h2>
                            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                                From discovery to mastery, we guide you every step of the way
                            </p>
                        </div>
                    </FadeIn>

                    <StaggerChildren staggerDelay={0.1}>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {features.map((feature, index) => (
                                <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                                    <div className="space-y-4">
                                        <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color}`}>
                                            <feature.icon className="h-6 w-6 text-white" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                            {feature.title}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            {feature.description}
                                        </p>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </StaggerChildren>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <FadeIn direction="up">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                                How{' '}
                                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                    OnaAseyori
                                </span>{' '}
                                Works
                            </h2>
                            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                                Your journey to career success in four simple steps
                            </p>
                        </div>
                    </FadeIn>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {howItWorks.map((item, index) => (
                            <FadeIn key={index} delay={index * 0.15} direction="up">
                                <div className="relative">
                                    {/* Connector line */}
                                    {index < howItWorks.length - 1 && (
                                        <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-primary to-transparent" />
                                    )}

                                    <div className="text-center space-y-4">
                                        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 text-4xl">
                                            {item.icon}
                                        </div>
                                        <div className="text-sm font-semibold text-primary">Step {item.step}</div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                            {item.title}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <FadeIn direction="up">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                                Success{' '}
                                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                    Stories
                                </span>
                            </h2>
                            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                                Hear from our community of learners and mentors
                            </p>
                        </div>
                    </FadeIn>

                    <div className="grid md:grid-cols-3 gap-6">
                        {testimonials.map((testimonial, index) => (
                            <FadeIn key={index} delay={index * 0.15} direction="up">
                                <Card className="p-6 h-full">
                                    <div className="space-y-4">
                                        <div className="flex items-center space-x-3">
                                            <img
                                                src={testimonial.avatar}
                                                alt={testimonial.name}
                                                className="w-12 h-12 rounded-full"
                                            />
                                            <div>
                                                <h4 className="font-semibold text-gray-900 dark:text-white">
                                                    {testimonial.name}
                                                </h4>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    {testimonial.role}
                                                </p>
                                            </div>
                                        </div>
                                        <p className="text-gray-700 dark:text-gray-300 italic">
                                            "{testimonial.content}"
                                        </p>
                                        <div className="flex text-amber-500">
                                            {[...Array(testimonial.rating)].map((_, i) => (
                                                <Star key={i} className="w-4 h-4 fill-current" />
                                            ))}
                                        </div>
                                    </div>
                                </Card>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <Card className="p-12 text-center bg-gradient-to-br from-primary/5 via-secondary/5 to-transparent">
                        <FadeIn direction="up">
                            <div className="space-y-6 max-w-3xl mx-auto">
                                <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
                                    Ready to Transform Your{' '}
                                    <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                        Career?
                                    </span>
                                </h2>
                                <p className="text-xl text-gray-600 dark:text-gray-300">
                                    Join thousands of learners who have found their path with OnaAseyori
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    {isAuthenticated ? (
                                        <Button
                                            size="lg"
                                            variant="primary"
                                            icon={<ArrowRight />}
                                            iconPosition="right"
                                            as={Link}
                                            to="/dashboard"
                                        >
                                            Continue Learning
                                        </Button>
                                    ) : (
                                        <>
                                            <Button
                                                size="lg"
                                                variant="primary"
                                                icon={<ArrowRight />}
                                                iconPosition="right"
                                                as={Link}
                                                to="/register"
                                            >
                                                Start Free Trial
                                            </Button>
                                            <Button
                                                size="lg"
                                                variant="outline"
                                                as={Link}
                                                to="/login"
                                            >
                                                Sign In
                                            </Button>
                                        </>
                                    )}
                                </div>
                                <p className="text-sm text-gray-500">
                                    <CheckCircle className="w-4 h-4 inline mr-1 text-success" />
                                    No credit card required • 14-day free trial • Cancel anytime
                                </p>
                            </div>
                        </FadeIn>
                    </Card>
                </div>
            </section>
        </div>
    )
}

export default LandingPage
