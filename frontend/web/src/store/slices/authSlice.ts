import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import api from '@/services/api'

// Types
export interface User {
    id: string
    email: string
    username: string
    firstName: string
    lastName: string
    avatar?: string
    role: 'mentee' | 'mentor' | 'career_seeker' | 'parent_guardian' | 'admin'
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
    isAdult: boolean
    email: string
    username: string
    password: string
    fullName: string
    role: 'career_seeker' | 'parent_guardian'
}

// Adapt FastAPI snake_case profile fields without inventing learner progress.
const normalizeUser = (data: any): User => {
    const name = String(data.full_name || '').trim().split(/\s+/)
    return {
        ...data,
        id: String(data.id),
        firstName: name[0] || '',
        lastName: name.slice(1).join(' '),
        avatar: data.profile_picture_url || undefined,
        role: data.role,
        skills: [],
        interests: [],
        location: data.city || undefined,
        isEmailVerified: Boolean(data.is_verified),
        createdAt: data.created_at,
        updatedAt: data.updated_at || data.created_at,
    }
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
            const profile = await api.auth.me(response.data.access_token)
            return { ...response.data, user: normalizeUser(profile.data) }
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.detail || 'Login failed')
        }
    }
)

export const registerUser = createAsyncThunk(
    'auth/register',
    async (data: RegisterData, { rejectWithValue }) => {
        try {
            const response = await api.auth.register({
                email: data.email,
                is_adult: data.isAdult,
                username: data.username,
                password: data.password,
                full_name: data.fullName,
                role: data.role,
            })
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
        refreshToken: (state, action: PayloadAction<{ accessToken: string; refreshToken?: string }>) => {
            state.accessToken = action.payload.accessToken
            localStorage.setItem('accessToken', action.payload.accessToken)
            if (action.payload.refreshToken) {
                state.refreshToken = action.payload.refreshToken
                localStorage.setItem('refreshToken', action.payload.refreshToken)
            }
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
            .addCase(registerUser.fulfilled, (state) => {
                // Registration returns a public profile, not access/refresh tokens.
                // An applicant signs in separately after completing verification.
                state.isLoading = false
                state.registrationStep = 1
                state.registrationData = null
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
            .addCase(fetchUserProfile.pending, (state) => {
                state.isLoading = true
            })
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.isLoading = false
                state.user = normalizeUser(action.payload)
                state.isAuthenticated = Boolean(state.accessToken)
            })
            .addCase(fetchUserProfile.rejected, (state) => {
                state.isLoading = false
                state.user = null
                state.isAuthenticated = false
                state.accessToken = null
                state.refreshToken = null
                localStorage.removeItem('accessToken')
                localStorage.removeItem('refreshToken')
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
