import React, { useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lock, Eye, EyeOff, CheckCircle, ArrowLeft } from 'lucide-react'

import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import FadeIn from '@/components/animations/FadeIn'
import { useAuth } from '@/hooks/useAuth'

const ResetPassword: React.FC = () => {
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [searchParams] = useSearchParams()
    const token = searchParams.get('token') || ''

    const { resetUserPassword, isLoading, error, clearAuthError } = useAuth()

    const getPasswordStrength = (password: string) => {
        let strength = 0
        if (password.length >= 8) strength++
        if (/[A-Z]/.test(password)) strength++
        if (/[a-z]/.test(password)) strength++
        if (/[0-9]/.test(password)) strength++
        if (/[^A-Za-z0-9]/.test(password)) strength++
        return strength
    }

    const passwordStrength = getPasswordStrength(password)
    const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-lime-500', 'bg-green-500']

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        clearAuthError()

        if (password !== confirmPassword) {
            return
        }

        try {
            await resetUserPassword(token, password)
            setIsSuccess(true)
        } catch {
            // Error is handled by the hook
        }
    }

    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <FadeIn direction="up">
                        <Card className="p-8 text-center">
                            <div className="inline-flex p-4 rounded-full bg-red-100 dark:bg-red-900/20 mb-6">
                                <Lock className="w-12 h-12 text-red-500" />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                Invalid Reset Link
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                This password reset link is invalid or has expired.
                            </p>
                            <Button
                                variant="primary"
                                as={Link}
                                to="/forgot-password"
                                fullWidth
                            >
                                Request New Link
                            </Button>
                        </Card>
                    </FadeIn>
                </div>
            </div>
        )
    }

    if (isSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <FadeIn direction="up">
                        <Card className="p-8 text-center">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', stiffness: 200 }}
                                className="inline-flex p-4 rounded-full bg-success/10 mb-6"
                            >
                                <CheckCircle className="w-12 h-12 text-success" />
                            </motion.div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                Password Reset!
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                Your password has been successfully reset. You can now sign in with your new password.
                            </p>
                            <Button
                                variant="primary"
                                size="lg"
                                fullWidth
                                as={Link}
                                to="/login"
                            >
                                Continue to Login
                            </Button>
                        </Card>
                    </FadeIn>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <FadeIn direction="up">
                    <Card className="p-8">
                        <div className="text-center mb-8">
                            <div className="inline-flex p-4 rounded-full bg-primary/10 mb-4">
                                <Lock className="w-8 h-8 text-primary" />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Reset Password
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-2">
                                Create a new secure password for your account
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
                                    New Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        minLength={8}
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
                                {password && (
                                    <div className="mt-2">
                                        <div className="flex gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <div
                                                    key={i}
                                                    className={`h-1 flex-1 rounded ${i < passwordStrength ? strengthColors[passwordStrength - 1] : 'bg-gray-200'}`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Confirm New Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="Confirm your password"
                                    />
                                </div>
                                {confirmPassword && password !== confirmPassword && (
                                    <p className="text-xs text-red-500 mt-1">Passwords don't match</p>
                                )}
                            </div>

                            <Button
                                type="submit"
                                variant="primary"
                                size="lg"
                                fullWidth
                                loading={isLoading}
                                disabled={!password || password !== confirmPassword}
                            >
                                {isLoading ? 'Resetting...' : 'Reset Password'}
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
                    </Card>
                </FadeIn>
            </div>
        </div>
    )
}

export default ResetPassword
