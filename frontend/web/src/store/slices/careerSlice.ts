import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface CareerState {
    assessmentResults: any | null
    recommendedPaths: any[]
    skillGaps: any[]
    isLoading: boolean
    error: string | null
}

const initialState: CareerState = {
    assessmentResults: null,
    recommendedPaths: [],
    skillGaps: [],
    isLoading: false,
    error: null,
}

const careerSlice = createSlice({
    name: 'career',
    initialState,
    reducers: {
        setAssessmentResults: (state, action: PayloadAction<any>) => {
            state.assessmentResults = action.payload
        },
    },
})

export const { setAssessmentResults } = careerSlice.actions
export default careerSlice.reducer
