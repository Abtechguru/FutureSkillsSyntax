import React, { useCallback } from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
} from 'react-native'
import { Swipeable } from 'react-native-gesture-handler'
import { Ionicons } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'

import { useTheme } from '../../theme/ThemeProvider'
import { spacing, borderRadius, colors, touchTarget } from '../../theme'

interface SwipeableListItemProps {
    children: React.ReactNode
    onDelete?: () => void
    onArchive?: () => void
    onEdit?: () => void
    deleteLabel?: string
    archiveLabel?: string
    editLabel?: string
}

const SwipeableListItem: React.FC<SwipeableListItemProps> = ({
    children,
    onDelete,
    onArchive,
    onEdit,
    deleteLabel = 'Delete',
    archiveLabel = 'Archive',
    editLabel = 'Edit',
}) => {
    const { theme } = useTheme()

    const handleAction = useCallback(async (action?: () => void) => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
        action?.()
    }, [])

    const renderRightActions = (
        progress: Animated.AnimatedInterpolation<number>,
        dragX: Animated.AnimatedInterpolation<number>
    ) => {
        const actions = []

        if (onArchive) {
            const translateX = progress.interpolate({
                inputRange: [0, 1],
                outputRange: [160, 0],
            })

            actions.push(
                <Animated.View
                    key="archive"
                    style={[styles.actionContainer, { transform: [{ translateX }] }]}
                >
                    <TouchableOpacity
                        style={[styles.action, { backgroundColor: colors.warning }]}
                        onPress={() => handleAction(onArchive)}
                    >
                        <Ionicons name="archive-outline" size={20} color={colors.white} />
                        <Text style={styles.actionText}>{archiveLabel}</Text>
                    </TouchableOpacity>
                </Animated.View>
            )
        }

        if (onDelete) {
            const translateX = progress.interpolate({
                inputRange: [0, 1],
                outputRange: [80, 0],
            })

            actions.push(
                <Animated.View
                    key="delete"
                    style={[styles.actionContainer, { transform: [{ translateX }] }]}
                >
                    <TouchableOpacity
                        style={[styles.action, { backgroundColor: colors.error }]}
                        onPress={() => handleAction(onDelete)}
                    >
                        <Ionicons name="trash-outline" size={20} color={colors.white} />
                        <Text style={styles.actionText}>{deleteLabel}</Text>
                    </TouchableOpacity>
                </Animated.View>
            )
        }

        return <View style={styles.actionsRow}>{actions}</View>
    }

    const renderLeftActions = (
        progress: Animated.AnimatedInterpolation<number>,
        dragX: Animated.AnimatedInterpolation<number>
    ) => {
        if (!onEdit) return null

        const translateX = progress.interpolate({
            inputRange: [0, 1],
            outputRange: [-80, 0],
        })

        return (
            <Animated.View style={[styles.actionContainer, { transform: [{ translateX }] }]}>
                <TouchableOpacity
                    style={[styles.action, { backgroundColor: theme.primary }]}
                    onPress={() => handleAction(onEdit)}
                >
                    <Ionicons name="create-outline" size={20} color={colors.white} />
                    <Text style={styles.actionText}>{editLabel}</Text>
                </TouchableOpacity>
            </Animated.View>
        )
    }

    return (
        <Swipeable
            renderRightActions={renderRightActions}
            renderLeftActions={renderLeftActions}
            friction={2}
            overshootRight={false}
            overshootLeft={false}
        >
            <View style={[styles.content, { backgroundColor: theme.card }]}>
                {children}
            </View>
        </Swipeable>
    )
}

const styles = StyleSheet.create({
    content: {
        minHeight: touchTarget.minHeight,
    },
    actionsRow: {
        flexDirection: 'row',
    },
    actionContainer: {
        justifyContent: 'center',
    },
    action: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
        paddingHorizontal: spacing[2],
    },
    actionText: {
        color: colors.white,
        fontSize: 12,
        fontWeight: '600',
        marginTop: 4,
    },
})

export default SwipeableListItem
