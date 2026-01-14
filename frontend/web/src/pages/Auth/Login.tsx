import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, LogIn, Fingerprint } from 'lucide-react'

import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import FadeIn from '@/components/animations/FadeIn'
import { useAuth } from '@/hooks/useAuth'
import { useBiometricAuth } from '@/hooks/useBiometricAuth'
import '@/styles/mobile-auth.css'

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })

  const { login, isLoading, error, clearAuthError } = useAuth()
  const { isSupported: biometricSupported, isEnrolled: biometricEnrolled, authenticate: biometricAuth, isLoading: biometricLoading } = useBiometricAuth()

  useEffect(() => {
    clearAuthError()
  }, [clearAuthError])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await login(formData)
  }

  const handleBiometricLogin = async () => {
    const result = await biometricAuth()
    if (result.success && result.userId) {
      // Auto-login with stored credentials
      await login({ username: result.userId, password: '' })
    }
  }

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/api/v1/auth/google`
  }

  const handleLinkedInLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/api/v1/auth/linkedin`
  }

  const handleGitHubLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/api/v1/auth/github`
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <FadeIn direction="up">
          <Card className="p-8">
            {/* Logo */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary mb-4">
                <LogIn className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Welcome Back
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Sign in to your OnaAseyori account
              </p>
            </div>

            {/* Error Display */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                {/* Username/Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Username or Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Enter your username or email"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Password
                    </label>
                    <Link
                      to="/forgot-password"
                      className="text-sm text-primary hover:text-primary/80"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      required
                      className="w-full pl-10 pr-12 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={isLoading}
                icon={<LogIn />}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Biometric Login (Mobile) */}
              {biometricSupported && biometricEnrolled && (
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  fullWidth
                  onClick={handleBiometricLogin}
                  loading={biometricLoading}
                  icon={<Fingerprint className="w-5 h-5" />}
                  className="biometric-btn"
                >
                  Sign in with Face ID / Fingerprint
                </Button>
              )}

              {/* Social Login */}
              <div className="grid grid-cols-3 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGoogleLogin}
                  className="flex-col py-3"
                >
                  <svg className="w-5 h-5 mb-1" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span className="text-xs">Google</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleLinkedInLogin}
                  className="flex-col py-3"
                >
                  <svg className="w-5 h-5 mb-1" fill="#0A66C2" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  <span className="text-xs">LinkedIn</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGitHubLogin}
                  className="flex-col py-3"
                >
                  <svg className="w-5 h-5 mb-1" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    />
                  </svg>
                  <span className="text-xs">GitHub</span>
                </Button>
              </div>

              {/* Sign Up Link */}
              <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="font-semibold text-primary hover:text-primary/80"
                >
                  Sign up now
                </Link>
              </p>
            </form>
          </Card>
        </FadeIn>

        {/* Features */}
        <FadeIn delay={0.3} direction="up">
          <div className="mt-8 grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-primary">10,000+</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Users</div>
            </div>
            <div>
              <div className="text-lg font-bold text-secondary">500+</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Mentors</div>
            </div>
            <div>
              <div className="text-lg font-bold text-success">95%</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Success Rate</div>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  )
}

export default Login