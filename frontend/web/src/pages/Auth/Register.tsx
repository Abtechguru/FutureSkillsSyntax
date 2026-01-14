import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
    User,
    Users,
    Briefcase,
    Heart,
    Mail,
    Lock,
    Eye,
    EyeOff,
    ArrowRight,
    ArrowLeft,
    CheckCircle,
    MapPin,
    Sparkles,
} from 'lucide-react'

import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import FadeIn from '@/components/animations/FadeIn'
import { useAuth } from '@/hooks/useAuth'

// Role type
type UserRole = 'mentee' | 'mentor' | 'career_seeker' | 'parent'

// Role cards data
const roles = [
    {
        id: 'mentee' as UserRole,
        icon: User,
        title: 'Mentee',
        description: 'I want to learn new skills and get guidance',
        color: 'from-blue-500 to-blue-600',
    },
    {
        id: 'mentor' as UserRole,
        icon: Users,
        title: 'Mentor',
        description: 'I want to share my expertise and guide others',
        color: 'from-green-500 to-green-600',
    },
    {
        id: 'career_seeker' as UserRole,
        icon: Briefcase,
        title: 'Career Seeker',
        description: 'I want to explore and plan my career path',
        color: 'from-purple-500 to-purple-600',
    },
    {
        id: 'parent' as UserRole,
        icon: Heart,
        title: 'Parent',
        description: "I want to support my child's learning journey",
        color: 'from-pink-500 to-pink-600',
    },
]

// Skills and interests options
const skillOptions = [
    'JavaScript', 'Python', 'React', 'Node.js', 'Data Science',
    'Machine Learning', 'UI/UX Design', 'DevOps', 'Mobile Development',
    'Cloud Computing', 'Cybersecurity', 'Blockchain', 'Project Management',
]

const interestOptions = [
    'Web Development', 'Mobile Apps', 'AI & Machine Learning', 'Data Analytics',
    'Game Development', 'Cloud Architecture', 'Startup Building', 'Open Source',
    'Tech Leadership', 'Product Design', 'Remote Work', 'Freelancing',
]

const Register: React.FC = () => {
    const { register, isLoading, error, registrationStep, registrationData, setStep, updateRegData, clearAuthError } = useAuth()

    const [formData, setFormData] = useState({
        role: registrationData?.role || null as UserRole | null,
        email: registrationData?.email || '',
        password: '',
        confirmPassword: '',
        firstName: registrationData?.firstName || '',
        lastName: registrationData?.lastName || '',
        location: registrationData?.location || '',
        bio: registrationData?.bio || '',
        skills: registrationData?.skills || [] as string[],
        interests: registrationData?.interests || [] as string[],
        verificationCode: '',
    })
    const [showPassword, setShowPassword] = useState(false)

    const currentStep = registrationStep
    const totalSteps = 5

    // Clear errors when component mounts
    useEffect(() => {
        clearAuthError()
    }, [clearAuthError])

    const getPasswordStrength = (password: string) => {
        let strength = 0
        if (password.length >= 8) strength++
        if (/[A-Z]/.test(password)) strength++
        if (/[a-z]/.test(password)) strength++
        if (/[0-9]/.test(password)) strength++
        if (/[^A-Za-z0-9]/.test(password)) strength++
        return strength
    }

    const passwordStrength = getPasswordStrength(formData.password)
    const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong']
    const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-lime-500', 'bg-green-500']

    const handleNext = () => {
        if (currentStep < totalSteps) {
            // Save current step data
            updateRegData({
                role: formData.role || undefined,
                email: formData.email,
                firstName: formData.firstName,
                lastName: formData.lastName,
                location: formData.location,
                bio: formData.bio,
                skills: formData.skills,
                interests: formData.interests,
            })
            setStep(currentStep + 1)
        }
    }

    const handleBack = () => {
        if (currentStep > 1) {
            setStep(currentStep - 1)
        }
    }

    const handleRoleSelect = (role: UserRole) => {
        setFormData(prev => ({ ...prev, role }))
    }

    const toggleSkill = (skill: string) => {
        setFormData(prev => ({
            ...prev,
            skills: prev.skills.includes(skill)
                ? prev.skills.filter((s: string) => s !== skill)
                : [...prev.skills, skill],
        }))
    }

    const toggleInterest = (interest: string) => {
        setFormData(prev => ({
            ...prev,
            interests: prev.interests.includes(interest)
                ? prev.interests.filter((i: string) => i !== interest)
                : [...prev.interests, interest],
        }))
    }

    const handleSubmit = async () => {
        if (!formData.role) return

        await register({
            email: formData.email,
            password: formData.password,
            firstName: formData.firstName,
            lastName: formData.lastName,
            role: formData.role,
            skills: formData.skills,
            interests: formData.interests,
            location: formData.location || undefined,
            bio: formData.bio || undefined,
        })
    }

    const canProceed = () => {
        switch (currentStep) {
            case 1:
                return formData.role !== null
            case 2:
                return formData.email && formData.password.length >= 8 && formData.password === formData.confirmPassword
            case 3:
                return formData.firstName && formData.lastName
            case 4:
                return formData.skills.length > 0 && formData.interests.length > 0
            case 5:
                return formData.verificationCode.length === 6
            default:
                return false
        }
    }

    // Step components
    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-6">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Choose Your Role
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 mt-2">
                                How do you want to use OnaAseyori?
                            </p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {roles.map((role) => (
                                <motion.button
                                    key={role.id}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleRoleSelect(role.id)}
                                    className={`relative p-6 rounded-xl border-2 text-left transition-all ${formData.role === role.id
                                        ? 'border-primary bg-primary/5'
                                        : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
                                        }`}
                                >
                                    <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${role.color} mb-4`}>
                                        <role.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {role.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                        {role.description}
                                    </p>
                                    {formData.role === role.id && (
                                        <CheckCircle className="absolute top-4 right-4 w-5 h-5 text-primary" />
                                    )}
                                </motion.button>
                            ))}
                        </div>
                    </div>
                )

            case 2:
                return (
                    <div className="space-y-6">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Create Your Account
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 mt-2">
                                Enter your email and create a secure password
                            </p>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="you@example.com"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={formData.password}
                                        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                                        className="w-full pl-10 pr-12 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="Create a strong password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
                                    </button>
                                </div>
                                {formData.password && (
                                    <div className="mt-2">
                                        <div className="flex gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <div
                                                    key={i}
                                                    className={`h-1 flex-1 rounded ${i < passwordStrength ? strengthColors[passwordStrength - 1] : 'bg-gray-200'}`}
                                                />
                                            ))}
                                        </div>
                                        <p className="text-xs mt-1 text-gray-500">
                                            {strengthLabels[passwordStrength - 1] || 'Enter a password'}
                                        </p>
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="Confirm your password"
                                    />
                                </div>
                                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                                    <p className="text-xs text-red-500 mt-1">Passwords don't match</p>
                                )}
                            </div>
                        </div>
                    </div>
                )

            case 3:
                return (
                    <div className="space-y-6">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Personal Information
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 mt-2">
                                Tell us a bit about yourself
                            </p>
                        </div>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        First Name
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.firstName}
                                        onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="John"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Last Name
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.lastName}
                                        onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="Doe"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Location (Optional)
                                </label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        value={formData.location}
                                        onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="City, Country"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Short Bio (Optional)
                                </label>
                                <textarea
                                    value={formData.bio}
                                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                                    rows={3}
                                    maxLength={500}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                                    placeholder="Tell us about yourself..."
                                />
                                <p className="text-xs text-gray-500 mt-1">{formData.bio.length}/500 characters</p>
                            </div>
                        </div>
                    </div>
                )

            case 4:
                return (
                    <div className="space-y-6">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Skills & Interests
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 mt-2">
                                Help us personalize your experience
                            </p>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                    Select your skills ({formData.skills.length} selected)
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {skillOptions.map((skill) => (
                                        <button
                                            key={skill}
                                            type="button"
                                            onClick={() => toggleSkill(skill)}
                                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${formData.skills.includes(skill)
                                                ? 'bg-primary text-white'
                                                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                                }`}
                                        >
                                            {skill}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                    Select your interests ({formData.interests.length} selected)
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {interestOptions.map((interest) => (
                                        <button
                                            key={interest}
                                            type="button"
                                            onClick={() => toggleInterest(interest)}
                                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${formData.interests.includes(interest)
                                                ? 'bg-secondary text-white'
                                                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                                }`}
                                        >
                                            {interest}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )

            case 5:
                return (
                    <div className="space-y-6">
                        <div className="text-center">
                            <div className="inline-flex p-4 rounded-full bg-primary/10 mb-4">
                                <Mail className="w-8 h-8 text-primary" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Verify Your Email
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 mt-2">
                                We've sent a 6-digit code to <strong>{formData.email}</strong>
                            </p>
                        </div>
                        <div className="max-w-xs mx-auto">
                            <input
                                type="text"
                                value={formData.verificationCode}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, '').slice(0, 6)
                                    setFormData(prev => ({ ...prev, verificationCode: value }))
                                }}
                                className="w-full px-4 py-4 text-center text-2xl font-mono tracking-[0.5em] rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="000000"
                                maxLength={6}
                                autoComplete="one-time-code"
                                inputMode="numeric"
                            />
                            <button
                                type="button"
                                className="w-full mt-4 text-sm text-primary hover:text-primary/80"
                            >
                                Didn't receive the code? Resend
                            </button>
                        </div>
                    </div>
                )

            default:
                return null
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 py-12">
            <div className="w-full max-w-lg">
                <FadeIn direction="up">
                    <Card className="p-8">
                        {/* Progress Bar */}
                        <div className="mb-8">
                            <div className="flex justify-between mb-2">
                                {[...Array(totalSteps)].map((_, i) => (
                                    <div
                                        key={i}
                                        className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium transition-all ${i + 1 < currentStep
                                            ? 'bg-primary text-white'
                                            : i + 1 === currentStep
                                                ? 'bg-primary text-white ring-4 ring-primary/20'
                                                : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                                            }`}
                                    >
                                        {i + 1 < currentStep ? <CheckCircle className="w-5 h-5" /> : i + 1}
                                    </div>
                                ))}
                            </div>
                            <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-primary"
                                    initial={{ width: '0%' }}
                                    animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
                                    transition={{ duration: 0.3 }}
                                />
                            </div>
                            <p className="text-center text-sm text-gray-500 mt-2">
                                Step {currentStep} of {totalSteps}
                            </p>
                        </div>

                        {/* Error Display */}
                        {error && (
                            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                            </div>
                        )}

                        {/* Step Content */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentStep}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                            >
                                {renderStep()}
                            </motion.div>
                        </AnimatePresence>

                        {/* Navigation Buttons */}
                        <div className="flex gap-4 mt-8">
                            {currentStep > 1 && (
                                <Button
                                    variant="outline"
                                    onClick={handleBack}
                                    icon={<ArrowLeft />}
                                    className="flex-1"
                                    disabled={isLoading}
                                >
                                    Back
                                </Button>
                            )}
                            {currentStep < totalSteps ? (
                                <Button
                                    variant="primary"
                                    onClick={handleNext}
                                    disabled={!canProceed()}
                                    icon={<ArrowRight />}
                                    iconPosition="right"
                                    className="flex-1"
                                >
                                    Continue
                                </Button>
                            ) : (
                                <Button
                                    variant="primary"
                                    onClick={handleSubmit}
                                    disabled={!canProceed()}
                                    loading={isLoading}
                                    icon={<Sparkles />}
                                    className="flex-1"
                                >
                                    {isLoading ? 'Creating Account...' : 'Complete Registration'}
                                </Button>
                            )}
                        </div>

                        {/* Login Link */}
                        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
                            Already have an account?{' '}
                            <Link to="/login" className="font-semibold text-primary hover:text-primary/80">
                                Sign in
                            </Link>
                        </p>
                    </Card>
                </FadeIn>
            </div>
        </div>
    )
}

export default Register
