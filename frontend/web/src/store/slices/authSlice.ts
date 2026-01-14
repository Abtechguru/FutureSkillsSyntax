import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import api from '@/services/api'

// Types
export interface User {
    id: string
    email: string
    username: string
    firstName: string
    lastName: string
    avatar?: string
    role: 'mentee' | 'mentor' | 'career_seeker' | 'parent' | 'admin'
    skills: string[]
    interests: string[]
    location?: string
    bio?: string
    isEmailVerified: boolean
    createdAt: string
    updatedAt: string
}

export interface AuthState {
    user: User | null
    accessToken: string | null
    refreshToken: string | null
    isAuthenticated: boolean
    isLoading: boolean
    error: string | null
    isEmailVerified: boolean
    registrationStep: number
    registrationData: Partial<RegisterData> | null
}

export interface LoginCredentials {
    username: string
    password: string
}

export interface RegisterData {
    email: string
    password: string
    firstName: string
    lastName: string
    role: 'mentee' | 'mentor' | 'career_seeker' | 'parent'
    skills: string[]
    interests: string[]
    location?: string
    bio?: string
}

const initialState: AuthState = {
    user: null,
    accessToken: localStorage.getItem('accessToken'),
    refreshToken: localStorage.getItem('refreshToken'),
    isAuthenticated: !!localStorage.getItem('accessToken'),
    isLoading: false,
    error: null,
    isEmailVerified: false,
    registrationStep: 1,
    registrationData: null,
}

// Async thunks
export const loginUser = createAsyncThunk(
    'auth/login',
    async (credentials: LoginCredentials, { rejectWithValue }) => {
        try {
            const response = await api.auth.login(credentials)
            return response.data
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Login failed')
        }
    }
)

export const registerUser = createAsyncThunk(
    'auth/register',
    async (data: RegisterData, { rejectWithValue }) => {
        try {
            const response = await api.auth.register(data)
            return response.data
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Registration failed')
        }
    }
)

export const forgotPassword = createAsyncThunk(
    'auth/forgotPassword',
    async (email: string, { rejectWithValue }) => {
        try {
            const response = await api.auth.forgotPassword(email)
            return response.data
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to send reset email')
        }
    }
)

export const resetPassword = createAsyncThunk(
    'auth/resetPassword',
    async ({ token, password }: { token: string; password: string }, { rejectWithValue }) => {
        try {
            const response = await api.auth.resetPassword(token, password)
            return response.data
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to reset password')
        }
    }
)

export const verifyEmail = createAsyncThunk(
    'auth/verifyEmail',
    async (token: string, { rejectWithValue }) => {
        try {
            const response = await api.auth.verifyEmail(token)
            return response.data
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Email verification failed')
        }
    }
)

export const fetchUserProfile = createAsyncThunk(
    'auth/fetchProfile',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.user.getProfile()
            return response.data
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile')
        }
    }
)

export const logoutUser = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            await api.auth.logout()
            return null
        } catch (error: any) {
            // Still logout locally even if API fails
            return null
        }
    }
)

// Slice
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (
            state,
            action: PayloadAction<{
                accessToken: string
                refreshToken: string
                user: User
            }>
        ) => {
            const { accessToken, refreshToken, user } = action.payload
            state.accessToken = accessToken
            state.refreshToken = refreshToken
            state.user = user
            state.isAuthenticated = true
            state.error = null
            localStorage.setItem('accessToken', accessToken)
            localStorage.setItem('refreshToken', refreshToken)
        },
        logout: (state) => {
            state.user = null
            state.accessToken = null
            state.refreshToken = null
            state.isAuthenticated = false
            state.error = null
            state.registrationStep = 1
            state.registrationData = null
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
        },
        refreshToken: (state, action: PayloadAction<{ accessToken: string }>) => {
            state.accessToken = action.payload.accessToken
            localStorage.setItem('accessToken', action.payload.accessToken)
        },
        clearError: (state) => {
            state.error = null
        },
        setRegistrationStep: (state, action: PayloadAction<number>) => {
            state.registrationStep = action.payload
        },
        updateRegistrationData: (state, action: PayloadAction<Partial<RegisterData>>) => {
            state.registrationData = { ...state.registrationData, ...action.payload }
        },
        clearRegistrationData: (state) => {
            state.registrationStep = 1
            state.registrationData = null
        },
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false
                state.accessToken = action.payload.access_token
                state.refreshToken = action.payload.refresh_token
                state.user = action.payload.user
                state.isAuthenticated = true
                localStorage.setItem('accessToken', action.payload.access_token)
                localStorage.setItem('refreshToken', action.payload.refresh_token)
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload as string
            })
            // Register
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.isLoading = false
                state.accessToken = action.payload.access_token
                state.refreshToken = action.payload.refresh_token
                state.user = action.payload.user
                state.isAuthenticated = true
                state.isEmailVerified = false
                localStorage.setItem('accessToken', action.payload.access_token)
                localStorage.setItem('refreshToken', action.payload.refresh_token)
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload as string
            })
            // Forgot Password
            .addCase(forgotPassword.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(forgotPassword.fulfilled, (state) => {
                state.isLoading = false
            })
            .addCase(forgotPassword.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload as string
            })
            // Reset Password
            .addCase(resetPassword.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(resetPassword.fulfilled, (state) => {
                state.isLoading = false
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload as string
            })
            // Verify Email
            .addCase(verifyEmail.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(verifyEmail.fulfilled, (state) => {
                state.isLoading = false
                state.isEmailVerified = true
                if (state.user) {
                    state.user.isEmailVerified = true
                }
            })
            .addCase(verifyEmail.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload as string
            })
            // Fetch Profile
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.user = action.payload
            })
            // Logout
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null
                state.accessToken = null
                state.refreshToken = null
                state.isAuthenticated = false
                state.registrationStep = 1
                state.registrationData = null
                localStorage.removeItem('accessToken')
                localStorage.removeItem('refreshToken')
            })
    },
})

export const {
    login,
    logout,
    refreshToken,
    clearError,
    setRegistrationStep,
    updateRegistrationData,
    clearRegistrationData,
} = authSlice.actions

export default authSlice.reducer
