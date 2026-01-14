import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import api from '@/services/api'

export interface Notification {
    id: string
    type: 'session_reminder' | 'mentorship_request' | 'message' | 'achievement' | 'forum_reply' | 'group_invite' | 'system'
    title: string
    message: string
    read: boolean
    actionUrl?: string
    avatar?: string
    createdAt: string
    data?: Record<string, any>
}

export interface NotificationSettings {
    email: {
        sessionReminders: boolean
        mentorshipRequests: boolean
        forumReplies: boolean
        groupUpdates: boolean
        achievements: boolean
        newsletter: boolean
    }
    push: {
        sessionReminders: boolean
        messages: boolean
        achievements: boolean
    }
}

interface NotificationState {
    notifications: Notification[]
    unreadCount: number
    settings: NotificationSettings
    loading: boolean
    error: string | null
}

const initialState: NotificationState = {
    notifications: [],
    unreadCount: 0,
    settings: {
        email: {
            sessionReminders: true,
            mentorshipRequests: true,
            forumReplies: true,
            groupUpdates: true,
            achievements: true,
            newsletter: false,
        },
        push: {
            sessionReminders: true,
            messages: true,
            achievements: true,
        },
    },
    loading: false,
    error: null,
}

// Async thunks
export const fetchNotifications = createAsyncThunk(
    'notifications/fetch',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/api/v1/notifications')
            return response.data
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch notifications')
        }
    }
)

export const markAsRead = createAsyncThunk(
    'notifications/markAsRead',
    async (notificationId: string, { rejectWithValue }) => {
        try {
            await api.put(`/api/v1/notifications/${notificationId}/read`)
            return notificationId
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to mark notification as read')
        }
    }
)

export const markAllAsRead = createAsyncThunk(
    'notifications/markAllAsRead',
    async (_, { rejectWithValue }) => {
        try {
            await api.put('/api/v1/notifications/read-all')
            return true
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to mark all as read')
        }
    }
)

export const deleteNotification = createAsyncThunk(
    'notifications/delete',
    async (notificationId: string, { rejectWithValue }) => {
        try {
            await api.delete(`/api/v1/notifications/${notificationId}`)
            return notificationId
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete notification')
        }
    }
)

export const updateSettings = createAsyncThunk(
    'notifications/updateSettings',
    async (settings: NotificationSettings, { rejectWithValue }) => {
        try {
            await api.put('/api/v1/notifications/settings', settings)
            return settings
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update settings')
        }
    }
)

const notificationSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        addNotification: (state, action: PayloadAction<Notification>) => {
            state.notifications.unshift(action.payload)
            if (!action.payload.read) {
                state.unreadCount += 1
            }
        },
        clearNotifications: (state) => {
            state.notifications = []
            state.unreadCount = 0
        },
        setUnreadCount: (state, action: PayloadAction<number>) => {
            state.unreadCount = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch notifications
            .addCase(fetchNotifications.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.loading = false
                state.notifications = action.payload.notifications
                state.unreadCount = action.payload.notifications.filter((n: Notification) => !n.read).length
            })
            .addCase(fetchNotifications.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
            // Mark as read
            .addCase(markAsRead.fulfilled, (state, action) => {
                const notification = state.notifications.find(n => n.id === action.payload)
                if (notification && !notification.read) {
                    notification.read = true
                    state.unreadCount = Math.max(0, state.unreadCount - 1)
                }
            })
            // Mark all as read
            .addCase(markAllAsRead.fulfilled, (state) => {
                state.notifications.forEach(n => { n.read = true })
                state.unreadCount = 0
            })
            // Delete notification
            .addCase(deleteNotification.fulfilled, (state, action) => {
                const index = state.notifications.findIndex(n => n.id === action.payload)
                if (index !== -1) {
                    if (!state.notifications[index].read) {
                        state.unreadCount = Math.max(0, state.unreadCount - 1)
                    }
                    state.notifications.splice(index, 1)
                }
            })
            // Update settings
            .addCase(updateSettings.fulfilled, (state, action) => {
                state.settings = action.payload
            })
    },
})

export const { addNotification, clearNotifications, setUnreadCount } = notificationSlice.actions
export default notificationSlice.reducer
