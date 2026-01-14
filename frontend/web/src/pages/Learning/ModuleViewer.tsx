import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
    ArrowLeft,
    ArrowRight,
    Play,
    Pause,
    Volume2,
    VolumeX,
    Maximize,
    Settings,
    CheckCircle,
    X,
    ChevronLeft,
    ChevronRight,
    FileText,
    Send,
    Code,
    RotateCcw,
} from 'lucide-react'
import { toast } from 'react-hot-toast'

import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Progress } from '@/components/ui/Progress'
import { Textarea } from '@/components/ui/Textarea'
import { Input } from '@/components/ui/Input'
import FadeIn from '@/components/animations/FadeIn'
import { cn } from '@/utils/cn'

interface QuizQuestion {
    id: string
    question: string
    options: string[]
    correctIndex: number
}

interface CodeChallenge {
    id: string
    title: string
    description: string
    starterCode: string
    solution: string
    testCases: { input: string; expected: string }[]
}

// Mock module data
const mockModuleData = {
    id: 'm6',
    title: 'Performance Optimization',
    type: 'video' as const,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    transcript: [
        { time: 0, text: 'Welcome to Performance Optimization in React.' },
        { time: 5, text: 'In this module, we will cover React.memo, useMemo, and useCallback.' },
        { time: 12, text: 'These are essential tools for optimizing the performance of your React applications.' },
        { time: 20, text: 'Let\'s start by understanding when re-renders happen in React.' },
        { time: 28, text: 'By default, when a parent component re-renders, all children re-render too.' },
        { time: 35, text: 'React.memo helps prevent unnecessary re-renders of functional components.' },
    ],
    quiz: {
        questions: [
            {
                id: 'q1',
                question: 'What does React.memo do?',
                options: [
                    'Memoizes expensive calculations',
                    'Prevents unnecessary re-renders of components',
                    'Caches API responses',
                    'Stores values in localStorage',
                ],
                correctIndex: 1,
            },
            {
                id: 'q2',
                question: 'When should you use useMemo?',
                options: [
                    'For every variable',
                    'Only for string values',
                    'For expensive calculations that don\'t need to re-run every render',
                    'Never, it\'s deprecated',
                ],
                correctIndex: 2,
            },
            {
                id: 'q3',
                question: 'What hook should you use to memoize a callback function?',
                options: [
                    'useMemo',
                    'useCallback',
                    'useRef',
                    'useEffect',
                ],
                correctIndex: 1,
            },
        ] as QuizQuestion[],
        passingScore: 66,
    },
    codeChallenge: {
        id: 'c1',
        title: 'Optimize Component Rendering',
        description: 'Use React.memo to prevent unnecessary re-renders of the ExpensiveComponent.',
        starterCode: `import React from 'react';

function ExpensiveComponent({ name, onClick }) {
  console.log('ExpensiveComponent rendered');
  return (
    <div onClick={onClick}>
      Hello, {name}!
    </div>
  );
}

export default ExpensiveComponent;`,
        solution: `import React from 'react';

const ExpensiveComponent = React.memo(function ExpensiveComponent({ name, onClick }) {
  console.log('ExpensiveComponent rendered');
  return (
    <div onClick={onClick}>
      Hello, {name}!
    </div>
  );
});

export default ExpensiveComponent;`,
        testCases: [
            { input: 'Component should be wrapped in React.memo', expected: 'true' },
        ],
    } as CodeChallenge,
}

type ViewMode = 'video' | 'transcript' | 'quiz' | 'exercise' | 'project'

const ModuleViewer: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const videoRef = useRef<HTMLVideoElement>(null)

    // Video state
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [volume, setVolume] = useState(1)
    const [isMuted, setIsMuted] = useState(false)
    const [showTranscript, setShowTranscript] = useState(true)
    const [activeTranscriptIndex, setActiveTranscriptIndex] = useState(0)

    // Quiz state
    const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({})
    const [quizSubmitted, setQuizSubmitted] = useState(false)
    const [quizScore, setQuizScore] = useState(0)
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)

    // Code editor state
    const [code, setCode] = useState(mockModuleData.codeChallenge.starterCode)
    const [codeOutput, setCodeOutput] = useState('')
    const [codeSubmitted, setCodeSubmitted] = useState(false)

    // View mode
    const [viewMode, setViewMode] = useState<ViewMode>('video')

    // Video controls
    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause()
            } else {
                videoRef.current.play()
            }
            setIsPlaying(!isPlaying)
        }
    }

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted
            setIsMuted(!isMuted)
        }
    }

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime)

            // Update active transcript
            const transcript = mockModuleData.transcript
            for (let i = transcript.length - 1; i >= 0; i--) {
                if (videoRef.current.currentTime >= transcript[i].time) {
                    setActiveTranscriptIndex(i)
                    break
                }
            }
        }
    }

    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            setDuration(videoRef.current.duration)
        }
    }

    const seekTo = (time: number) => {
        if (videoRef.current) {
            videoRef.current.currentTime = time
        }
    }

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = Math.floor(seconds % 60)
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    // Quiz handlers
    const handleQuizAnswer = (questionId: string, answerIndex: number) => {
        setQuizAnswers(prev => ({ ...prev, [questionId]: answerIndex }))
    }

    const submitQuiz = () => {
        const questions = mockModuleData.quiz.questions
        let correct = 0
        questions.forEach(q => {
            if (quizAnswers[q.id] === q.correctIndex) {
                correct++
            }
        })
        const score = Math.round((correct / questions.length) * 100)
        setQuizScore(score)
        setQuizSubmitted(true)

        if (score >= mockModuleData.quiz.passingScore) {
            toast.success(`Congratulations! You scored ${score}%`)
        } else {
            toast.error(`You scored ${score}%. ${mockModuleData.quiz.passingScore}% required to pass.`)
        }
    }

    const resetQuiz = () => {
        setQuizAnswers({})
        setQuizSubmitted(false)
        setQuizScore(0)
        setCurrentQuestionIndex(0)
    }

    // Code editor handlers
    const runCode = () => {
        // Simulate code execution
        if (code.includes('React.memo')) {
            setCodeOutput('✓ Component is wrapped in React.memo\n✓ All tests passed!')
            setCodeSubmitted(true)
            toast.success('Great job! All tests passed.')
        } else {
            setCodeOutput('✗ Component should be wrapped in React.memo\n\nHint: Wrap your component with React.memo()')
            setCodeSubmitted(false)
        }
    }

    const resetCode = () => {
        setCode(mockModuleData.codeChallenge.starterCode)
        setCodeOutput('')
        setCodeSubmitted(false)
    }

    const handleComplete = () => {
        toast.success('Module completed! +50 XP')
        navigate(-1)
    }

    const currentQuestion = mockModuleData.quiz.questions[currentQuestionIndex]

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            {/* Header */}
            <div className="bg-gray-800 border-b border-gray-700 px-4 py-3">
                <div className="flex items-center justify-between max-w-7xl mx-auto">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            icon={<ArrowLeft />}
                            onClick={() => navigate(-1)}
                            className="text-white hover:bg-gray-700"
                        >
                            Back
                        </Button>
                        <span className="text-gray-400">|</span>
                        <h1 className="text-lg font-semibold">{mockModuleData.title}</h1>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant={viewMode === 'video' ? 'primary' : 'ghost'}
                            size="sm"
                            onClick={() => setViewMode('video')}
                            className={viewMode !== 'video' ? 'text-gray-400 hover:bg-gray-700' : ''}
                        >
                            Video
                        </Button>
                        <Button
                            variant={viewMode === 'quiz' ? 'primary' : 'ghost'}
                            size="sm"
                            onClick={() => setViewMode('quiz')}
                            className={viewMode !== 'quiz' ? 'text-gray-400 hover:bg-gray-700' : ''}
                        >
                            Quiz
                        </Button>
                        <Button
                            variant={viewMode === 'exercise' ? 'primary' : 'ghost'}
                            size="sm"
                            onClick={() => setViewMode('exercise')}
                            className={viewMode !== 'exercise' ? 'text-gray-400 hover:bg-gray-700' : ''}
                        >
                            Exercise
                        </Button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-4">
                <AnimatePresence mode="wait">
                    {/* Video Player */}
                    {viewMode === 'video' && (
                        <motion.div
                            key="video"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="grid lg:grid-cols-3 gap-6"
                        >
                            {/* Video */}
                            <div className="lg:col-span-2">
                                <div className="bg-black rounded-lg overflow-hidden">
                                    <div className="relative aspect-video">
                                        <video
                                            ref={videoRef}
                                            src={mockModuleData.videoUrl}
                                            className="w-full h-full"
                                            onTimeUpdate={handleTimeUpdate}
                                            onLoadedMetadata={handleLoadedMetadata}
                                            onPlay={() => setIsPlaying(true)}
                                            onPause={() => setIsPlaying(false)}
                                        />

                                        {/* Video Overlay Controls */}
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/20">
                                            <button
                                                onClick={togglePlay}
                                                className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                                            >
                                                {isPlaying ? (
                                                    <Pause className="w-8 h-8 text-white" />
                                                ) : (
                                                    <Play className="w-8 h-8 text-white ml-1" />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Video Controls */}
                                    <div className="bg-gray-800 p-4 space-y-2">
                                        {/* Progress Bar */}
                                        <div className="relative h-1 bg-gray-600 rounded-full cursor-pointer group"
                                            onClick={(e) => {
                                                const rect = e.currentTarget.getBoundingClientRect()
                                                const percent = (e.clientX - rect.left) / rect.width
                                                seekTo(percent * duration)
                                            }}
                                        >
                                            <div
                                                className="absolute h-full bg-primary rounded-full"
                                                style={{ width: `${(currentTime / duration) * 100}%` }}
                                            />
                                            <div
                                                className="absolute w-3 h-3 bg-primary rounded-full -top-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                style={{ left: `${(currentTime / duration) * 100}%`, transform: 'translateX(-50%)' }}
                                            />
                                        </div>

                                        {/* Controls Row */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <button onClick={togglePlay} className="hover:text-primary transition-colors">
                                                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                                                </button>
                                                <button onClick={toggleMute} className="hover:text-primary transition-colors">
                                                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                                                </button>
                                                <span className="text-sm text-gray-400">
                                                    {formatTime(currentTime)} / {formatTime(duration)}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button className="hover:text-primary transition-colors">
                                                    <Settings className="w-5 h-5" />
                                                </button>
                                                <button className="hover:text-primary transition-colors">
                                                    <Maximize className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Transcript */}
                            <div className="lg:col-span-1">
                                <div className="bg-gray-800 rounded-lg p-4 h-[500px] overflow-y-auto">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-semibold">Transcript</h3>
                                        <Badge variant="secondary">{mockModuleData.transcript.length} segments</Badge>
                                    </div>
                                    <div className="space-y-2">
                                        {mockModuleData.transcript.map((item, index) => (
                                            <button
                                                key={index}
                                                onClick={() => seekTo(item.time)}
                                                className={cn(
                                                    'w-full text-left p-3 rounded-lg transition-colors',
                                                    index === activeTranscriptIndex
                                                        ? 'bg-primary/20 border border-primary/50'
                                                        : 'hover:bg-gray-700'
                                                )}
                                            >
                                                <span className="text-xs text-gray-500 block mb-1">
                                                    {formatTime(item.time)}
                                                </span>
                                                <span className="text-sm">{item.text}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Quiz */}
                    {viewMode === 'quiz' && (
                        <motion.div
                            key="quiz"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="max-w-2xl mx-auto"
                        >
                            <div className="bg-gray-800 rounded-lg p-6">
                                {!quizSubmitted ? (
                                    <>
                                        <div className="flex items-center justify-between mb-6">
                                            <h2 className="text-xl font-semibold">Knowledge Check</h2>
                                            <Badge>
                                                Question {currentQuestionIndex + 1} of {mockModuleData.quiz.questions.length}
                                            </Badge>
                                        </div>

                                        <Progress
                                            value={((currentQuestionIndex + 1) / mockModuleData.quiz.questions.length) * 100}
                                            className="mb-6"
                                        />

                                        <h3 className="text-lg mb-4">{currentQuestion.question}</h3>

                                        <div className="space-y-3 mb-6">
                                            {currentQuestion.options.map((option, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => handleQuizAnswer(currentQuestion.id, index)}
                                                    className={cn(
                                                        'w-full p-4 rounded-lg text-left transition-all border-2',
                                                        quizAnswers[currentQuestion.id] === index
                                                            ? 'border-primary bg-primary/10'
                                                            : 'border-gray-600 hover:border-gray-500'
                                                    )}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={cn(
                                                            'w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium',
                                                            quizAnswers[currentQuestion.id] === index
                                                                ? 'bg-primary text-white'
                                                                : 'bg-gray-600'
                                                        )}>
                                                            {String.fromCharCode(65 + index)}
                                                        </div>
                                                        <span>{option}</span>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>

                                        <div className="flex justify-between">
                                            <Button
                                                variant="outline"
                                                icon={<ChevronLeft />}
                                                onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                                                disabled={currentQuestionIndex === 0}
                                                className="border-gray-600 text-white"
                                            >
                                                Previous
                                            </Button>
                                            {currentQuestionIndex < mockModuleData.quiz.questions.length - 1 ? (
                                                <Button
                                                    variant="primary"
                                                    icon={<ChevronRight />}
                                                    iconPosition="right"
                                                    onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                                                    disabled={quizAnswers[currentQuestion.id] === undefined}
                                                >
                                                    Next
                                                </Button>
                                            ) : (
                                                <Button
                                                    variant="primary"
                                                    onClick={submitQuiz}
                                                    disabled={Object.keys(quizAnswers).length < mockModuleData.quiz.questions.length}
                                                >
                                                    Submit Quiz
                                                </Button>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center">
                                        <div className={cn(
                                            'w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center',
                                            quizScore >= mockModuleData.quiz.passingScore
                                                ? 'bg-green-500/20'
                                                : 'bg-red-500/20'
                                        )}>
                                            <span className="text-3xl font-bold">
                                                {quizScore}%
                                            </span>
                                        </div>
                                        <h2 className="text-xl font-semibold mb-2">
                                            {quizScore >= mockModuleData.quiz.passingScore ? 'Great Job!' : 'Keep Practicing'}
                                        </h2>
                                        <p className="text-gray-400 mb-6">
                                            {quizScore >= mockModuleData.quiz.passingScore
                                                ? 'You have successfully completed this quiz.'
                                                : `You need ${mockModuleData.quiz.passingScore}% to pass. Try again!`}
                                        </p>
                                        <div className="flex gap-3 justify-center">
                                            <Button variant="outline" onClick={resetQuiz} className="border-gray-600">
                                                Try Again
                                            </Button>
                                            {quizScore >= mockModuleData.quiz.passingScore && (
                                                <Button variant="primary" onClick={handleComplete}>
                                                    Complete Module
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {/* Code Exercise */}
                    {viewMode === 'exercise' && (
                        <motion.div
                            key="exercise"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="grid lg:grid-cols-2 gap-6"
                        >
                            {/* Instructions */}
                            <div className="bg-gray-800 rounded-lg p-6">
                                <h2 className="text-xl font-semibold mb-4">{mockModuleData.codeChallenge.title}</h2>
                                <p className="text-gray-400 mb-6">{mockModuleData.codeChallenge.description}</p>

                                <div className="bg-gray-900 rounded-lg p-4 mb-6">
                                    <h3 className="text-sm font-medium text-gray-400 mb-2">Expected Output:</h3>
                                    <pre className="text-sm text-green-400">
                                        ✓ Component should be wrapped in React.memo{'\n'}
                                        ✓ All tests passed!
                                    </pre>
                                </div>

                                {/* Output */}
                                {codeOutput && (
                                    <div className={cn(
                                        'rounded-lg p-4',
                                        codeSubmitted ? 'bg-green-900/20' : 'bg-red-900/20'
                                    )}>
                                        <h3 className="text-sm font-medium mb-2">Output:</h3>
                                        <pre className="text-sm whitespace-pre-wrap">{codeOutput}</pre>
                                    </div>
                                )}
                            </div>

                            {/* Code Editor */}
                            <div className="bg-gray-800 rounded-lg overflow-hidden">
                                <div className="flex items-center justify-between px-4 py-2 bg-gray-700">
                                    <div className="flex items-center gap-2">
                                        <Code className="w-4 h-4" />
                                        <span className="text-sm">ExpensiveComponent.jsx</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            icon={<RotateCcw className="w-4 h-4" />}
                                            onClick={resetCode}
                                            className="text-gray-400 hover:text-white"
                                        >
                                            Reset
                                        </Button>
                                    </div>
                                </div>
                                <textarea
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    className="w-full h-80 bg-gray-900 text-gray-100 p-4 font-mono text-sm resize-none focus:outline-none"
                                    spellCheck={false}
                                />
                                <div className="px-4 py-3 bg-gray-700 flex justify-between">
                                    <Button
                                        variant="outline"
                                        onClick={() => setCode(mockModuleData.codeChallenge.solution)}
                                        className="border-gray-600"
                                    >
                                        Show Solution
                                    </Button>
                                    <Button variant="primary" icon={<Play />} onClick={runCode}>
                                        Run Code
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Complete Module Button */}
                {(viewMode === 'video' || (viewMode === 'exercise' && codeSubmitted)) && (
                    <div className="mt-6 flex justify-end">
                        <Button variant="primary" size="lg" icon={<CheckCircle />} onClick={handleComplete}>
                            Mark as Complete
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ModuleViewer
