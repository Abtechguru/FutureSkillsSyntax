import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, ArrowLeft, Send } from 'lucide-react'

import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import FadeIn from '@/components/animations/FadeIn'
import { useAuth } from '@/hooks/useAuth'

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState('')
    const [isSubmitted, setIsSubmitted] = useState(false)
    const { requestPasswordReset, isLoading, error, clearAuthError } = useAuth()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        clearAuthError()
        try {
            await requestPasswordReset(email)
            setIsSubmitted(true)
        } catch {
            // Error is handled by the hook
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <FadeIn direction="up">
                    <Card className="p-8">
                        {isSubmitted ? (
                            <div className="text-center space-y-6">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', stiffness: 200 }}
                                    className="inline-flex p-4 rounded-full bg-success/10"
                                >
                                    <Mail className="w-12 h-12 text-success" />
                                </motion.div>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                        Check Your Email
                                    </h1>
                                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                                        We've sent a password reset link to <strong>{email}</strong>
                                    </p>
                                </div>
                                <div className="space-y-3">
                                    <p className="text-sm text-gray-500">
                                        Didn't receive the email? Check your spam folder or
                                    </p>
                                    <Button
                                        variant="outline"
                                        onClick={() => setIsSubmitted(false)}
                                        fullWidth
                                    >
                                        Try another email
                                    </Button>
                                </div>
                                <Link
                                    to="/login"
                                    className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Back to login
                                </Link>
                            </div>
                        ) : (
                            <>
                                <div className="text-center mb-8">
                                    <div className="inline-flex p-4 rounded-full bg-primary/10 mb-4">
                                        <Mail className="w-8 h-8 text-primary" />
                                    </div>
                                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                        Forgot Password?
                                    </h1>
                                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                                        No worries! Enter your email and we'll send you a reset link.
                                    </p>
                                </div>

                                {error && (
                                    <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Email Address
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent"
                                                placeholder="you@example.com"
                                            />
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        variant="primary"
                                        size="lg"
                                        fullWidth
                                        loading={isLoading}
                                        icon={<Send />}
                                    >
                                        {isLoading ? 'Sending...' : 'Send Reset Link'}
                                    </Button>
                                </form>

                                <div className="mt-6 text-center">
                                    <Link
                                        to="/login"
                                        className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary"
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                        Back to login
                                    </Link>
                                </div>
                            </>
                        )}
                    </Card>
                </FadeIn>
            </div>
        </div>
    )
}

export default ForgotPassword
