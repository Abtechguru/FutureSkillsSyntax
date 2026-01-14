import React, { useCallback, useState } from 'react'
import {
    FlatList,
    RefreshControl,
    ActivityIndicator,
    View,
    Text,
    StyleSheet,
    FlatListProps,
} from 'react-native'
import { useTheme } from '../../theme/ThemeProvider'
import { spacing, colors } from '../../theme'

interface InfiniteScrollListProps<T> extends Omit<FlatListProps<T>, 'refreshControl'> {
    data: T[]
    isLoading?: boolean
    isRefreshing?: boolean
    hasMore?: boolean
    onRefresh?: () => Promise<void>
    onLoadMore?: () => Promise<void>
    emptyMessage?: string
    emptyIcon?: React.ReactNode
}

function InfiniteScrollList<T>({
    data,
    isLoading = false,
    isRefreshing = false,
    hasMore = false,
    onRefresh,
    onLoadMore,
    emptyMessage = 'No items found',
    emptyIcon,
    ...flatListProps
}: InfiniteScrollListProps<T>) {
    const { theme } = useTheme()
    const [loadingMore, setLoadingMore] = useState(false)

    const handleRefresh = useCallback(async () => {
        if (onRefresh) {
            await onRefresh()
        }
    }, [onRefresh])

    const handleEndReached = useCallback(async () => {
        if (hasMore && !loadingMore && !isLoading && onLoadMore) {
            setLoadingMore(true)
            await onLoadMore()
            setLoadingMore(false)
        }
    }, [hasMore, loadingMore, isLoading, onLoadMore])

    const renderFooter = () => {
        if (!loadingMore) return null
        return (
            <View style={styles.footer}>
                <ActivityIndicator size="small" color={theme.primary} />
            </View>
        )
    }

    const renderEmpty = () => {
        if (isLoading) return null
        return (
            <View style={styles.emptyContainer}>
                {emptyIcon}
                <Text style={[styles.emptyText, { color: theme.textMuted }]}>
                    {emptyMessage}
                </Text>
            </View>
        )
    }

    if (isLoading && data.length === 0) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.primary} />
            </View>
        )
    }

    return (
        <FlatList
            data={data}
            refreshControl={
                onRefresh ? (
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={handleRefresh}
                        tintColor={theme.primary}
                        colors={[colors.primary[600]]}
                    />
                ) : undefined
            }
            onEndReached={handleEndReached}
            onEndReachedThreshold={0.3}
            ListFooterComponent={renderFooter}
            ListEmptyComponent={renderEmpty}
            showsVerticalScrollIndicator={false}
            {...flatListProps}
        />
    )
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: spacing[8],
    },
    footer: {
        paddingVertical: spacing[4],
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: spacing[12],
        paddingHorizontal: spacing[4],
    },
    emptyText: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: spacing[3],
    },
})

export default InfiniteScrollList
