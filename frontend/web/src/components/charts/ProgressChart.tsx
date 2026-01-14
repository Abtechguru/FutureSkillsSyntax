import React from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { TrendingUp } from 'lucide-react'
import { cn } from '@/utils/cn'

interface ProgressData {
  date: string
  xp: number
  level: number
  completedModules: number
}

interface ProgressChartProps {
  data: ProgressData[]
  className?: string
  height?: number
  showLegend?: boolean
}

const ProgressChart: React.FC<ProgressChartProps> = ({
  data,
  className,
  height = 300,
  showLegend = true,
}) => {
  // Calculate growth percentage
  const calculateGrowth = () => {
    if (data.length < 2) return 0
    const first = data[0].xp
    const last = data[data.length - 1].xp
    return ((last - first) / first) * 100
  }

  const growth = calculateGrowth()
  const growthColor = growth >= 0 ? 'text-green-500' : 'text-red-500'

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header with stats */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Learning Progress
          </h3>
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span className={`text-sm ${growthColor}`}>
              {growth >= 0 ? '+' : ''}
              {growth.toFixed(1)}% growth
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {data[data.length - 1]?.xp.toLocaleString() || 0}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total XP</div>
        </div>
      </div>

      {/* Chart */}
      <div className="w-full">
        <ResponsiveContainer width="100%" height={height}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="date"
              tick={{ fill: '#6b7280', fontSize: 12 }}
              tickFormatter={(value) => {
                const date = new Date(value)
                return `${date.getMonth() + 1}/${date.getDate()}`
              }}
            />
            <YAxis
              tick={{ fill: '#6b7280', fontSize: 12 }}
              label={{
                value: 'Experience Points',
                angle: -90,
                position: 'insideLeft',
                style: { textAnchor: 'middle', fill: '#6b7280' },
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
              }}
              formatter={(value, name) => {
                if (name === 'xp') return [value, 'XP']
                if (name === 'level') return [value, 'Level']
                return [value, 'Modules']
              }}
              labelFormatter={(label) => {
                const date = new Date(label)
                return date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })
              }}
            />
            {showLegend && <Legend />}
            <Area
              type="monotone"
              dataKey="xp"
              name="Experience Points"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.1}
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="completedModules"
              name="Completed Modules"
              stroke="#10b981"
              fill="#10b981"
              fillOpacity={0.1}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Mini stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {data[data.length - 1]?.level || 1}
          </div>
          <div className="text-sm text-gray-600">Current Level</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {data[data.length - 1]?.completedModules || 0}
          </div>
          <div className="text-sm text-gray-600">Modules Completed</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">
            {data.length}
          </div>
          <div className="text-sm text-gray-600">Days Tracked</div>
        </div>
      </div>
    </div>
  )
}

export default ProgressChart