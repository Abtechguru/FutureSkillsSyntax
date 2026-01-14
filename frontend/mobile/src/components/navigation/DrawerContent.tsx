import React from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
} from 'react-native'
import { DrawerContentScrollView, DrawerContentComponentProps } from '@react-navigation/drawer'
import { Ionicons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useTheme } from '../../theme/ThemeProvider'
import { colors, spacing, borderRadius, typography } from '../../theme'

interface MenuItem {
    icon: keyof typeof Ionicons.glyphMap
    label: string
    route?: string
    action?: () => void
}

const DrawerContent: React.FC<DrawerContentComponentProps> = (props) => {
    const { theme, isDark, toggleTheme } = useTheme()
    const insets = useSafeAreaInsets()

    const menuItems: MenuItem[] = [
        { icon: 'home-outline', label: 'Home', route: 'Home' },
        { icon: 'book-outline', label: 'Learning Paths', route: 'Learn' },
        { icon: 'people-outline', label: 'Mentorship', route: 'Mentorship' },
        { icon: 'chatbubbles-outline', label: 'Community', route: 'Community' },
        { icon: 'trophy-outline', label: 'Achievements', route: 'Achievements' },
        { icon: 'calendar-outline', label: 'Sessions', route: 'Sessions' },
    ]

    const bottomItems: MenuItem[] = [
        { icon: 'settings-outline', label: 'Settings', route: 'Settings' },
        { icon: 'help-circle-outline', label: 'Help & Support', route: 'Help' },
        {
            icon: isDark ? 'sunny-outline' : 'moon-outline',
            label: isDark ? 'Light Mode' : 'Dark Mode',
            action: toggleTheme
        },
    ]

    const handlePress = (item: MenuItem) => {
        if (item.action) {
            item.action()
        } else if (item.route) {
            props.navigation.navigate(item.route)
        }
        props.navigation.closeDrawer()
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + spacing[4] }]}>
                <View style={styles.userInfo}>
                    <Image
                        source={{ uri: 'https://api.dicebear.com/7.x/avataaars/png?seed=User' }}
                        style={styles.avatar}
                    />
                    <View style={styles.userText}>
                        <Text style={[styles.userName, { color: theme.text }]}>John Doe</Text>
                        <Text style={[styles.userEmail, { color: theme.textSecondary }]}>
                            john@example.com
                        </Text>
                    </View>
                </View>

                {/* Stats */}
                <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                        <Text style={[styles.statValue, { color: theme.primary }]}>2,450</Text>
                        <Text style={[styles.statLabel, { color: theme.textMuted }]}>XP</Text>
                    </View>
                    <View style={[styles.statDivider, { backgroundColor: theme.divider }]} />
                    <View style={styles.statItem}>
                        <Text style={[styles.statValue, { color: theme.primary }]}>12</Text>
                        <Text style={[styles.statLabel, { color: theme.textMuted }]}>Level</Text>
                    </View>
                    <View style={[styles.statDivider, { backgroundColor: theme.divider }]} />
                    <View style={styles.statItem}>
                        <Text style={[styles.statValue, { color: theme.primary }]}>14</Text>
                        <Text style={[styles.statLabel, { color: theme.textMuted }]}>Streak</Text>
                    </View>
                </View>
            </View>

            <View style={[styles.divider, { backgroundColor: theme.divider }]} />

            {/* Menu Items */}
            <ScrollView style={styles.menuContainer}>
                {menuItems.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.menuItem}
                        onPress={() => handlePress(item)}
                        activeOpacity={0.7}
                    >
                        <Ionicons name={item.icon} size={22} color={theme.textSecondary} />
                        <Text style={[styles.menuLabel, { color: theme.text }]}>{item.label}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <View style={[styles.divider, { backgroundColor: theme.divider }]} />

            {/* Bottom Items */}
            <View style={[styles.bottomMenu, { paddingBottom: insets.bottom + spacing[4] }]}>
                {bottomItems.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.menuItem}
                        onPress={() => handlePress(item)}
                        activeOpacity={0.7}
                    >
                        <Ionicons name={item.icon} size={22} color={theme.textSecondary} />
                        <Text style={[styles.menuLabel, { color: theme.text }]}>{item.label}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: spacing[4],
        paddingBottom: spacing[4],
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing[4],
    },
    avatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
    },
    userText: {
        marginLeft: spacing[3],
        flex: 1,
    },
    userName: {
        fontSize: typography.fontSize.lg,
        fontWeight: '600',
    },
    userEmail: {
        fontSize: typography.fontSize.sm,
        marginTop: 2,
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: colors.primary[50],
        borderRadius: borderRadius.lg,
        paddingVertical: spacing[3],
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: typography.fontSize.lg,
        fontWeight: '700',
    },
    statLabel: {
        fontSize: typography.fontSize.xs,
        marginTop: 2,
    },
    statDivider: {
        width: 1,
        height: 30,
    },
    divider: {
        height: 1,
        marginHorizontal: spacing[4],
    },
    menuContainer: {
        flex: 1,
        paddingVertical: spacing[2],
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing[3],
        paddingHorizontal: spacing[4],
        minHeight: 44,
    },
    menuLabel: {
        fontSize: typography.fontSize.base,
        marginLeft: spacing[3],
        fontWeight: '500',
    },
    bottomMenu: {
        paddingTop: spacing[2],
    },
})

export default DrawerContent
