import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useTheme } from '../../theme/ThemeProvider'
import { spacing, typography } from '../../theme'

export const ProfileScreen: React.FC = () => {
    const { theme } = useTheme()
    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <Text style={[styles.text, { color: theme.text }]}>Profile</Text>
        </View>
    )
}

export const SettingsScreen: React.FC = () => {
    const { theme } = useTheme()
    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <Text style={[styles.text, { color: theme.text }]}>Settings</Text>
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

export default ProfileScreen
