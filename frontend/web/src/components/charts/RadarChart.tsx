import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'

interface RadarDataPoint {
    label: string
    value: number
    maxValue?: number
}

interface RadarChartProps {
    data: RadarDataPoint[]
    comparisonData?: RadarDataPoint[]
    size?: number
    primaryColor?: string
    secondaryColor?: string
    showLabels?: boolean
    showValues?: boolean
    animated?: boolean
    className?: string
}

const RadarChart: React.FC<RadarChartProps> = ({
    data,
    comparisonData,
    size = 300,
    primaryColor = '#4F46E5',
    secondaryColor = '#10B981',
    showLabels = true,
    showValues = true,
    animated = true,
    className,
}) => {
    const center = size / 2
    const radius = (size / 2) * 0.7
    const numPoints = data.length
    const angleStep = (2 * Math.PI) / numPoints

    // Calculate point positions
    const getPoint = (index: number, value: number, maxValue = 100) => {
        const angle = (index * angleStep) - (Math.PI / 2) // Start from top
        const normalizedValue = Math.min(value / maxValue, 1)
        const x = center + radius * normalizedValue * Math.cos(angle)
        const y = center + radius * normalizedValue * Math.sin(angle)
        return { x, y }
    }

    // Create path for data points
    const createPath = (dataPoints: RadarDataPoint[]) => {
        return dataPoints
            .map((point, index) => {
                const { x, y } = getPoint(index, point.value, point.maxValue)
                return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
            })
            .join(' ') + ' Z'
    }

    // Generate grid circles
    const gridCircles = [0.2, 0.4, 0.6, 0.8, 1].map((scale) => ({
        scale,
        radius: radius * scale,
    }))

    // Generate axis lines
    const axisLines = data.map((_, index) => {
        const angle = (index * angleStep) - (Math.PI / 2)
        return {
            x1: center,
            y1: center,
            x2: center + radius * Math.cos(angle),
            y2: center + radius * Math.sin(angle),
        }
    })

    // Label positions
    const labelPositions = data.map((point, index) => {
        const angle = (index * angleStep) - (Math.PI / 2)
        const labelRadius = radius * 1.2
        return {
            x: center + labelRadius * Math.cos(angle),
            y: center + labelRadius * Math.sin(angle),
            label: point.label,
            value: point.value,
        }
    })

    return (
        <div className={cn('relative', className)}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                {/* Grid circles */}
                {gridCircles.map(({ scale, radius: r }) => (
                    <circle
                        key={scale}
                        cx={center}
                        cy={center}
                        r={r}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                        className="text-gray-200 dark:text-gray-700"
                    />
                ))}

                {/* Axis lines */}
                {axisLines.map((line, index) => (
                    <line
                        key={index}
                        x1={line.x1}
                        y1={line.y1}
                        x2={line.x2}
                        y2={line.y2}
                        stroke="currentColor"
                        strokeWidth="1"
                        className="text-gray-200 dark:text-gray-700"
                    />
                ))}

                {/* Comparison data area (if provided) */}
                {comparisonData && (
                    <motion.path
                        d={createPath(comparisonData)}
                        fill={secondaryColor}
                        fillOpacity={0.2}
                        stroke={secondaryColor}
                        strokeWidth="2"
                        initial={animated ? { pathLength: 0, opacity: 0 } : undefined}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1, delay: 0.5 }}
                    />
                )}

                {/* Primary data area */}
                <motion.path
                    d={createPath(data)}
                    fill={primaryColor}
                    fillOpacity={0.3}
                    stroke={primaryColor}
                    strokeWidth="2"
                    initial={animated ? { pathLength: 0, opacity: 0 } : undefined}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1 }}
                />

                {/* Data points */}
                {data.map((point, index) => {
                    const { x, y } = getPoint(index, point.value, point.maxValue)
                    return (
                        <motion.circle
                            key={index}
                            cx={x}
                            cy={y}
                            r="5"
                            fill={primaryColor}
                            stroke="white"
                            strokeWidth="2"
                            initial={animated ? { scale: 0 } : undefined}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                        />
                    )
                })}

                {/* Comparison data points */}
                {comparisonData?.map((point, index) => {
                    const { x, y } = getPoint(index, point.value, point.maxValue)
                    return (
                        <motion.circle
                            key={`comp-${index}`}
                            cx={x}
                            cy={y}
                            r="4"
                            fill={secondaryColor}
                            stroke="white"
                            strokeWidth="2"
                            initial={animated ? { scale: 0 } : undefined}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                        />
                    )
                })}
            </svg>

            {/* Labels */}
            {showLabels && (
                <div className="absolute inset-0">
                    {labelPositions.map((pos, index) => (
                        <div
                            key={index}
                            className="absolute transform -translate-x-1/2 -translate-y-1/2"
                            style={{ left: pos.x, top: pos.y }}
                        >
                            <div className="text-center">
                                <span className="text-xs font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                                    {pos.label}
                                </span>
                                {showValues && (
                                    <span className="block text-xs text-gray-500">
                                        {pos.value}%
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default RadarChart
