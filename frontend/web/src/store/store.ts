import { configureStore } from '@reduxjs/toolkit'
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { combineReducers } from 'redux'

// Slices
import authReducer from './slices/authSlice'
import uiReducer from './slices/uiSlice'
import gamificationReducer from './slices/gamificationSlice'
import careerReducer from './slices/careerSlice'
import mentorshipReducer from './slices/mentorshipSlice'

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  whitelist: ['auth', 'ui', 'gamification'], // Only persist these slices
}

const rootReducer = combineReducers({
  auth: authReducer,
  ui: uiReducer,
  gamification: gamificationReducer,
  career: careerReducer,
  mentorship: mentorshipReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
})

export const persistor = persistStore(store)

// TypeScript types
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch