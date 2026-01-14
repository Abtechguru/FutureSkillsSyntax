import React, { useEffect, useState } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Loader2, Mail } from 'lucide-react'

import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import api from '@/services/api'

type VerificationStatus = 'loading' | 'success' | 'error' | 'no-token'

const VerifyEmail: React.FC = () => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const [status, setStatus] = useState<VerificationStatus>('loading')
    const [message, setMessage] = useState('')
    const token = searchParams.get('token')

    useEffect(() => {
        if (!token) {
            setStatus('no-token')
            setMessage('No verification token provided')
            return
        }

        const verifyEmail = async () => {
            try {
                const response = await api.auth.verifyEmail(token)
                setStatus('success')
                setMessage(response.data.message || 'Email verified successfully!')

                // Redirect to login after 3 seconds
                setTimeout(() => {
                    navigate('/login', {
                        state: { message: 'Email verified! You can now log in.' }
                    })
                }, 3000)
            } catch (error: any) {
                setStatus('error')
                setMessage(error.response?.data?.detail || 'Verification failed. The link may be invalid or expired.')
            }
        }

        verifyEmail()
    }, [token, navigate])

    const statusConfig = {
        loading: {
            icon: <Loader2 className="w-16 h-16 text-primary animate-spin" />,
            title: 'Verifying your email...',
            subtitle: 'Please wait while we verify your email address.',
        },
        success: {
            icon: <CheckCircle className="w-16 h-16 text-green-500" />,
            title: 'Email Verified!',
            subtitle: message,
        },
        error: {
            icon: <XCircle className="w-16 h-16 text-red-500" />,
            title: 'Verification Failed',
            subtitle: message,
        },
        'no-token': {
            icon: <Mail className="w-16 h-16 text-gray-400" />,
            title: 'No Token Provided',
            subtitle: 'Please use the link from your verification email.',
        },
    }

    const currentStatus = statusConfig[status]

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
            >
                <Card className="w-full max-w-md p-8 text-center">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                        className="flex justify-center mb-6"
                    >
                        {currentStatus.icon}
                    </motion.div>

                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {currentStatus.title}
                    </h1>

                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        {currentStatus.subtitle}
                    </p>

                    {status === 'success' && (
                        <p className="text-sm text-gray-500 mb-4">
                            Redirecting to login in 3 seconds...
                        </p>
                    )}

                    {status === 'error' && (
                        <div className="space-y-3">
                            <Button
                                variant="primary"
                                className="w-full"
                                onClick={() => navigate('/resend-verification')}
                            >
                                Resend Verification Email
                            </Button>
                            <Link
                                to="/login"
                                className="block text-sm text-primary hover:underline"
                            >
                                Back to Login
                            </Link>
                        </div>
                    )}

                    {status === 'no-token' && (
                        <div className="space-y-3">
                            <Button
                                variant="primary"
                                className="w-full"
                                onClick={() => navigate('/login')}
                            >
                                Go to Login
                            </Button>
                        </div>
                    )}
                </Card>
            </motion.div>
        </div>
    )
}

export default VerifyEmail
