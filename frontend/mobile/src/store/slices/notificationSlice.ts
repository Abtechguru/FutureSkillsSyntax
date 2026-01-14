import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import apiService from '../../services/api'

interface Notification {
    id: string
    type: string
    title: string
    message: string
    read: boolean
    actionUrl?: string
    createdAt: string
}

interface NotificationState {
    notifications: Notification[]
    unreadCount: number
    loading: boolean
}

const initialState: NotificationState = {
    notifications: [],
    unreadCount: 0,
    loading: false,
}

export const fetchNotifications = createAsyncThunk(
    'notifications/fetch',
    async () => {
        const response = await apiService.get<{ notifications: Notification[] }>('/api/v1/notifications')
        return response.notifications
    }
)

export const markAsRead = createAsyncThunk(
    'notifications/markAsRead',
    async (id: string) => {
        await apiService.put(`/api/v1/notifications/${id}/read`)
        return id
    }
)

export const markAllAsRead = createAsyncThunk(
    'notifications/markAllAsRead',
    async () => {
        await apiService.put('/api/v1/notifications/read-all')
    }
)

const notificationSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        addNotification: (state, action: PayloadAction<Notification>) => {
            state.notifications.unshift(action.payload)
            if (!action.payload.read) state.unreadCount++
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotifications.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.loading = false
                state.notifications = action.payload
                state.unreadCount = action.payload.filter(n => !n.read).length
            })
            .addCase(markAsRead.fulfilled, (state, action) => {
                const notification = state.notifications.find(n => n.id === action.payload)
                if (notification && !notification.read) {
                    notification.read = true
                    state.unreadCount = Math.max(0, state.unreadCount - 1)
                }
            })
            .addCase(markAllAsRead.fulfilled, (state) => {
                state.notifications.forEach(n => { n.read = true })
                state.unreadCount = 0
            })
    },
})

export const { addNotification } = notificationSlice.actions
export default notificationSlice.reducer
