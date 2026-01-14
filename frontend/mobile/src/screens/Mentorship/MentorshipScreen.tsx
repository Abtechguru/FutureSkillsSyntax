import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useTheme } from '../../theme/ThemeProvider'
import { spacing, typography } from '../../theme'

export const MentorshipScreen: React.FC = () => {
    const { theme } = useTheme()
    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <Text style={[styles.text, { color: theme.text }]}>Find Mentors</Text>
        </View>
    )
}

export const MentorDetailScreen: React.FC = () => {
    const { theme } = useTheme()
    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <Text style={[styles.text, { color: theme.text }]}>Mentor Profile</Text>
        </View>
    )
}

export const SessionRoomScreen: React.FC = () => {
    const { theme } = useTheme()
    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <Text style={[styles.text, { color: theme.text }]}>Session Room</Text>
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

export default MentorshipScreen
