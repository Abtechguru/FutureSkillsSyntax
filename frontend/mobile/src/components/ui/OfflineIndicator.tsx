import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

import { useTheme } from '../../theme/ThemeProvider'
import { useOfflineMode } from '../../hooks/useOfflineMode'
import { colors, spacing, borderRadius, typography } from '../../theme'

interface OfflineIndicatorProps {
    showAlways?: boolean
}

const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({ showAlways = false }) => {
    const { theme } = useTheme()
    const { isOnline, isConnected, connectionType } = useOfflineMode()

    if (isOnline && !showAlways) return null

    const getStatusInfo = () => {
        if (!isConnected) {
            return {
                icon: 'cloud-offline' as const,
                text: 'No connection',
                color: colors.error,
                bgColor: colors.error + '20',
            }
        }
        if (!isOnline) {
            return {
                icon: 'warning' as const,
                text: 'Limited connectivity',
                color: colors.warning,
                bgColor: colors.warning + '20',
            }
        }
        return {
            icon: 'cloud-done' as const,
            text: 'Connected',
            color: colors.success,
            bgColor: colors.success + '20',
        }
    }

    const statusInfo = getStatusInfo()

    return (
        <View style={[styles.container, { backgroundColor: statusInfo.bgColor }]}>
            <Ionicons name={statusInfo.icon} size={16} color={statusInfo.color} />
            <Text style={[styles.text, { color: statusInfo.color }]}>
                {statusInfo.text}
            </Text>
            {!isOnline && (
                <Text style={[styles.subtext, { color: statusInfo.color }]}>
                    Changes will sync when online
                </Text>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing[2],
        paddingHorizontal: spacing[3],
        borderRadius: borderRadius.md,
        gap: spacing[2],
    },
    text: {
        fontSize: typography.fontSize.sm,
        fontWeight: '600',
    },
    subtext: {
        fontSize: typography.fontSize.xs,
        opacity: 0.8,
    },
})

export default OfflineIndicator
