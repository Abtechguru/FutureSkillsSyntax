import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import type { RootState, AppDispatch } from '@/store/store'
import {
    loginUser,
    registerUser,
    logoutUser,
    forgotPassword,
    resetPassword,
    verifyEmail,
    fetchUserProfile,
    clearError,
    setRegistrationStep,
    updateRegistrationData,
    clearRegistrationData,
} from '@/store/slices/authSlice'
import type { LoginCredentials, RegisterData } from '@/store/slices/authSlice'

export const useAuth = () => {
    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate()
    const auth = useSelector((state: RootState) => state.auth)

    const login = useCallback(
        async (credentials: LoginCredentials) => {
            try {
                const result = await dispatch(loginUser(credentials)).unwrap()
                toast.success('Welcome back!')
                navigate('/dashboard')
                return result
            } catch (error: any) {
                toast.error(error || 'Login failed')
                throw error
            }
        },
        [dispatch, navigate]
    )

    const register = useCallback(
        async (data: RegisterData) => {
            try {
                const result = await dispatch(registerUser(data)).unwrap()
                toast.success('Account created successfully!')
                dispatch(clearRegistrationData())
                navigate('/onboarding-complete')
                return result
            } catch (error: any) {
                toast.error(error || 'Registration failed')
                throw error
            }
        },
        [dispatch, navigate]
    )

    const logout = useCallback(async () => {
        try {
            await dispatch(logoutUser()).unwrap()
            toast.success('Logged out successfully')
            navigate('/login')
        } catch (error) {
            // Still navigate to login even if API fails
            navigate('/login')
        }
    }, [dispatch, navigate])

    const requestPasswordReset = useCallback(
        async (email: string) => {
            try {
                await dispatch(forgotPassword(email)).unwrap()
                toast.success('Password reset link sent to your email')
                return true
            } catch (error: any) {
                toast.error(error || 'Failed to send reset email')
                throw error
            }
        },
        [dispatch]
    )

    const resetUserPassword = useCallback(
        async (token: string, password: string) => {
            try {
                await dispatch(resetPassword({ token, password })).unwrap()
                toast.success('Password reset successfully')
                navigate('/login')
                return true
            } catch (error: any) {
                toast.error(error || 'Failed to reset password')
                throw error
            }
        },
        [dispatch, navigate]
    )

    const verifyUserEmail = useCallback(
        async (token: string) => {
            try {
                await dispatch(verifyEmail(token)).unwrap()
                toast.success('Email verified successfully!')
                return true
            } catch (error: any) {
                toast.error(error || 'Email verification failed')
                throw error
            }
        },
        [dispatch]
    )

    const refreshProfile = useCallback(async () => {
        try {
            await dispatch(fetchUserProfile()).unwrap()
        } catch (error) {
            console.error('Failed to refresh profile:', error)
        }
    }, [dispatch])

    const setStep = useCallback(
        (step: number) => {
            dispatch(setRegistrationStep(step))
        },
        [dispatch]
    )

    const updateRegData = useCallback(
        (data: Partial<RegisterData>) => {
            dispatch(updateRegistrationData(data))
        },
        [dispatch]
    )

    const clearAuthError = useCallback(() => {
        dispatch(clearError())
    }, [dispatch])

    return {
        // State
        user: auth.user,
        isAuthenticated: auth.isAuthenticated,
        isLoading: auth.isLoading,
        error: auth.error,
        isEmailVerified: auth.isEmailVerified,
        registrationStep: auth.registrationStep,
        registrationData: auth.registrationData,
        // Actions
        login,
        register,
        logout,
        requestPasswordReset,
        resetUserPassword,
        verifyUserEmail,
        refreshProfile,
        setStep,
        updateRegData,
        clearAuthError,
    }
}

export default useAuth
