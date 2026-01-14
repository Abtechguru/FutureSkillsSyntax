import React, { useState, useEffect, useCallback } from 'react'
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Image,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { Ionicons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useTheme } from '../../theme/ThemeProvider'
import { spacing, borderRadius, typography, shadows, colors, touchTarget } from '../../theme'
import InfiniteScrollList from '../../components/lists/InfiniteScrollList'
import apiService from '../../services/api'
import { LearnStackParamList } from '../../navigation/RootNavigator'

type NavigationProp = NativeStackNavigationProp<LearnStackParamList>

interface LearningPath {
    id: string
    title: string
    description: string
    thumbnail: string
    instructor: string
    rating: number
    enrolled: number
    duration: string
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
    progress?: number
    skills: string[]
}

const categories = ['All', 'Web Dev', 'Mobile', 'Cloud', 'Data', 'AI/ML']

const LearnScreen: React.FC = () => {
    const { theme } = useTheme()
    const navigation = useNavigation<NavigationProp>()
    const insets = useSafeAreaInsets()

    const [paths, setPaths] = useState<LearningPath[]>([])
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('All')
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)

    useEffect(() => {
        loadPaths(true)
    }, [selectedCategory])

    const loadPaths = async (reset = false) => {
        const currentPage = reset ? 1 : page
        try {
            const data = await apiService.get<{ paths: LearningPath[]; hasMore: boolean }>(
                `/api/v1/learning/paths?page=${currentPage}&category=${selectedCategory}&search=${searchQuery}`
            )

            if (reset) {
                setPaths(data.paths)
            } else {
                setPaths(prev => [...prev, ...data.paths])
            }
            setHasMore(data.hasMore)
            setPage(currentPage + 1)
        } catch (error) {
            console.error('Failed to load paths:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleRefresh = useCallback(async () => {
        setRefreshing(true)
        setPage(1)
        await loadPaths(true)
        setRefreshing(false)
    }, [selectedCategory, searchQuery])

    const handleLoadMore = useCallback(async () => {
        if (hasMore && !loading) {
            await loadPaths(false)
        }
    }, [hasMore, loading, page])

    const handleSearch = () => {
        setPage(1)
        loadPaths(true)
    }

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'Beginner': return colors.success
            case 'Intermediate': return colors.warning
            case 'Advanced': return colors.error
            default: return colors.gray[500]
        }
    }

    const renderPathCard = ({ item }: { item: LearningPath }) => (
        <TouchableOpacity
            style={[styles.pathCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
            onPress={() => navigation.navigate('PathDetail', { pathId: item.id })}
            activeOpacity={0.7}
        >
            <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
            <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                    <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(item.difficulty) + '20' }]}>
                        <Text style={[styles.difficultyText, { color: getDifficultyColor(item.difficulty) }]}>
                            {item.difficulty}
                        </Text>
                    </View>
                    {item.progress !== undefined && (
                        <Text style={[styles.progressText, { color: theme.primary }]}>
                            {item.progress}%
                        </Text>
                    )}
                </View>

                <Text style={[styles.pathTitle, { color: theme.text }]} numberOfLines={2}>
                    {item.title}
                </Text>
                <Text style={[styles.instructor, { color: theme.textSecondary }]}>
                    by {item.instructor}
                </Text>

                <View style={styles.statsRow}>
                    <View style={styles.stat}>
                        <Ionicons name="star" size={14} color={colors.warning} />
                        <Text style={[styles.statText, { color: theme.textSecondary }]}>
                            {item.rating.toFixed(1)}
                        </Text>
                    </View>
                    <View style={styles.stat}>
                        <Ionicons name="people-outline" size={14} color={theme.textMuted} />
                        <Text style={[styles.statText, { color: theme.textSecondary }]}>
                            {item.enrolled.toLocaleString()}
                        </Text>
                    </View>
                    <View style={styles.stat}>
                        <Ionicons name="time-outline" size={14} color={theme.textMuted} />
                        <Text style={[styles.statText, { color: theme.textSecondary }]}>
                            {item.duration}
                        </Text>
                    </View>
                </View>

                <View style={styles.skillsRow}>
                    {item.skills.slice(0, 3).map((skill, idx) => (
                        <View key={idx} style={[styles.skillBadge, { backgroundColor: theme.surface }]}>
                            <Text style={[styles.skillText, { color: theme.textSecondary }]}>{skill}</Text>
                        </View>
                    ))}
                </View>
            </View>
        </TouchableOpacity>
    )

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <View style={[styles.searchInputWrapper, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                    <Ionicons name="search" size={20} color={theme.textMuted} />
                    <TextInput
                        style={[styles.searchInput, { color: theme.text }]}
                        placeholder="Search courses..."
                        placeholderTextColor={theme.textMuted}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        onSubmitEditing={handleSearch}
                        returnKeyType="search"
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => { setSearchQuery(''); handleSearch() }}>
                            <Ionicons name="close-circle" size={20} color={theme.textMuted} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Categories */}
            <View style={styles.categoriesContainer}>
                {categories.map((category) => (
                    <TouchableOpacity
                        key={category}
                        style={[
                            styles.categoryBtn,
                            selectedCategory === category && { backgroundColor: theme.primary },
                            selectedCategory !== category && { backgroundColor: theme.surface, borderColor: theme.border, borderWidth: 1 },
                        ]}
                        onPress={() => setSelectedCategory(category)}
                    >
                        <Text
                            style={[
                                styles.categoryText,
                                { color: selectedCategory === category ? colors.white : theme.text },
                            ]}
                        >
                            {category}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Path List */}
            <InfiniteScrollList
                data={paths}
                renderItem={renderPathCard}
                keyExtractor={(item) => item.id}
                isLoading={loading}
                isRefreshing={refreshing}
                hasMore={hasMore}
                onRefresh={handleRefresh}
                onLoadMore={handleLoadMore}
                contentContainerStyle={styles.listContent}
                emptyMessage="No courses found"
                emptyIcon={<Ionicons name="book-outline" size={48} color={theme.textMuted} />}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    searchContainer: {
        paddingHorizontal: spacing[4],
        paddingVertical: spacing[3],
    },
    searchInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing[3],
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        height: touchTarget.minHeight,
    },
    searchInput: {
        flex: 1,
        marginLeft: spacing[2],
        fontSize: typography.fontSize.base,
    },
    categoriesContainer: {
        flexDirection: 'row',
        paddingHorizontal: spacing[4],
        paddingBottom: spacing[3],
        gap: spacing[2],
    },
    categoryBtn: {
        paddingHorizontal: spacing[3],
        paddingVertical: spacing[2],
        borderRadius: borderRadius.full,
        minHeight: 32,
        justifyContent: 'center',
    },
    categoryText: {
        fontSize: typography.fontSize.sm,
        fontWeight: '500',
    },
    listContent: {
        paddingHorizontal: spacing[4],
        paddingBottom: spacing[6],
    },
    pathCard: {
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        marginBottom: spacing[4],
        overflow: 'hidden',
        ...shadows.sm,
    },
    thumbnail: {
        width: '100%',
        height: 140,
    },
    cardContent: {
        padding: spacing[4],
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing[2],
    },
    difficultyBadge: {
        paddingHorizontal: spacing[2],
        paddingVertical: spacing[1],
        borderRadius: borderRadius.sm,
    },
    difficultyText: {
        fontSize: typography.fontSize.xs,
        fontWeight: '600',
    },
    progressText: {
        fontSize: typography.fontSize.sm,
        fontWeight: '600',
    },
    pathTitle: {
        fontSize: typography.fontSize.lg,
        fontWeight: '600',
        marginBottom: spacing[1],
    },
    instructor: {
        fontSize: typography.fontSize.sm,
        marginBottom: spacing[3],
    },
    statsRow: {
        flexDirection: 'row',
        gap: spacing[4],
        marginBottom: spacing[3],
    },
    stat: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing[1],
    },
    statText: {
        fontSize: typography.fontSize.sm,
    },
    skillsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing[2],
    },
    skillBadge: {
        paddingHorizontal: spacing[2],
        paddingVertical: spacing[1],
        borderRadius: borderRadius.sm,
    },
    skillText: {
        fontSize: typography.fontSize.xs,
    },
})

export default LearnScreen
