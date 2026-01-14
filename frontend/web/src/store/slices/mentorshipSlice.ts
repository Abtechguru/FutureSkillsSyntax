import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface MentorshipState {
    sessions: any[]
    mentors: any[]
    upcomingSessions: any[]
    isLoading: boolean
    error: string | null
}

const initialState: MentorshipState = {
    sessions: [],
    mentors: [],
    upcomingSessions: [],
    isLoading: false,
    error: null,
}

const mentorshipSlice = createSlice({
    name: 'mentorship',
    initialState,
    reducers: {
        setSessions: (state, action: PayloadAction<any[]>) => {
            state.sessions = action.payload
        },
        setMentors: (state, action: PayloadAction<any[]>) => {
            state.mentors = action.payload
        },
    },
})

export const { setSessions, setMentors } = mentorshipSlice.actions
export default mentorshipSlice.reducer
