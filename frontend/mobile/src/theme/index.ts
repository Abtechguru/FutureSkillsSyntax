import { Dimensions, Platform } from 'react-native'

const { width, height } = Dimensions.get('window')

// Responsive breakpoints
export const breakpoints = {
    mobile: 320,
    tablet: 768,
    desktop: 1024,
}

export const isTablet = width >= breakpoints.tablet
export const isDesktop = width >= breakpoints.desktop
export const isMobile = width < breakpoints.tablet

// Color palette
export const colors = {
    // Primary colors
    primary: {
        50: '#EEF2FF',
        100: '#E0E7FF',
        200: '#C7D2FE',
        300: '#A5B4FC',
        400: '#818CF8',
        500: '#6366F1',
        600: '#4F46E5',
        700: '#4338CA',
        800: '#3730A3',
        900: '#312E81',
    },
    // Secondary colors
    secondary: {
        50: '#F0FDF4',
        100: '#DCFCE7',
        200: '#BBF7D0',
        300: '#86EFAC',
        400: '#4ADE80',
        500: '#22C55E',
        600: '#16A34A',
        700: '#15803D',
        800: '#166534',
        900: '#14532D',
    },
    // Neutral colors
    gray: {
        50: '#F9FAFB',
        100: '#F3F4F6',
        200: '#E5E7EB',
        300: '#D1D5DB',
        400: '#9CA3AF',
        500: '#6B7280',
        600: '#4B5563',
        700: '#374151',
        800: '#1F2937',
        900: '#111827',
    },
    // Semantic colors
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
    // Base colors
    white: '#FFFFFF',
    black: '#000000',
    transparent: 'transparent',
}

// Light theme
export const lightTheme = {
    background: colors.white,
    surface: colors.gray[50],
    text: colors.gray[900],
    textSecondary: colors.gray[600],
    textMuted: colors.gray[400],
    border: colors.gray[200],
    divider: colors.gray[100],
    primary: colors.primary[600],
    primaryLight: colors.primary[50],
    card: colors.white,
    cardBorder: colors.gray[200],
    tabBar: colors.white,
    tabBarBorder: colors.gray[200],
    statusBar: 'dark-content' as const,
}

// Dark theme
export const darkTheme = {
    background: colors.gray[900],
    surface: colors.gray[800],
    text: colors.white,
    textSecondary: colors.gray[400],
    textMuted: colors.gray[500],
    border: colors.gray[700],
    divider: colors.gray[800],
    primary: colors.primary[500],
    primaryLight: colors.primary[900],
    card: colors.gray[800],
    cardBorder: colors.gray[700],
    tabBar: colors.gray[900],
    tabBarBorder: colors.gray[800],
    statusBar: 'light-content' as const,
}

// Typography
export const typography = {
    fontFamily: {
        regular: Platform.select({ ios: 'System', android: 'Roboto' }),
        medium: Platform.select({ ios: 'System', android: 'Roboto-Medium' }),
        bold: Platform.select({ ios: 'System', android: 'Roboto-Bold' }),
    },
    fontSize: {
        xs: 12,
        sm: 14,
        base: 16,
        lg: 18,
        xl: 20,
        '2xl': 24,
        '3xl': 30,
        '4xl': 36,
    },
    lineHeight: {
        tight: 1.25,
        normal: 1.5,
        relaxed: 1.75,
    },
}

// Spacing (8px grid)
export const spacing = {
    0: 0,
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
    8: 32,
    10: 40,
    12: 48,
    16: 64,
}

// Border radius
export const borderRadius = {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    '2xl': 24,
    full: 9999,
}

// Shadows
export const shadows = {
    sm: {
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    md: {
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    lg: {
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
    },
}

// Touch target (minimum 44px for accessibility)
export const touchTarget = {
    minHeight: 44,
    minWidth: 44,
}

// Screen dimensions
export const screen = {
    width,
    height,
    isSmall: width < 375,
    isMedium: width >= 375 && width < 414,
    isLarge: width >= 414,
}

export type Theme = typeof lightTheme
