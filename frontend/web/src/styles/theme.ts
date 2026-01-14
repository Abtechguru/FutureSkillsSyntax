import { createTheme } from '@mui/material/styles'

// FutureSkillsSyntax Design System Theme
// Primary: #4F46E5 (Indigo)
// Secondary: #10B981 (Emerald)
// Accent: #F59E0B (Amber)

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#4F46E5',
      light: '#818CF8',
      dark: '#4338CA',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#10B981',
      light: '#34D399',
      dark: '#059669',
      contrastText: '#ffffff',
    },
    success: {
      main: '#22C55E',
      light: '#4ADE80',
      dark: '#16A34A',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#F59E0B',
      light: '#FBBF24',
      dark: '#D97706',
      contrastText: 'rgba(0, 0, 0, 0.87)',
    },
    error: {
      main: '#EF4444',
      light: '#F87171',
      dark: '#DC2626',
      contrastText: '#ffffff',
    },
    info: {
      main: '#3B82F6',
      light: '#60A5FA',
      dark: '#2563EB',
      contrastText: '#ffffff',
    },
    background: {
      default: '#F9FAFB',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#111827',
      secondary: '#4B5563',
      disabled: '#9CA3AF',
    },
    divider: '#E5E7EB',
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: {
      fontWeight: 600,
      fontSize: '3rem',      // 48px
      lineHeight: 1.167,     // 56px
      letterSpacing: '-0.025em',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2.25rem',   // 36px
      lineHeight: 1.222,     // 44px
      letterSpacing: '-0.02em',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.875rem',  // 30px
      lineHeight: 1.267,     // 38px
      letterSpacing: '-0.015em',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.4,
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '1rem',      // 16px
      lineHeight: 1.5,       // 24px
      fontWeight: 400,
    },
    body2: {
      fontSize: '0.875rem',  // 14px
      lineHeight: 1.43,      // 20px
      fontWeight: 400,
    },
    button: {
      fontWeight: 500,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 8, // Medium radius as default
  },
  shadows: [
    'none',
    '0px 1px 2px rgba(0, 0, 0, 0.05)',                    // elevation 1 - Small
    '0px 1px 3px rgba(0, 0, 0, 0.1)',                     // elevation 2
    '0px 4px 6px rgba(0, 0, 0, 0.07)',                    // elevation 3 - Medium
    '0px 4px 6px rgba(0, 0, 0, 0.1)',                     // elevation 4
    '0px 6px 10px rgba(0, 0, 0, 0.08)',                   // elevation 5
    '0px 8px 12px rgba(0, 0, 0, 0.08)',                   // elevation 6
    '0px 10px 15px rgba(0, 0, 0, 0.1)',                   // elevation 7 - Large
    '0px 12px 17px rgba(0, 0, 0, 0.1)',                   // elevation 8
    '0px 14px 20px rgba(0, 0, 0, 0.1)',                   // elevation 9
    '0px 16px 22px rgba(0, 0, 0, 0.1)',                   // elevation 10
    '0px 18px 25px rgba(0, 0, 0, 0.12)',                  // elevation 11
    '0px 20px 25px rgba(0, 0, 0, 0.15)',                  // elevation 12 - X-Large
    '0px 20px 28px rgba(0, 0, 0, 0.15)',                  // elevation 13
    '0px 22px 30px rgba(0, 0, 0, 0.15)',                  // elevation 14
    '0px 24px 32px rgba(0, 0, 0, 0.15)',                  // elevation 15
    '0px 26px 35px rgba(0, 0, 0, 0.17)',                  // elevation 16
    '0px 28px 38px rgba(0, 0, 0, 0.17)',                  // elevation 17
    '0px 30px 40px rgba(0, 0, 0, 0.18)',                  // elevation 18
    '0px 32px 42px rgba(0, 0, 0, 0.18)',                  // elevation 19
    '0px 34px 45px rgba(0, 0, 0, 0.2)',                   // elevation 20
    '0px 36px 48px rgba(0, 0, 0, 0.2)',                   // elevation 21
    '0px 38px 50px rgba(0, 0, 0, 0.22)',                  // elevation 22
    '0px 40px 52px rgba(0, 0, 0, 0.22)',                  // elevation 23
    '0px 42px 55px rgba(0, 0, 0, 0.25)',                  // elevation 24
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: 8,
          padding: '8px 16px',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 4px 14px rgba(79, 70, 229, 0.25)',
          },
        },
        containedPrimary: {
          '&:hover': {
            backgroundColor: '#4338CA',
          },
        },
        containedSecondary: {
          '&:hover': {
            backgroundColor: '#059669',
            boxShadow: '0px 4px 14px rgba(16, 185, 129, 0.25)',
          },
        },
        outlined: {
          borderWidth: '1px',
          '&:hover': {
            borderWidth: '1px',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12, // Large radius
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.07)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 12,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#9CA3AF',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#4F46E5',
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 999, // Full radius for badges/chips
          fontWeight: 500,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#111827',
          borderRadius: 8,
          fontSize: '0.75rem',
          padding: '6px 12px',
        },
      },
    },
  },
})

export const darkTheme = createTheme({
  ...theme,
  palette: {
    ...theme.palette,
    mode: 'dark',
    primary: {
      main: '#6366F1',
      light: '#818CF8',
      dark: '#4F46E5',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#34D399',
      light: '#6EE7B7',
      dark: '#10B981',
      contrastText: '#111827',
    },
    background: {
      default: '#111827',
      paper: '#1F2937',
    },
    text: {
      primary: '#F9FAFB',
      secondary: '#E5E7EB',
      disabled: '#6B7280',
    },
    divider: '#374151',
  },
})
