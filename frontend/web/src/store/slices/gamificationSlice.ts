import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface GamificationState {
    currentXp: number
    currentLevel: number
    xpToNextLevel: number
    achievements: any[]
    badgesCount: number
    rank: string
    points: number
    isLoading: boolean
    error: string | null
}

const initialState: GamificationState = {
    currentXp: 1250,
    currentLevel: 5,
    xpToNextLevel: 2000,
    achievements: [],
    badgesCount: 12,
    rank: 'Apprentice',
    points: 450,
    isLoading: false,
    error: null,
}

const gamificationSlice = createSlice({
    name: 'gamification',
    initialState,
    reducers: {
        setXp: (state, action: PayloadAction<number>) => {
            state.currentXp = action.payload
        },
        setLevel: (state, action: PayloadAction<number>) => {
            state.currentLevel = action.payload
        },
        addXp: (state, action: PayloadAction<number>) => {
            state.currentXp += action.payload
            if (state.currentXp >= state.xpToNextLevel) {
                state.currentLevel += 1
                state.currentXp -= state.xpToNextLevel
                state.xpToNextLevel = Math.floor(state.xpToNextLevel * 1.2)
            }
        },
    },
})

export const { setXp, setLevel, addXp } = gamificationSlice.actions
export default gamificationSlice.reducer
