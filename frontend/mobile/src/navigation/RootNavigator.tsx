import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { Ionicons } from '@expo/vector-icons'
import { Platform } from 'react-native'

import { useTheme } from '../theme/ThemeProvider'
import { colors, touchTarget } from '../theme'

// Import screens
import HomeScreen from '../screens/Home/HomeScreen'
import LearnScreen from '../screens/Learn/LearnScreen'
import PathDetailScreen from '../screens/Learn/PathDetailScreen'
import ModuleViewerScreen from '../screens/Learn/ModuleViewerScreen'
import MentorshipScreen from '../screens/Mentorship/MentorshipScreen'
import MentorDetailScreen from '../screens/Mentorship/MentorDetailScreen'
import SessionRoomScreen from '../screens/Mentorship/SessionRoomScreen'
import ProfileScreen from '../screens/Profile/ProfileScreen'
import SettingsScreen from '../screens/Profile/SettingsScreen'
import NotificationsScreen from '../screens/Notifications/NotificationsScreen'
import DrawerContent from '../components/navigation/DrawerContent'

// Navigation types
export type RootStackParamList = {
    Main: undefined
    ModuleViewer: { moduleId: string }
    SessionRoom: { sessionId: string }
    Notifications: undefined
}

export type HomeStackParamList = {
    HomeMain: undefined
}

export type LearnStackParamList = {
    LearnMain: undefined
    PathDetail: { pathId: string }
}

export type MentorshipStackParamList = {
    MentorshipMain: undefined
    MentorDetail: { mentorId: string }
}

export type ProfileStackParamList = {
    ProfileMain: undefined
    Settings: undefined
}

export type TabParamList = {
    Home: undefined
    Learn: undefined
    Mentorship: undefined
    Profile: undefined
}

export type DrawerParamList = {
    Tabs: undefined
}

const Stack = createNativeStackNavigator<RootStackParamList>()
const Tab = createBottomTabNavigator<TabParamList>()
const Drawer = createDrawerNavigator<DrawerParamList>()
const HomeStack = createNativeStackNavigator<HomeStackParamList>()
const LearnStack = createNativeStackNavigator<LearnStackParamList>()
const MentorshipStack = createNativeStackNavigator<MentorshipStackParamList>()
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>()

// Home Stack Navigator
const HomeStackNavigator = () => {
    const { theme } = useTheme()

    return (
        <HomeStack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: theme.background },
                headerTintColor: theme.text,
                headerShadowVisible: false,
            }}
        >
            <HomeStack.Screen
                name="HomeMain"
                component={HomeScreen}
                options={{ title: 'Home' }}
            />
        </HomeStack.Navigator>
    )
}

// Learn Stack Navigator
const LearnStackNavigator = () => {
    const { theme } = useTheme()

    return (
        <LearnStack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: theme.background },
                headerTintColor: theme.text,
                headerShadowVisible: false,
            }}
        >
            <LearnStack.Screen
                name="LearnMain"
                component={LearnScreen}
                options={{ title: 'Learn' }}
            />
            <LearnStack.Screen
                name="PathDetail"
                component={PathDetailScreen}
                options={{ title: 'Course Details' }}
            />
        </LearnStack.Navigator>
    )
}

// Mentorship Stack Navigator
const MentorshipStackNavigator = () => {
    const { theme } = useTheme()

    return (
        <MentorshipStack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: theme.background },
                headerTintColor: theme.text,
                headerShadowVisible: false,
            }}
        >
            <MentorshipStack.Screen
                name="MentorshipMain"
                component={MentorshipScreen}
                options={{ title: 'Mentorship' }}
            />
            <MentorshipStack.Screen
                name="MentorDetail"
                component={MentorDetailScreen}
                options={{ title: 'Mentor Profile' }}
            />
        </MentorshipStack.Navigator>
    )
}

// Profile Stack Navigator
const ProfileStackNavigator = () => {
    const { theme } = useTheme()

    return (
        <ProfileStack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: theme.background },
                headerTintColor: theme.text,
                headerShadowVisible: false,
            }}
        >
            <ProfileStack.Screen
                name="ProfileMain"
                component={ProfileScreen}
                options={{ title: 'Profile' }}
            />
            <ProfileStack.Screen
                name="Settings"
                component={SettingsScreen}
                options={{ title: 'Settings' }}
            />
        </ProfileStack.Navigator>
    )
}

// Bottom Tab Navigator
const TabNavigator = () => {
    const { theme } = useTheme()

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName: keyof typeof Ionicons.glyphMap = 'home'

                    switch (route.name) {
                        case 'Home':
                            iconName = focused ? 'home' : 'home-outline'
                            break
                        case 'Learn':
                            iconName = focused ? 'book' : 'book-outline'
                            break
                        case 'Mentorship':
                            iconName = focused ? 'people' : 'people-outline'
                            break
                        case 'Profile':
                            iconName = focused ? 'person' : 'person-outline'
                            break
                    }

                    return <Ionicons name={iconName} size={size} color={color} />
                },
                tabBarActiveTintColor: theme.primary,
                tabBarInactiveTintColor: theme.textMuted,
                tabBarStyle: {
                    backgroundColor: theme.tabBar,
                    borderTopColor: theme.tabBarBorder,
                    height: Platform.OS === 'ios' ? 88 : 60,
                    paddingTop: 8,
                    paddingBottom: Platform.OS === 'ios' ? 28 : 8,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '500',
                },
                tabBarHideOnKeyboard: true,
                headerShown: false,
                tabBarItemStyle: {
                    minHeight: touchTarget.minHeight,
                },
            })}
        >
            <Tab.Screen name="Home" component={HomeStackNavigator} />
            <Tab.Screen name="Learn" component={LearnStackNavigator} />
            <Tab.Screen name="Mentorship" component={MentorshipStackNavigator} />
            <Tab.Screen name="Profile" component={ProfileStackNavigator} />
        </Tab.Navigator>
    )
}

// Drawer Navigator
const DrawerNavigator = () => {
    const { theme } = useTheme()

    return (
        <Drawer.Navigator
            drawerContent={(props) => <DrawerContent {...props} />}
            screenOptions={{
                headerShown: false,
                drawerStyle: {
                    backgroundColor: theme.background,
                    width: 280,
                },
                swipeEdgeWidth: 50,
                swipeEnabled: true,
            }}
        >
            <Drawer.Screen name="Tabs" component={TabNavigator} />
        </Drawer.Navigator>
    )
}

// Root Navigator
const RootNavigator = () => {
    const { theme } = useTheme()

    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: theme.background },
                headerTintColor: theme.text,
                headerShadowVisible: false,
            }}
        >
            <Stack.Screen
                name="Main"
                component={DrawerNavigator}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="ModuleViewer"
                component={ModuleViewerScreen}
                options={{
                    headerShown: false,
                    presentation: 'fullScreenModal',
                }}
            />
            <Stack.Screen
                name="SessionRoom"
                component={SessionRoomScreen}
                options={{
                    headerShown: false,
                    presentation: 'fullScreenModal',
                }}
            />
            <Stack.Screen
                name="Notifications"
                component={NotificationsScreen}
                options={{ title: 'Notifications' }}
            />
        </Stack.Navigator>
    )
}

export default RootNavigator
