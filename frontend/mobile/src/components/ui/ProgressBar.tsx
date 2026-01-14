import React from 'react'
import { View, ViewStyle, StyleSheet } from 'react-native'
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated'

import { useTheme } from '../../theme/ThemeProvider'
import { borderRadius, colors } from '../../theme'

interface ProgressBarProps {
    progress: number // 0-100
    height?: number
    showBackground?: boolean
    animated?: boolean
    color?: string
    style?: ViewStyle
}

const ProgressBar: React.FC<ProgressBarProps> = ({
    progress,
    height = 6,
    showBackground = true,
    animated = true,
    color,
    style,
}) => {
    const { theme } = useTheme()
    const clampedProgress = Math.min(100, Math.max(0, progress))

    const animatedStyle = useAnimatedStyle(() => ({
        width: withTiming(`${clampedProgress}%`, { duration: animated ? 500 : 0 }),
    }))

    return (
        <View
            style={[
                styles.container,
                { height },
                showBackground && { backgroundColor: theme.surface },
                style,
            ]}
        >
            <Animated.View
                style={[
                    styles.progress,
                    { backgroundColor: color || theme.primary },
                    animatedStyle,
                ]}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        borderRadius: borderRadius.full,
        overflow: 'hidden',
    },
    progress: {
        height: '100%',
        borderRadius: borderRadius.full,
    },
})

export default ProgressBar
