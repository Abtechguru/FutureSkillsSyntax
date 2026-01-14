import React, { useState, useEffect, useRef } from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    ActivityIndicator,
} from 'react-native'
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av'
import { Ionicons } from '@expo/vector-icons'
import Slider from '@react-native-community/slider'
import * as ScreenOrientation from 'expo-screen-orientation'

import { useTheme } from '../../theme/ThemeProvider'
import { colors, spacing, borderRadius, typography, touchTarget } from '../../theme'

interface VideoPlayerProps {
    source: { uri: string }
    poster?: string
    onProgress?: (progress: number) => void
    onComplete?: () => void
}

const { width: SCREEN_WIDTH } = Dimensions.get('window')

const VideoPlayer: React.FC<VideoPlayerProps> = ({
    source,
    poster,
    onProgress,
    onComplete,
}) => {
    const { theme } = useTheme()
    const videoRef = useRef<Video>(null)

    const [status, setStatus] = useState<AVPlaybackStatus | null>(null)
    const [controlsVisible, setControlsVisible] = useState(true)
    const [isFullscreen, setIsFullscreen] = useState(false)

    const isPlaying = status?.isLoaded && status.isPlaying
    const isBuffering = status?.isLoaded && status.isBuffering
    const position = status?.isLoaded ? status.positionMillis : 0
    const duration = status?.isLoaded ? status.durationMillis || 0 : 0
    const progress = duration > 0 ? position / duration : 0

    useEffect(() => {
        let timeout: NodeJS.Timeout
        if (controlsVisible && isPlaying) {
            timeout = setTimeout(() => setControlsVisible(false), 3000)
        }
        return () => clearTimeout(timeout)
    }, [controlsVisible, isPlaying])

    useEffect(() => {
        if (onProgress && status?.isLoaded) {
            onProgress(progress * 100)
        }
        if (status?.isLoaded && status.didJustFinish) {
            onComplete?.()
        }
    }, [status])

    const togglePlayPause = async () => {
        if (!videoRef.current) return
        if (isPlaying) {
            await videoRef.current.pauseAsync()
        } else {
            await videoRef.current.playAsync()
        }
    }

    const handleSeek = async (value: number) => {
        if (!videoRef.current || !duration) return
        await videoRef.current.setPositionAsync(value * duration)
    }

    const toggleFullscreen = async () => {
        if (isFullscreen) {
            await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP)
        } else {
            await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE)
        }
        setIsFullscreen(!isFullscreen)
    }

    const skipForward = async () => {
        if (!videoRef.current) return
        const newPosition = Math.min(position + 10000, duration)
        await videoRef.current.setPositionAsync(newPosition)
    }

    const skipBackward = async () => {
        if (!videoRef.current) return
        const newPosition = Math.max(position - 10000, 0)
        await videoRef.current.setPositionAsync(newPosition)
    }

    const formatTime = (millis: number) => {
        const totalSeconds = Math.floor(millis / 1000)
        const minutes = Math.floor(totalSeconds / 60)
        const seconds = totalSeconds % 60
        return `${minutes}:${seconds.toString().padStart(2, '0')}`
    }

    return (
        <View style={[styles.container, isFullscreen && styles.fullscreen]}>
            <TouchableOpacity
                activeOpacity={1}
                onPress={() => setControlsVisible(!controlsVisible)}
                style={styles.videoWrapper}
            >
                <Video
                    ref={videoRef}
                    source={source}
                    style={styles.video}
                    resizeMode={ResizeMode.CONTAIN}
                    posterSource={poster ? { uri: poster } : undefined}
                    usePoster={!!poster}
                    onPlaybackStatusUpdate={setStatus}
                    useNativeControls={false}
                />

                {/* Loading Indicator */}
                {isBuffering && (
                    <View style={styles.loadingOverlay}>
                        <ActivityIndicator size="large" color={colors.white} />
                    </View>
                )}

                {/* Controls Overlay */}
                {controlsVisible && (
                    <View style={styles.controlsOverlay}>
                        {/* Top Gradient */}
                        <View style={styles.topGradient} />

                        {/* Center Controls */}
                        <View style={styles.centerControls}>
                            <TouchableOpacity style={styles.skipBtn} onPress={skipBackward}>
                                <Ionicons name="play-back" size={28} color={colors.white} />
                                <Text style={styles.skipText}>10s</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.playBtn} onPress={togglePlayPause}>
                                <Ionicons
                                    name={isPlaying ? 'pause' : 'play'}
                                    size={36}
                                    color={colors.white}
                                />
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.skipBtn} onPress={skipForward}>
                                <Ionicons name="play-forward" size={28} color={colors.white} />
                                <Text style={styles.skipText}>10s</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Bottom Controls */}
                        <View style={styles.bottomControls}>
                            <Text style={styles.timeText}>{formatTime(position)}</Text>
                            <Slider
                                style={styles.slider}
                                minimumValue={0}
                                maximumValue={1}
                                value={progress}
                                onSlidingComplete={handleSeek}
                                minimumTrackTintColor={colors.primary[600]}
                                maximumTrackTintColor={colors.white + '50'}
                                thumbTintColor={colors.primary[600]}
                            />
                            <Text style={styles.timeText}>{formatTime(duration)}</Text>
                            <TouchableOpacity style={styles.controlBtn} onPress={toggleFullscreen}>
                                <Ionicons
                                    name={isFullscreen ? 'contract' : 'expand'}
                                    size={20}
                                    color={colors.white}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: SCREEN_WIDTH,
        aspectRatio: 16 / 9,
        backgroundColor: colors.black,
    },
    fullscreen: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        zIndex: 100,
    },
    videoWrapper: {
        flex: 1,
    },
    video: {
        flex: 1,
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    controlsOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'space-between',
    },
    topGradient: {
        height: 60,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    centerControls: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: spacing[8],
    },
    playBtn: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    skipBtn: {
        alignItems: 'center',
        padding: spacing[2],
    },
    skipText: {
        color: colors.white,
        fontSize: typography.fontSize.xs,
        marginTop: 2,
    },
    bottomControls: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing[3],
        paddingVertical: spacing[2],
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    slider: {
        flex: 1,
        marginHorizontal: spacing[2],
        height: touchTarget.minHeight,
    },
    timeText: {
        color: colors.white,
        fontSize: typography.fontSize.xs,
        minWidth: 40,
        textAlign: 'center',
    },
    controlBtn: {
        padding: spacing[2],
        minWidth: touchTarget.minWidth,
        minHeight: touchTarget.minHeight,
        justifyContent: 'center',
        alignItems: 'center',
    },
})

export default VideoPlayer
