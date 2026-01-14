import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
    ArrowRight,
    ArrowLeft,
    CheckCircle,
    Sparkles,
    Brain,
    Target,
    Heart,
    Rocket,
} from 'lucide-react'
import { toast } from 'react-hot-toast'

import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { Progress } from '@/components/ui/Progress'
import FadeIn from '@/components/animations/FadeIn'
import { cn } from '@/utils/cn'

type AssessmentStep = 'welcome' | 'personality' | 'skills' | 'interests' | 'results'

interface PersonalityQuestion {
    id: string
    question: string
    category: string
}

interface SkillRating {
    name: string
    rating: number
}

const Assessment: React.FC = () => {
    const navigate = useNavigate()
    const [currentStep, setCurrentStep] = useState<AssessmentStep>('welcome')
    const [isLoading, setIsLoading] = useState(false)

    // Personality answers (1-5 Likert scale)
    const [personalityAnswers, setPersonalityAnswers] = useState<Record<string, number>>({})
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)

    // Skills ratings
    const [skillRatings, setSkillRatings] = useState<SkillRating[]>([
        { name: 'Problem Solving', rating: 0 },
        { name: 'Communication', rating: 0 },
        { name: 'Technical Skills', rating: 0 },
        { name: 'Creativity', rating: 0 },
        { name: 'Leadership', rating: 0 },
        { name: 'Teamwork', rating: 0 },
        { name: 'Time Management', rating: 0 },
        { name: 'Adaptability', rating: 0 },
    ])

    // Selected interests
    const [selectedInterests, setSelectedInterests] = useState<string[]>([])

    const personalityQuestions: PersonalityQuestion[] = [
        { id: 'q1', question: 'I enjoy solving complex problems', category: 'analytical' },
        { id: 'q2', question: 'I prefer working in teams over working alone', category: 'social' },
        { id: 'q3', question: 'I like to plan things in advance', category: 'organized' },
        { id: 'q4', question: 'I am comfortable with taking risks', category: 'enterprising' },
        { id: 'q5', question: 'I enjoy learning new technologies', category: 'innovative' },
        { id: 'q6', question: 'I prefer structured environments over ambiguous ones', category: 'conventional' },
        { id: 'q7', question: 'I am motivated by helping others succeed', category: 'social' },
        { id: 'q8', question: 'I enjoy creative expression and design', category: 'artistic' },
        { id: 'q9', question: 'I am detail-oriented in my work', category: 'analytical' },
        { id: 'q10', question: 'I thrive under pressure and tight deadlines', category: 'enterprising' },
    ]

    const interestOptions = [
        'Web Development', 'Mobile Apps', 'Data Science', 'Machine Learning',
        'Cloud Computing', 'Cybersecurity', 'DevOps', 'Game Development',
        'UI/UX Design', 'Product Management', 'Blockchain', 'IoT',
        'Artificial Intelligence', 'Database Management', 'System Administration',
        'Quality Assurance', 'Technical Writing', 'Project Management',
    ]

    const likertOptions = [
        { value: 1, label: 'Strongly Disagree' },
        { value: 2, label: 'Disagree' },
        { value: 3, label: 'Neutral' },
        { value: 4, label: 'Agree' },
        { value: 5, label: 'Strongly Agree' },
    ]

    const steps = [
        { id: 'welcome', label: 'Welcome' },
        { id: 'personality', label: 'Personality' },
        { id: 'skills', label: 'Skills' },
        { id: 'interests', label: 'Interests' },
        { id: 'results', label: 'Results' },
    ]

    const stepIndex = steps.findIndex(s => s.id === currentStep)
    const progressPercent = ((stepIndex + 1) / steps.length) * 100

    const handlePersonalityAnswer = (questionId: string, value: number) => {
        setPersonalityAnswers(prev => ({ ...prev, [questionId]: value }))
    }

    const nextPersonalityQuestion = () => {
        if (currentQuestionIndex < personalityQuestions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1)
        } else {
            setCurrentStep('skills')
        }
    }

    const prevPersonalityQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1)
        } else {
            setCurrentStep('welcome')
        }
    }

    const handleSkillRating = (skillName: string, rating: number) => {
        setSkillRatings(prev =>
            prev.map(s => s.name === skillName ? { ...s, rating } : s)
        )
    }

    const toggleInterest = (interest: string) => {
        setSelectedInterests(prev =>
            prev.includes(interest)
                ? prev.filter(i => i !== interest)
                : [...prev, interest]
        )
    }

    const handleSubmit = async () => {
        setIsLoading(true)
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000))
            toast.success('Assessment completed!')
            navigate('/career/results')
        } catch (error) {
            toast.error('Failed to submit assessment')
        } finally {
            setIsLoading(false)
        }
    }

    const currentQuestion = personalityQuestions[currentQuestionIndex]

    return (
        <div className="max-w-4xl mx-auto">
            {/* Progress Bar */}
            {currentStep !== 'welcome' && (
                <FadeIn>
                    <div className="mb-8">
                        <div className="flex justify-between mb-2">
                            {steps.map((step, index) => (
                                <div
                                    key={step.id}
                                    className={cn(
                                        'flex items-center gap-2 text-sm',
                                        index <= stepIndex ? 'text-primary' : 'text-gray-400'
                                    )}
                                >
                                    <div className={cn(
                                        'w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium',
                                        index < stepIndex
                                            ? 'bg-primary text-white'
                                            : index === stepIndex
                                                ? 'bg-primary text-white ring-4 ring-primary/20'
                                                : 'bg-gray-200 dark:bg-gray-700'
                                    )}>
                                        {index < stepIndex ? <CheckCircle className="w-4 h-4" /> : index + 1}
                                    </div>
                                    <span className="hidden md:inline">{step.label}</span>
                                </div>
                            ))}
                        </div>
                        <Progress value={progressPercent} variant="primary" />
                    </div>
                </FadeIn>
            )}

            <AnimatePresence mode="wait">
                {/* Welcome Step */}
                {currentStep === 'welcome' && (
                    <motion.div
                        key="welcome"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <Card className="p-8 text-center">
                            <div className="inline-flex p-6 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 mb-6">
                                <Sparkles className="w-16 h-16 text-primary" />
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                                Career Assessment
                            </h1>
                            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto mb-8">
                                Discover your ideal career path through our AI-powered assessment.
                                This will take about 10-15 minutes to complete.
                            </p>

                            <div className="grid md:grid-cols-3 gap-4 mb-8">
                                <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                                    <Brain className="w-8 h-8 text-primary mx-auto mb-2" />
                                    <h3 className="font-semibold text-gray-900 dark:text-white">Personality</h3>
                                    <p className="text-sm text-gray-500">10 questions</p>
                                </div>
                                <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                                    <Target className="w-8 h-8 text-secondary mx-auto mb-2" />
                                    <h3 className="font-semibold text-gray-900 dark:text-white">Skills</h3>
                                    <p className="text-sm text-gray-500">8 ratings</p>
                                </div>
                                <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                                    <Heart className="w-8 h-8 text-pink-500 mx-auto mb-2" />
                                    <h3 className="font-semibold text-gray-900 dark:text-white">Interests</h3>
                                    <p className="text-sm text-gray-500">Select topics</p>
                                </div>
                            </div>

                            <Button
                                variant="primary"
                                size="lg"
                                icon={<ArrowRight />}
                                iconPosition="right"
                                onClick={() => setCurrentStep('personality')}
                            >
                                Start Assessment
                            </Button>
                        </Card>
                    </motion.div>
                )}

                {/* Personality Questions */}
                {currentStep === 'personality' && (
                    <motion.div
                        key="personality"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                    >
                        <Card className="p-8">
                            <div className="text-center mb-8">
                                <div className="inline-flex p-3 rounded-full bg-primary/10 mb-4">
                                    <Brain className="w-6 h-6 text-primary" />
                                </div>
                                <p className="text-sm text-gray-500 mb-2">
                                    Question {currentQuestionIndex + 1} of {personalityQuestions.length}
                                </p>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {currentQuestion.question}
                                </h2>
                            </div>

                            <div className="space-y-3 max-w-lg mx-auto mb-8">
                                {likertOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => handlePersonalityAnswer(currentQuestion.id, option.value)}
                                        className={cn(
                                            'w-full p-4 rounded-lg border-2 text-left transition-all',
                                            personalityAnswers[currentQuestion.id] === option.value
                                                ? 'border-primary bg-primary/5'
                                                : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
                                        )}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium text-gray-900 dark:text-white">
                                                {option.label}
                                            </span>
                                            {personalityAnswers[currentQuestion.id] === option.value && (
                                                <CheckCircle className="w-5 h-5 text-primary" />
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>

                            <div className="flex justify-between">
                                <Button
                                    variant="outline"
                                    icon={<ArrowLeft />}
                                    onClick={prevPersonalityQuestion}
                                >
                                    Back
                                </Button>
                                <Button
                                    variant="primary"
                                    icon={<ArrowRight />}
                                    iconPosition="right"
                                    onClick={nextPersonalityQuestion}
                                    disabled={!personalityAnswers[currentQuestion.id]}
                                >
                                    {currentQuestionIndex < personalityQuestions.length - 1 ? 'Next' : 'Continue'}
                                </Button>
                            </div>
                        </Card>
                    </motion.div>
                )}

                {/* Skills Rating */}
                {currentStep === 'skills' && (
                    <motion.div
                        key="skills"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                    >
                        <Card className="p-8">
                            <div className="text-center mb-8">
                                <div className="inline-flex p-3 rounded-full bg-secondary/10 mb-4">
                                    <Target className="w-6 h-6 text-secondary" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                    Rate Your Skills
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400">
                                    How would you rate your proficiency in these areas?
                                </p>
                            </div>

                            <div className="space-y-6 max-w-2xl mx-auto mb-8">
                                {skillRatings.map((skill) => (
                                    <div key={skill.name} className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium text-gray-900 dark:text-white">
                                                {skill.name}
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                {skill.rating === 0 ? 'Not rated' : `${skill.rating}/5`}
                                            </span>
                                        </div>
                                        <div className="flex gap-2">
                                            {[1, 2, 3, 4, 5].map((value) => (
                                                <button
                                                    key={value}
                                                    onClick={() => handleSkillRating(skill.name, value)}
                                                    className={cn(
                                                        'flex-1 h-10 rounded-lg transition-all',
                                                        skill.rating >= value
                                                            ? 'bg-secondary'
                                                            : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                                                    )}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-between">
                                <Button
                                    variant="outline"
                                    icon={<ArrowLeft />}
                                    onClick={() => {
                                        setCurrentQuestionIndex(personalityQuestions.length - 1)
                                        setCurrentStep('personality')
                                    }}
                                >
                                    Back
                                </Button>
                                <Button
                                    variant="primary"
                                    icon={<ArrowRight />}
                                    iconPosition="right"
                                    onClick={() => setCurrentStep('interests')}
                                    disabled={skillRatings.some(s => s.rating === 0)}
                                >
                                    Continue
                                </Button>
                            </div>
                        </Card>
                    </motion.div>
                )}

                {/* Interests Selection */}
                {currentStep === 'interests' && (
                    <motion.div
                        key="interests"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                    >
                        <Card className="p-8">
                            <div className="text-center mb-8">
                                <div className="inline-flex p-3 rounded-full bg-pink-500/10 mb-4">
                                    <Heart className="w-6 h-6 text-pink-500" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                    Select Your Interests
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Choose at least 3 areas that interest you
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-3 justify-center mb-8">
                                {interestOptions.map((interest) => (
                                    <button
                                        key={interest}
                                        onClick={() => toggleInterest(interest)}
                                        className={cn(
                                            'px-4 py-2 rounded-full text-sm font-medium transition-all',
                                            selectedInterests.includes(interest)
                                                ? 'bg-primary text-white'
                                                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                        )}
                                    >
                                        {interest}
                                    </button>
                                ))}
                            </div>

                            <p className="text-center text-sm text-gray-500 mb-6">
                                {selectedInterests.length} of 3+ selected
                            </p>

                            <div className="flex justify-between">
                                <Button
                                    variant="outline"
                                    icon={<ArrowLeft />}
                                    onClick={() => setCurrentStep('skills')}
                                >
                                    Back
                                </Button>
                                <Button
                                    variant="primary"
                                    icon={<Rocket />}
                                    loading={isLoading}
                                    onClick={handleSubmit}
                                    disabled={selectedInterests.length < 3}
                                >
                                    {isLoading ? 'Analyzing...' : 'Get My Results'}
                                </Button>
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default Assessment
