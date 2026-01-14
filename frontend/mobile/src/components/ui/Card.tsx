import React from 'react'
import { View, ViewStyle, StyleSheet } from 'react-native'

import { useTheme } from '../../theme/ThemeProvider'
import { borderRadius, shadows, spacing } from '../../theme'

interface CardProps {
    children: React.ReactNode
    style?: ViewStyle
    padded?: boolean
    elevated?: boolean
}

const Card: React.FC<CardProps> = ({
    children,
    style,
    padded = false,
    elevated = true,
}) => {
    const { theme } = useTheme()

    return (
        <View
            style={[
                styles.card,
                { backgroundColor: theme.card, borderColor: theme.cardBorder },
                padded && styles.padded,
                elevated && shadows.sm,
                style,
            ]}
        >
            {children}
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        overflow: 'hidden',
    },
    padded: {
        padding: spacing[4],
    },
})

export default Card
