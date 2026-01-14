import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useColorScheme, StatusBar } from 'react-native'
import { lightTheme, darkTheme, Theme } from './index'

interface ThemeContextType {
    theme: Theme
    isDark: boolean
    toggleTheme: () => void
    setTheme: (mode: 'light' | 'dark' | 'system') => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

interface ThemeProviderProps {
    children: ReactNode
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const systemColorScheme = useColorScheme()
    const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'system'>('system')

    const isDark = themeMode === 'system'
        ? systemColorScheme === 'dark'
        : themeMode === 'dark'

    const theme = isDark ? darkTheme : lightTheme

    const toggleTheme = () => {
        setThemeMode(prev => {
            if (prev === 'system') return 'light'
            if (prev === 'light') return 'dark'
            return 'system'
        })
    }

    const setTheme = (mode: 'light' | 'dark' | 'system') => {
        setThemeMode(mode)
    }

    return (
        <ThemeContext.Provider value={{ theme, isDark, toggleTheme, setTheme }}>
            <StatusBar
                barStyle={theme.statusBar}
                backgroundColor={theme.background}
            />
            {children}
        </ThemeContext.Provider>
    )
}

export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext)
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider')
    }
    return context
}
