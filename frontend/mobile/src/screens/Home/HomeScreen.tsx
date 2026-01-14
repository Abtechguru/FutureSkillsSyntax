import React, { useState, useEffect, useCallback } from 'react'
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    RefreshControl,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { Ionicons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useTheme } from '../../theme/ThemeProvider'
import { spacing, borderRadius, typography, shadows, colors, touchTarget } from '../../theme'
import { useOfflineMode } from '../../hooks/useOfflineMode'
import apiService from '../../services/api'
import Card from '../../components/ui/Card'
import ProgressBar from '../../components/ui/ProgressBar'
import { RootStackParamList } from '../../navigation/RootNavigator'

type NavigationProp = NativeStackNavigationProp<RootStackParamList>

interface DashboardStats {
    coursesInProgress: number
    totalXp: number
    currentStreak: number
    upcomingSessions: number
}

interface Course {
    id: string
    title: string
    progress: number
    thumbnail: string
    nextLesson: string
}

interface Session {
    id: string
    title: string
    mentorName: string
    mentorAvatar: string
    date: string
    time: string
}

const HomeScreen: React.FC = () => {
    const { theme } = useTheme()
    const navigation = useNavigation<NavigationProp>()
    const insets = useSafeAreaInsets()
    const { isOnline } = useOfflineMode()

    const [refreshing, setRefreshing] = useState(false)
    const [stats, setStats] = useState<DashboardStats | null>(null)
    const [courses, setCourses] = useState<Course[]>([])
    const [sessions, setSessions] = useState<Session[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadDashboardData()
    }, [])

    const loadDashboardData = async () => {
        try {
            const [statsData, coursesData, sessionsData] = await Promise.all([
                apiService.get<DashboardStats>('/api/v1/dashboard/stats'),
                apiService.get<Course[]>('/api/v1/dashboard/courses'),
                apiService.get<Session[]>('/api/v1/dashboard/sessions'),
            ])
            setStats(statsData)
            setCourses(coursesData)
            setSessions(sessionsData)
        } catch (error) {
            console.error('Failed to load dashboard:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleRefresh = useCallback(async () => {
        setRefreshing(true)
        await loadDashboardData()
        setRefreshing(false)
    }, [])

    const renderStatCard = (icon: string, value: string | number, label: string, color: string) => (
        <View style={[styles.statCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
            <View style={[styles.statIcon, { backgroundColor: color + '20' }]}>
                <Ionicons name={icon as any} size={20} color={color} />
            </View>
            <Text style={[styles.statValue, { color: theme.text }]}>{value}</Text>
            <Text style={[styles.statLabel, { color: theme.textMuted }]}>{label}</Text>
        </View>
    )

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: theme.background }]}
            contentContainerStyle={{ paddingBottom: insets.bottom + spacing[4] }}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                    tintColor={theme.primary}
                />
            }
            showsVerticalScrollIndicator={false}
        >
            {/* Offline Banner */}
            {!isOnline && (
                <View style={styles.offlineBanner}>
                    <Ionicons name="cloud-offline" size={16} color={colors.white} />
                    <Text style={styles.offlineText}>You're offline</Text>
                </View>
            )}

            {/* Welcome Header */}
            <View style={styles.header}>
                <View>
                    <Text style={[styles.greeting, { color: theme.textSecondary }]}>
                        Good morning,
                    </Text>
                    <Text style={[styles.userName, { color: theme.text }]}>John</Text>
                </View>
                <TouchableOpacity
                    style={[styles.notificationBtn, { backgroundColor: theme.surface }]}
                    onPress={() => navigation.navigate('Notifications')}
                >
                    <Ionicons name="notifications-outline" size={24} color={theme.text} />
                    <View style={styles.notificationBadge}>
                        <Text style={styles.badgeText}>3</Text>
                    </View>
                </TouchableOpacity>
            </View>

            {/* Stats Grid */}
            <View style={styles.statsGrid}>
                {renderStatCard('book', stats?.coursesInProgress || 0, 'In Progress', colors.primary[600])}
                {renderStatCard('flash', stats?.totalXp || 0, 'Total XP', colors.warning)}
                {renderStatCard('flame', stats?.currentStreak || 0, 'Day Streak', colors.error)}
                {renderStatCard('calendar', stats?.upcomingSessions || 0, 'Sessions', colors.success)}
            </View>

            {/* Continue Learning */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Continue Learning</Text>
                    <TouchableOpacity>
                        <Text style={[styles.seeAll, { color: theme.primary }]}>See All</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.coursesRow}
                >
                    {courses.map((course) => (
                        <TouchableOpacity
                            key={course.id}
                            style={[styles.courseCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
                            onPress={() => navigation.navigate('ModuleViewer', { moduleId: course.id })}
                        >
                            <Image
                                source={{ uri: course.thumbnail }}
                                style={styles.courseThumbnail}
                            />
                            <View style={styles.courseContent}>
                                <Text style={[styles.courseTitle, { color: theme.text }]} numberOfLines={2}>
                                    {course.title}
                                </Text>
                                <Text style={[styles.nextLesson, { color: theme.textMuted }]} numberOfLines={1}>
                                    Next: {course.nextLesson}
                                </Text>
                                <ProgressBar progress={course.progress} style={styles.progressBar} />
                                <Text style={[styles.progressText, { color: theme.textSecondary }]}>
                                    {course.progress}% complete
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Upcoming Sessions */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Upcoming Sessions</Text>
                    <TouchableOpacity>
                        <Text style={[styles.seeAll, { color: theme.primary }]}>See All</Text>
                    </TouchableOpacity>
                </View>

                {sessions.map((session) => (
                    <TouchableOpacity
                        key={session.id}
                        style={[styles.sessionCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
                        onPress={() => navigation.navigate('SessionRoom', { sessionId: session.id })}
                    >
                        <Image
                            source={{ uri: session.mentorAvatar }}
                            style={styles.mentorAvatar}
                        />
                        <View style={styles.sessionContent}>
                            <Text style={[styles.sessionTitle, { color: theme.text }]}>{session.title}</Text>
                            <Text style={[styles.mentorName, { color: theme.textSecondary }]}>
                                with {session.mentorName}
                            </Text>
                            <View style={styles.sessionTime}>
                                <Ionicons name="calendar-outline" size={14} color={theme.textMuted} />
                                <Text style={[styles.timeText, { color: theme.textMuted }]}>
                                    {session.date} at {session.time}
                                </Text>
                            </View>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={theme.textMuted} />
                    </TouchableOpacity>
                ))}
            </View>

            {/* Quick Actions */}
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>Quick Actions</Text>
                <View style={styles.actionsGrid}>
                    {[
                        { icon: 'search', label: 'Find Mentor', color: colors.primary[600] },
                        { icon: 'people', label: 'Community', color: colors.success },
                        { icon: 'trophy', label: 'Achievements', color: colors.warning },
                        { icon: 'help-circle', label: 'Get Help', color: colors.info },
                    ].map((action, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[styles.actionBtn, { backgroundColor: theme.surface }]}
                        >
                            <View style={[styles.actionIcon, { backgroundColor: action.color + '20' }]}>
                                <Ionicons name={action.icon as any} size={24} color={action.color} />
                            </View>
                            <Text style={[styles.actionLabel, { color: theme.text }]}>{action.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    offlineBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.warning,
        paddingVertical: spacing[2],
        gap: spacing[2],
    },
    offlineText: {
        color: colors.white,
        fontSize: typography.fontSize.sm,
        fontWeight: '600',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing[4],
        paddingTop: spacing[4],
        paddingBottom: spacing[4],
    },
    greeting: {
        fontSize: typography.fontSize.sm,
    },
    userName: {
        fontSize: typography.fontSize['2xl'],
        fontWeight: '700',
    },
    notificationBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    notificationBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: colors.error,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeText: {
        color: colors.white,
        fontSize: 10,
        fontWeight: '700',
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: spacing[4],
        gap: spacing[3],
    },
    statCard: {
        flex: 1,
        minWidth: '45%',
        padding: spacing[3],
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        alignItems: 'center',
        ...shadows.sm,
    },
    statIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing[2],
    },
    statValue: {
        fontSize: typography.fontSize.xl,
        fontWeight: '700',
    },
    statLabel: {
        fontSize: typography.fontSize.xs,
        marginTop: 2,
    },
    section: {
        marginTop: spacing[6],
        paddingHorizontal: spacing[4],
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing[3],
    },
    sectionTitle: {
        fontSize: typography.fontSize.lg,
        fontWeight: '600',
    },
    seeAll: {
        fontSize: typography.fontSize.sm,
        fontWeight: '500',
    },
    coursesRow: {
        paddingRight: spacing[4],
        gap: spacing[3],
    },
    courseCard: {
        width: 200,
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        overflow: 'hidden',
        ...shadows.sm,
    },
    courseThumbnail: {
        width: '100%',
        height: 100,
    },
    courseContent: {
        padding: spacing[3],
    },
    courseTitle: {
        fontSize: typography.fontSize.sm,
        fontWeight: '600',
        marginBottom: spacing[1],
    },
    nextLesson: {
        fontSize: typography.fontSize.xs,
        marginBottom: spacing[2],
    },
    progressBar: {
        marginBottom: spacing[1],
    },
    progressText: {
        fontSize: typography.fontSize.xs,
    },
    sessionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing[3],
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        marginBottom: spacing[3],
        minHeight: touchTarget.minHeight,
        ...shadows.sm,
    },
    mentorAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
    },
    sessionContent: {
        flex: 1,
        marginLeft: spacing[3],
    },
    sessionTitle: {
        fontSize: typography.fontSize.base,
        fontWeight: '600',
    },
    mentorName: {
        fontSize: typography.fontSize.sm,
        marginTop: 2,
    },
    sessionTime: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing[1],
        marginTop: spacing[1],
    },
    timeText: {
        fontSize: typography.fontSize.xs,
    },
    actionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing[3],
        marginTop: spacing[3],
    },
    actionBtn: {
        flex: 1,
        minWidth: '45%',
        alignItems: 'center',
        padding: spacing[4],
        borderRadius: borderRadius.lg,
        minHeight: touchTarget.minHeight,
    },
    actionIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing[2],
    },
    actionLabel: {
        fontSize: typography.fontSize.sm,
        fontWeight: '500',
    },
})

export default HomeScreen
