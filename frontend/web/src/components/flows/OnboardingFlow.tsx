import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
    ArrowRight,
    ArrowLeft,
    Check,
    User,
    Target,
    BookOpen,
    Sparkles,
    Mail,
    Lock,
    Building,
    Briefcase,
} from 'lucide-react'
import { cn } from '@/utils/cn'
import { ValidatedInput, validationRules, useFormValidation } from '@/components/forms/FormValidation'
import { LoadingOverlay, LoadingButton } from '@/components/loading/LoadingStates'
import { PageTransition } from '@/components/transitions/PageTransitions'
import authService from '@/services/auth'
import { toast } from 'react-hot-toast'

// Onboarding Flow Steps
type OnboardingStep = 'welcome' | 'account' | 'profile' | 'goals' | 'complete'

interface OnboardingData {
    email: string
    password: string
    name: string
    role: string
    company: string
    goals: string[]
    experience: string
}

const OnboardingFlow: React.FC = () => {
    const navigate = useNavigate()
    const [step, setStep] = useState<OnboardingStep>('welcome')
    const [data, setData] = useState<OnboardingData>({
        email: '',
        password: '',
        name: '',
        role: '',
        company: '',
        goals: [],
        experience: 'beginner',
    })
    const [loadingState, setLoadingState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    const [error, setError] = useState<string>()

    const steps: { key: OnboardingStep; label: string; icon: React.ReactNode }[] = [
        { key: 'welcome', label: 'Welcome', icon: <Sparkles /> },
        { key: 'account', label: 'Account', icon: <User /> },
        { key: 'profile', label: 'Profile', icon: <Briefcase /> },
        { key: 'goals', label: 'Goals', icon: <Target /> },
        { key: 'complete', label: 'Complete', icon: <Check /> },
    ]

    const currentStepIndex = steps.findIndex(s => s.key === step)

    const nextStep = () => {
        const nextIndex = currentStepIndex + 1
        if (nextIndex < steps.length) {
            setStep(steps[nextIndex].key)
        }
    }

    const prevStep = () => {
        const prevIndex = currentStepIndex - 1
        if (prevIndex >= 0) {
            setStep(steps[prevIndex].key)
        }
    }

    const handleSubmit = async () => {
        setLoadingState('loading')
        try {
            await authService.register({
                email: data.email,
                password: data.password,
                name: data.name,
                role: data.role,
                company: data.company,
                goals: data.goals,
                experience: data.experience,
            })
            setLoadingState('success')
            setTimeout(() => {
                navigate('/assessment')
            }, 1500)
        } catch (err: any) {
            setLoadingState('error')
            setError(err.message || 'Registration failed')
        }
    }

    const goals = [
        { id: 'frontend', label: 'Frontend Development', icon: '🎨' },
        { id: 'backend', label: 'Backend Development', icon: '⚙️' },
        { id: 'fullstack', label: 'Full Stack', icon: '🚀' },
        { id: 'mobile', label: 'Mobile Development', icon: '📱' },
        { id: 'data', label: 'Data Science', icon: '📊' },
        { id: 'cloud', label: 'Cloud & DevOps', icon: '☁️' },
        { id: 'ai', label: 'AI & Machine Learning', icon: '🤖' },
        { id: 'leadership', label: 'Technical Leadership', icon: '👔' },
    ]

    const experienceLevels = [
        { value: 'beginner', label: 'Beginner', desc: 'New to tech' },
        { value: 'intermediate', label: 'Intermediate', desc: '1-3 years' },
        { value: 'advanced', label: 'Advanced', desc: '3+ years' },
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-purple-500/5">
            {/* Loading Overlay */}
            <LoadingOverlay
                state={loadingState}
                message={loadingState === 'loading' ? 'Creating your account...' : 'Account created!'}
                error={error}
                onRetry={() => {
                    setLoadingState('idle')
                    setError(undefined)
                }}
                onDismiss={() => setLoadingState('idle')}
            />

            {/* Progress Bar */}
            <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-800 z-50">
                <motion.div
                    className="h-full bg-gradient-to-r from-primary to-purple-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
                    transition={{ duration: 0.3 }}
                />
            </div>

            {/* Step Indicators */}
            <div className="max-w-2xl mx-auto pt-8 px-4">
                <div className="flex justify-between items-center mb-12">
                    {steps.map((s, i) => (
                        <div
                            key={s.key}
                            className={cn(
                                'flex flex-col items-center',
                                i <= currentStepIndex ? 'text-primary' : 'text-gray-400'
                            )}
                        >
                            <div
                                className={cn(
                                    'w-10 h-10 rounded-full flex items-center justify-center transition-colors',
                                    i < currentStepIndex
                                        ? 'bg-primary text-white'
                                        : i === currentStepIndex
                                            ? 'bg-primary/20 text-primary border-2 border-primary'
                                            : 'bg-gray-100 dark:bg-gray-800'
                                )}
                            >
                                {i < currentStepIndex ? (
                                    <Check className="w-5 h-5" />
                                ) : (
                                    <span className="text-sm font-semibold">{i + 1}</span>
                                )}
                            </div>
                            <span className="mt-2 text-xs font-medium hidden md:block">{s.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="max-w-xl mx-auto px-4 pb-24">
                <AnimatePresence mode="wait">
                    {/* Welcome Step */}
                    {step === 'welcome' && (
                        <PageTransition key="welcome" transition="fade">
                            <div className="text-center">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center"
                                >
                                    <BookOpen className="w-12 h-12 text-white" />
                                </motion.div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                                    Welcome to FutureSkills
                                </h1>
                                <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                                    Your personalized learning journey starts here. Let's set up your profile
                                    and discover the best path for your career growth.
                                </p>
                                <LoadingButton variant="primary" onClick={nextStep} className="px-8 py-3">
                                    Get Started <ArrowRight className="w-4 h-4 ml-2" />
                                </LoadingButton>
                            </div>
                        </PageTransition>
                    )}

                    {/* Account Step */}
                    {step === 'account' && (
                        <PageTransition key="account" transition="slide-left">
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                    Create Your Account
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400 mb-6">
                                    Enter your email and create a secure password
                                </p>

                                <div className="space-y-4">
                                    <ValidatedInput
                                        id="email"
                                        type="email"
                                        label="Email Address"
                                        placeholder="you@example.com"
                                        rules={[validationRules.required(), validationRules.email()]}
                                        value={data.email}
                                        onChange={(e) => setData({ ...data, email: e.target.value })}
                                    />

                                    <ValidatedInput
                                        id="password"
                                        type="password"
                                        label="Password"
                                        placeholder="Create a strong password"
                                        rules={[validationRules.required(), validationRules.password()]}
                                        showStrength
                                        value={data.password}
                                        onChange={(e) => setData({ ...data, password: e.target.value })}
                                    />
                                </div>

                                <div className="flex gap-3 mt-8">
                                    <LoadingButton variant="outline" onClick={prevStep}>
                                        <ArrowLeft className="w-4 h-4 mr-2" /> Back
                                    </LoadingButton>
                                    <LoadingButton
                                        variant="primary"
                                        onClick={nextStep}
                                        disabled={!data.email || !data.password}
                                        className="flex-1"
                                    >
                                        Continue <ArrowRight className="w-4 h-4 ml-2" />
                                    </LoadingButton>
                                </div>
                            </div>
                        </PageTransition>
                    )}

                    {/* Profile Step */}
                    {step === 'profile' && (
                        <PageTransition key="profile" transition="slide-left">
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                    Tell Us About Yourself
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400 mb-6">
                                    Help us personalize your experience
                                </p>

                                <div className="space-y-4">
                                    <ValidatedInput
                                        id="name"
                                        type="text"
                                        label="Full Name"
                                        placeholder="John Doe"
                                        rules={[validationRules.required()]}
                                        value={data.name}
                                        onChange={(e) => setData({ ...data, name: e.target.value })}
                                    />

                                    <ValidatedInput
                                        id="role"
                                        type="text"
                                        label="Current Role"
                                        placeholder="Software Developer"
                                        value={data.role}
                                        onChange={(e) => setData({ ...data, role: e.target.value })}
                                    />

                                    <ValidatedInput
                                        id="company"
                                        type="text"
                                        label="Company (Optional)"
                                        placeholder="Acme Inc"
                                        value={data.company}
                                        onChange={(e) => setData({ ...data, company: e.target.value })}
                                    />

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Experience Level
                                        </label>
                                        <div className="grid grid-cols-3 gap-3">
                                            {experienceLevels.map((level) => (
                                                <button
                                                    key={level.value}
                                                    type="button"
                                                    onClick={() => setData({ ...data, experience: level.value })}
                                                    className={cn(
                                                        'p-3 rounded-lg border-2 transition-all text-left',
                                                        data.experience === level.value
                                                            ? 'border-primary bg-primary/10'
                                                            : 'border-gray-200 dark:border-gray-600 hover:border-primary/50'
                                                    )}
                                                >
                                                    <span className="font-medium text-gray-900 dark:text-white">
                                                        {level.label}
                                                    </span>
                                                    <span className="block text-xs text-gray-500 mt-1">
                                                        {level.desc}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3 mt-8">
                                    <LoadingButton variant="outline" onClick={prevStep}>
                                        <ArrowLeft className="w-4 h-4 mr-2" /> Back
                                    </LoadingButton>
                                    <LoadingButton
                                        variant="primary"
                                        onClick={nextStep}
                                        disabled={!data.name}
                                        className="flex-1"
                                    >
                                        Continue <ArrowRight className="w-4 h-4 ml-2" />
                                    </LoadingButton>
                                </div>
                            </div>
                        </PageTransition>
                    )}

                    {/* Goals Step */}
                    {step === 'goals' && (
                        <PageTransition key="goals" transition="slide-left">
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                    What Are Your Goals?
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400 mb-6">
                                    Select areas you want to focus on (pick at least 2)
                                </p>

                                <div className="grid grid-cols-2 gap-3">
                                    {goals.map((goal) => {
                                        const isSelected = data.goals.includes(goal.id)
                                        return (
                                            <motion.button
                                                key={goal.id}
                                                type="button"
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => {
                                                    setData({
                                                        ...data,
                                                        goals: isSelected
                                                            ? data.goals.filter((g) => g !== goal.id)
                                                            : [...data.goals, goal.id],
                                                    })
                                                }}
                                                className={cn(
                                                    'flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left',
                                                    isSelected
                                                        ? 'border-primary bg-primary/10'
                                                        : 'border-gray-200 dark:border-gray-600 hover:border-primary/50'
                                                )}
                                            >
                                                <span className="text-2xl">{goal.icon}</span>
                                                <span className={cn(
                                                    'font-medium',
                                                    isSelected ? 'text-primary' : 'text-gray-900 dark:text-white'
                                                )}>
                                                    {goal.label}
                                                </span>
                                                {isSelected && (
                                                    <Check className="w-5 h-5 text-primary ml-auto" />
                                                )}
                                            </motion.button>
                                        )
                                    })}
                                </div>

                                <div className="flex gap-3 mt-8">
                                    <LoadingButton variant="outline" onClick={prevStep}>
                                        <ArrowLeft className="w-4 h-4 mr-2" /> Back
                                    </LoadingButton>
                                    <LoadingButton
                                        variant="primary"
                                        onClick={handleSubmit}
                                        disabled={data.goals.length < 2}
                                        className="flex-1"
                                    >
                                        Create Account <ArrowRight className="w-4 h-4 ml-2" />
                                    </LoadingButton>
                                </div>
                            </div>
                        </PageTransition>
                    )}

                    {/* Complete Step */}
                    {step === 'complete' && (
                        <PageTransition key="complete" transition="zoom">
                            <div className="text-center">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', stiffness: 200 }}
                                    className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center"
                                >
                                    <Check className="w-12 h-12 text-white" />
                                </motion.div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                                    You're All Set!
                                </h1>
                                <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                                    Your account has been created. Let's take you through a quick assessment
                                    to personalize your learning experience.
                                </p>
                                <LoadingButton
                                    variant="primary"
                                    onClick={() => navigate('/assessment')}
                                    className="px-8 py-3"
                                >
                                    Start Assessment <ArrowRight className="w-4 h-4 ml-2" />
                                </LoadingButton>
                            </div>
                        </PageTransition>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}

export default OnboardingFlow
