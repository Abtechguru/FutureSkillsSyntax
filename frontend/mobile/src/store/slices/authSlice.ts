import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import apiService from '../../services/api'

interface User {
    id: string
    email: string
    name: string
    avatar?: string
    level: number
    xp: number
}

interface AuthState {
    user: User | null
    isAuthenticated: boolean
    isLoading: boolean
    error: string | null
}

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
}

export const login = createAsyncThunk(
    'auth/login',
    async (credentials: { email: string; password: string }, { rejectWithValue }) => {
        try {
            const response = await apiService.login(credentials)
            return response.user
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Login failed')
        }
    }
)

export const logout = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            await apiService.logout()
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Logout failed')
        }
    }
)

export const loadUser = createAsyncThunk(
    'auth/loadUser',
    async (_, { rejectWithValue }) => {
        try {
            const token = await apiService.getToken()
            if (!token) throw new Error('No token')
            const user = await apiService.getProfile()
            return user
        } catch (error: any) {
            return rejectWithValue('Session expired')
        }
    }
)

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null
        },
        updateUser: (state, action: PayloadAction<Partial<User>>) => {
            if (state.user) {
                state.user = { ...state.user, ...action.payload }
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false
                state.isAuthenticated = true
                state.user = action.payload
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload as string
            })
            .addCase(logout.fulfilled, (state) => {
                state.user = null
                state.isAuthenticated = false
            })
            .addCase(loadUser.fulfilled, (state, action) => {
                state.isAuthenticated = true
                state.user = action.payload
            })
            .addCase(loadUser.rejected, (state) => {
                state.isAuthenticated = false
                state.user = null
            })
    },
})

export const { clearError, updateUser } = authSlice.actions
export default authSlice.reducer
