import React, { useState, useEffect, useCallback } from 'react'
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Switch,
    TouchableOpacity,
    Alert,
    Platform,
    Linking,
} from 'react-native'
import * as Notifications from 'expo-notifications'
import { Ionicons } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'

import { useTheme } from '../../theme/ThemeProvider'
import { spacing, borderRadius, typography, colors, touchTarget } from '../../theme'
import apiService from '../../services/api'
import Card from '../../components/ui/Card'

interface NotificationSettings {
    pushEnabled: boolean
    sessionReminders: boolean
    mentorshipUpdates: boolean
    learningReminders: boolean
    achievements: boolean
    communityActivity: boolean
    marketing: boolean
}

const PushNotificationSettings: React.FC = () => {
    const { theme } = useTheme()

    const [permissionStatus, setPermissionStatus] = useState<'granted' | 'denied' | 'undetermined'>('undetermined')
    const [loading, setLoading] = useState(true)
    const [settings, setSettings] = useState<NotificationSettings>({
        pushEnabled: true,
        sessionReminders: true,
        mentorshipUpdates: true,
        learningReminders: true,
        achievements: true,
        communityActivity: false,
        marketing: false,
    })

    useEffect(() => {
        checkPermissions()
        loadSettings()
    }, [])

    const checkPermissions = async () => {
        const { status } = await Notifications.getPermissionsAsync()
        setPermissionStatus(status)
    }

    const loadSettings = async () => {
        try {
            const data = await apiService.get<NotificationSettings>('/api/v1/notifications/settings')
            setSettings(data)
        } catch (error) {
            console.error('Failed to load notification settings:', error)
        } finally {
            setLoading(false)
        }
    }

    const requestPermissions = async () => {
        const { status } = await Notifications.requestPermissionsAsync()
        setPermissionStatus(status)

        if (status === 'denied') {
            Alert.alert(
                'Notifications Disabled',
                'Please enable notifications in your device settings to receive updates.',
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Open Settings', onPress: () => Linking.openSettings() },
                ]
            )
        }
    }

    const toggleSetting = useCallback(async (key: keyof NotificationSettings) => {
        await Haptics.selectionAsync()

        const newSettings = { ...settings, [key]: !settings[key] }
        setSettings(newSettings)

        try {
            await apiService.put('/api/v1/notifications/settings', newSettings)
        } catch (error) {
            // Revert on failure
            setSettings(settings)
            Alert.alert('Error', 'Failed to update settings. Please try again.')
        }
    }, [settings])

    const registerPushToken = async () => {
        try {
            const token = await Notifications.getExpoPushTokenAsync({
                projectId: 'your-project-id',
            })
            await apiService.post('/api/v1/notifications/register-device', {
                token: token.data,
                platform: Platform.OS,
            })
        } catch (error) {
            console.error('Failed to register push token:', error)
        }
    }

    const settingItems = [
        {
            key: 'sessionReminders' as const,
            title: 'Session Reminders',
            description: 'Get notified before your mentorship sessions',
            icon: 'calendar',
        },
        {
            key: 'mentorshipUpdates' as const,
            title: 'Mentorship Updates',
            description: 'New requests, messages, and session updates',
            icon: 'people',
        },
        {
            key: 'learningReminders' as const,
            title: 'Learning Reminders',
            description: 'Daily reminders to continue your courses',
            icon: 'book',
        },
        {
            key: 'achievements' as const,
            title: 'Achievements',
            description: 'Celebrate when you earn badges or level up',
            icon: 'trophy',
        },
        {
            key: 'communityActivity' as const,
            title: 'Community Activity',
            description: 'Replies to your posts and group updates',
            icon: 'chatbubbles',
        },
        {
            key: 'marketing' as const,
            title: 'News & Updates',
            description: 'New features, courses, and special offers',
            icon: 'megaphone',
        },
    ]

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: theme.background }]}
            contentContainerStyle={styles.content}
        >
            {/* Permission Status */}
            {permissionStatus !== 'granted' && (
                <Card style={styles.permissionCard}>
                    <View style={styles.permissionContent}>
                        <View style={[styles.iconCircle, { backgroundColor: colors.warning + '20' }]}>
                            <Ionicons name="notifications-off" size={24} color={colors.warning} />
                        </View>
                        <View style={styles.permissionText}>
                            <Text style={[styles.permissionTitle, { color: theme.text }]}>
                                Enable Push Notifications
                            </Text>
                            <Text style={[styles.permissionDesc, { color: theme.textSecondary }]}>
                                Stay updated with session reminders and important updates
                            </Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        style={[styles.enableBtn, { backgroundColor: theme.primary }]}
                        onPress={requestPermissions}
                    >
                        <Text style={styles.enableBtnText}>Enable Notifications</Text>
                    </TouchableOpacity>
                </Card>
            )}

            {/* Master Toggle */}
            <Card style={styles.section}>
                <View style={styles.settingRow}>
                    <View style={styles.settingInfo}>
                        <View style={[styles.iconCircle, { backgroundColor: theme.primary + '20' }]}>
                            <Ionicons name="notifications" size={20} color={theme.primary} />
                        </View>
                        <View style={styles.settingText}>
                            <Text style={[styles.settingTitle, { color: theme.text }]}>
                                Push Notifications
                            </Text>
                            <Text style={[styles.settingDesc, { color: theme.textSecondary }]}>
                                Master toggle for all notifications
                            </Text>
                        </View>
                    </View>
                    <Switch
                        value={settings.pushEnabled}
                        onValueChange={() => toggleSetting('pushEnabled')}
                        trackColor={{ false: theme.border, true: theme.primary + '50' }}
                        thumbColor={settings.pushEnabled ? theme.primary : theme.textMuted}
                    />
                </View>
            </Card>

            {/* Individual Settings */}
            <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
                NOTIFICATION TYPES
            </Text>
            <Card style={styles.section}>
                {settingItems.map((item, index) => (
                    <View key={item.key}>
                        <View style={styles.settingRow}>
                            <View style={styles.settingInfo}>
                                <View style={[styles.iconCircle, { backgroundColor: theme.surface }]}>
                                    <Ionicons name={item.icon as any} size={18} color={theme.textSecondary} />
                                </View>
                                <View style={styles.settingText}>
                                    <Text style={[styles.settingTitle, { color: theme.text }]}>
                                        {item.title}
                                    </Text>
                                    <Text style={[styles.settingDesc, { color: theme.textMuted }]}>
                                        {item.description}
                                    </Text>
                                </View>
                            </View>
                            <Switch
                                value={settings[item.key]}
                                onValueChange={() => toggleSetting(item.key)}
                                trackColor={{ false: theme.border, true: theme.primary + '50' }}
                                thumbColor={settings[item.key] ? theme.primary : theme.textMuted}
                                disabled={!settings.pushEnabled}
                            />
                        </View>
                        {index < settingItems.length - 1 && (
                            <View style={[styles.divider, { backgroundColor: theme.divider }]} />
                        )}
                    </View>
                ))}
            </Card>

            {/* Quiet Hours */}
            <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
                QUIET HOURS
            </Text>
            <Card style={styles.section}>
                <TouchableOpacity style={styles.settingRow}>
                    <View style={styles.settingInfo}>
                        <View style={[styles.iconCircle, { backgroundColor: theme.surface }]}>
                            <Ionicons name="moon" size={18} color={theme.textSecondary} />
                        </View>
                        <View style={styles.settingText}>
                            <Text style={[styles.settingTitle, { color: theme.text }]}>
                                Do Not Disturb
                            </Text>
                            <Text style={[styles.settingDesc, { color: theme.textMuted }]}>
                                10:00 PM - 8:00 AM
                            </Text>
                        </View>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={theme.textMuted} />
                </TouchableOpacity>
            </Card>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: spacing[4],
    },
    permissionCard: {
        padding: spacing[4],
        marginBottom: spacing[4],
    },
    permissionContent: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing[4],
    },
    permissionText: {
        flex: 1,
        marginLeft: spacing[3],
    },
    permissionTitle: {
        fontSize: typography.fontSize.base,
        fontWeight: '600',
    },
    permissionDesc: {
        fontSize: typography.fontSize.sm,
        marginTop: 2,
    },
    enableBtn: {
        paddingVertical: spacing[3],
        borderRadius: borderRadius.md,
        alignItems: 'center',
        minHeight: touchTarget.minHeight,
        justifyContent: 'center',
    },
    enableBtnText: {
        color: colors.white,
        fontSize: typography.fontSize.base,
        fontWeight: '600',
    },
    sectionTitle: {
        fontSize: typography.fontSize.xs,
        fontWeight: '600',
        marginBottom: spacing[2],
        marginTop: spacing[4],
        paddingHorizontal: spacing[2],
    },
    section: {
        overflow: 'hidden',
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: spacing[4],
        minHeight: touchTarget.minHeight,
    },
    settingInfo: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    settingText: {
        flex: 1,
        marginLeft: spacing[3],
        marginRight: spacing[3],
    },
    settingTitle: {
        fontSize: typography.fontSize.base,
        fontWeight: '500',
    },
    settingDesc: {
        fontSize: typography.fontSize.sm,
        marginTop: 2,
    },
    divider: {
        height: 1,
        marginLeft: spacing[4] + 36 + spacing[3],
    },
})

export default PushNotificationSettings
