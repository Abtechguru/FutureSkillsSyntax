import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useTheme } from '../../theme/ThemeProvider'
import { spacing, typography } from '../../theme'

// Placeholder screens for navigation - implement with full features as needed

export const PathDetailScreen: React.FC = () => {
    const { theme } = useTheme()
    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <Text style={[styles.text, { color: theme.text }]}>Path Details</Text>
        </View>
    )
}

export const ModuleViewerScreen: React.FC = () => {
    const { theme } = useTheme()
    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <Text style={[styles.text, { color: theme.text }]}>Module Viewer</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing[4],
    },
    text: {
        fontSize: typography.fontSize.xl,
        fontWeight: '600',
    },
})

export default { PathDetailScreen, ModuleViewerScreen }
