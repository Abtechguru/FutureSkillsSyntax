import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/utils/cn'

type AvatarState = 'idle' | 'success' | 'thinking' | 'happy' | 'sad' | 'wave'

interface AnimatedAvatarProps {
    state?: AvatarState
    skinTone?: string
    size?: 'sm' | 'md' | 'lg' | 'xl'
    className?: string
}

const sizeConfig = {
    sm: { container: 'w-12 h-12', face: 32, eyeSize: 3 },
    md: { container: 'w-16 h-16', face: 48, eyeSize: 4 },
    lg: { container: 'w-24 h-24', face: 72, eyeSize: 6 },
    xl: { container: 'w-32 h-32', face: 96, eyeSize: 8 },
}

const AnimatedAvatar: React.FC<AnimatedAvatarProps> = ({
    state = 'idle',
    skinTone = '#FFDBB4',
    size = 'md',
    className,
}) => {
    const [blinking, setBlinking] = useState(false)
    const sizeStyle = sizeConfig[size]

    // Random blinking
    useEffect(() => {
        const blink = () => {
            setBlinking(true)
            setTimeout(() => setBlinking(false), 150)
        }

        const interval = setInterval(() => {
            if (Math.random() > 0.7) blink()
        }, 2000)

        return () => clearInterval(interval)
    }, [])

    const getEyeAnimation = () => {
        if (blinking) return { scaleY: 0.1 }
        switch (state) {
            case 'thinking':
                return { y: [-1, 1, -1], transition: { duration: 1, repeat: Infinity } }
            case 'happy':
                return { scaleY: 0.8 }
            case 'sad':
                return { y: 2 }
            default:
                return {}
        }
    }

    const getMouthPath = () => {
        switch (state) {
            case 'success':
            case 'happy':
                return 'M 30 60 Q 50 80 70 60' // Big smile
            case 'thinking':
                return 'M 35 65 L 65 65' // Neutral
            case 'sad':
                return 'M 35 70 Q 50 55 65 70' // Frown
            case 'wave':
                return 'M 30 60 Q 50 75 70 60' // Small smile
            default:
                return 'M 35 62 Q 50 72 65 62' // Normal smile
        }
    }

    const getBodyAnimation = () => {
        switch (state) {
            case 'idle':
                return {
                    y: [0, -2, 0],
                    transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
                }
            case 'success':
                return {
                    y: [0, -5, 0],
                    scale: [1, 1.05, 1],
                    transition: { duration: 0.5, repeat: 2 },
                }
            case 'happy':
                return {
                    rotate: [-3, 3, -3],
                    transition: { duration: 0.3, repeat: Infinity },
                }
            case 'thinking':
                return {
                    x: [-2, 2, -2],
                    transition: { duration: 1.5, repeat: Infinity },
                }
            case 'wave':
                return {
                    rotate: [-5, 5, -5],
                    transition: { duration: 0.5, repeat: 2 },
                }
            default:
                return {}
        }
    }

    return (
        <div className={cn('relative', sizeStyle.container, className)}>
            <motion.svg
                viewBox="0 0 100 100"
                className="w-full h-full"
                animate={getBodyAnimation()}
            >
                {/* Background Circle */}
                <circle
                    cx="50"
                    cy="50"
                    r="48"
                    fill="url(#avatarGradient)"
                />

                {/* Gradient Definition */}
                <defs>
                    <linearGradient id="avatarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                </defs>

                {/* Face */}
                <motion.circle
                    cx="50"
                    cy="45"
                    r="32"
                    fill={skinTone}
                />

                {/* Eyes */}
                <motion.g animate={getEyeAnimation()}>
                    {/* Left Eye */}
                    <motion.ellipse
                        cx="38"
                        cy="42"
                        rx={sizeStyle.eyeSize}
                        ry={sizeStyle.eyeSize}
                        fill="#333"
                    />
                    {/* Right Eye */}
                    <motion.ellipse
                        cx="62"
                        cy="42"
                        rx={sizeStyle.eyeSize}
                        ry={sizeStyle.eyeSize}
                        fill="#333"
                    />
                    {/* Eye Shine */}
                    <circle cx="36" cy="40" r="1.5" fill="white" />
                    <circle cx="60" cy="40" r="1.5" fill="white" />
                </motion.g>

                {/* Eyebrows */}
                {state === 'thinking' && (
                    <>
                        <motion.line
                            x1="32" y1="32" x2="44" y2="34"
                            stroke="#333"
                            strokeWidth="2"
                            strokeLinecap="round"
                        />
                        <motion.line
                            x1="56" y1="34" x2="68" y2="32"
                            stroke="#333"
                            strokeWidth="2"
                            strokeLinecap="round"
                        />
                    </>
                )}

                {/* Blush */}
                {(state === 'happy' || state === 'success') && (
                    <>
                        <ellipse cx="28" cy="52" rx="6" ry="4" fill="#ffb6c1" opacity="0.6" />
                        <ellipse cx="72" cy="52" rx="6" ry="4" fill="#ffb6c1" opacity="0.6" />
                    </>
                )}

                {/* Mouth */}
                <motion.path
                    d={getMouthPath()}
                    stroke="#333"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                    initial={false}
                    animate={{ d: getMouthPath() }}
                />

                {/* Success Stars */}
                <AnimatePresence>
                    {state === 'success' && (
                        <>
                            {[...Array(3)].map((_, i) => (
                                <motion.g
                                    key={i}
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0, opacity: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <text
                                        x={20 + i * 30}
                                        y={20}
                                        fontSize="12"
                                        fill="#fbbf24"
                                    >
                                        ★
                                    </text>
                                </motion.g>
                            ))}
                        </>
                    )}
                </AnimatePresence>

                {/* Thinking Dots */}
                {state === 'thinking' && (
                    <g>
                        {[0, 1, 2].map((i) => (
                            <motion.circle
                                key={i}
                                cx={75 + i * 8}
                                cy={25}
                                r="3"
                                fill="#6366f1"
                                initial={{ opacity: 0.3 }}
                                animate={{ opacity: [0.3, 1, 0.3] }}
                                transition={{
                                    duration: 0.8,
                                    delay: i * 0.2,
                                    repeat: Infinity,
                                }}
                            />
                        ))}
                    </g>
                )}

                {/* Wave Hand */}
                {state === 'wave' && (
                    <motion.text
                        x="75"
                        y="50"
                        fontSize="20"
                        animate={{ rotate: [0, 20, 0, 20, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                        style={{ transformOrigin: '85px 50px' }}
                    >
                        👋
                    </motion.text>
                )}
            </motion.svg>

            {/* State Particle Effects */}
            {state === 'success' && (
                <div className="absolute inset-0 pointer-events-none">
                    {[...Array(8)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-1 h-1 rounded-full bg-yellow-400"
                            initial={{
                                x: '50%',
                                y: '50%',
                                scale: 0,
                            }}
                            animate={{
                                x: `${50 + Math.cos(i * 45 * Math.PI / 180) * 50}%`,
                                y: `${50 + Math.sin(i * 45 * Math.PI / 180) * 50}%`,
                                scale: [0, 1, 0],
                            }}
                            transition={{
                                duration: 0.8,
                                delay: i * 0.05,
                                repeat: Infinity,
                                repeatDelay: 2,
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export default AnimatedAvatar
