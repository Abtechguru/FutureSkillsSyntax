import { useState, useEffect, useCallback } from 'react'
import NetInfo, { NetInfoState, NetInfoStateType } from '@react-native-community/netinfo'
import AsyncStorage from '@react-native-async-storage/async-storage'

const OFFLINE_QUEUE_KEY = 'offline_queue'

interface OfflineRequest {
    id: string
    url: string
    method: 'GET' | 'POST' | 'PUT' | 'DELETE'
    data?: any
    timestamp: number
}

interface UseOfflineMode {
    isOnline: boolean
    isConnected: boolean | null
    connectionType: NetInfoStateType | null
    queueRequest: (request: Omit<OfflineRequest, 'id' | 'timestamp'>) => Promise<void>
    processQueue: () => Promise<void>
    getQueueLength: () => Promise<number>
    clearQueue: () => Promise<void>
}

export const useOfflineMode = (): UseOfflineMode => {
    const [isOnline, setIsOnline] = useState(true)
    const [isConnected, setIsConnected] = useState<boolean | null>(null)
    const [connectionType, setConnectionType] = useState<NetInfoStateType | null>(null)

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
            setIsOnline(state.isInternetReachable ?? state.isConnected ?? false)
            setIsConnected(state.isConnected)
            setConnectionType(state.type)
        })

        // Get initial state
        NetInfo.fetch().then((state: NetInfoState) => {
            setIsOnline(state.isInternetReachable ?? state.isConnected ?? false)
            setIsConnected(state.isConnected)
            setConnectionType(state.type)
        })

        return () => unsubscribe()
    }, [])

    const queueRequest = useCallback(async (
        request: Omit<OfflineRequest, 'id' | 'timestamp'>
    ): Promise<void> => {
        const queue = await getQueue()
        const newRequest: OfflineRequest = {
            ...request,
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            timestamp: Date.now(),
        }
        queue.push(newRequest)
        await AsyncStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue))
    }, [])

    const getQueue = async (): Promise<OfflineRequest[]> => {
        try {
            const queueStr = await AsyncStorage.getItem(OFFLINE_QUEUE_KEY)
            return queueStr ? JSON.parse(queueStr) : []
        } catch {
            return []
        }
    }

    const processQueue = useCallback(async (): Promise<void> => {
        if (!isOnline) return

        const queue = await getQueue()
        if (queue.length === 0) return

        const processedIds: string[] = []

        for (const request of queue) {
            try {
                // Process the request (actual API call would be here)
                // await apiService[request.method.toLowerCase()](request.url, request.data)
                processedIds.push(request.id)
            } catch (error) {
                // If request fails, stop processing and keep remaining in queue
                break
            }
        }

        // Remove processed requests from queue
        const remainingQueue = queue.filter(r => !processedIds.includes(r.id))
        await AsyncStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(remainingQueue))
    }, [isOnline])

    const getQueueLength = useCallback(async (): Promise<number> => {
        const queue = await getQueue()
        return queue.length
    }, [])

    const clearQueue = useCallback(async (): Promise<void> => {
        await AsyncStorage.removeItem(OFFLINE_QUEUE_KEY)
    }, [])

    return {
        isOnline,
        isConnected,
        connectionType,
        queueRequest,
        processQueue,
        getQueueLength,
        clearQueue,
    }
}

export default useOfflineMode
