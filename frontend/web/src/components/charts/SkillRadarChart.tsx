import React from 'react'
import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts'
import { cn } from '@/utils/cn'

interface SkillData {
  skill: string
  current: number
  target: number
}

interface SkillRadarChartProps {
  data: SkillData[]
  className?: string
  height?: number
}

const SkillRadarChart: React.FC<SkillRadarChartProps> = ({
  data,
  className,
  height = 400,
}) => {
  const chartData = data.map((item) => ({
    ...item,
    fullMark: 5, // Assuming skills are rated 1-5
  }))

  return (
    <div className={cn('w-full', className)}>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsRadarChart data={chartData}>
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis
            dataKey="skill"
            tick={{ fill: '#6b7280', fontSize: 12 }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 5]}
            tick={{ fill: '#6b7280', fontSize: 10 }}
          />
          <Radar
            name="Current Skills"
            dataKey="current"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.6}
            strokeWidth={2}
          />
          <Radar
            name="Target Skills"
            dataKey="target"
            stroke="#10b981"
            fill="#10b981"
            fillOpacity={0.4}
            strokeWidth={2}
            strokeDasharray="5 5"
          />
          <Legend />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
            formatter={(value, name) => [
              `${value}/5`,
              name === 'current' ? 'Current Level' : 'Target Level',
            ]}
          />
        </RechartsRadarChart>
      </ResponsiveContainer>
      
      {/* Legend */}
      <div className="mt-4 flex flex-wrap justify-center gap-4">
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
          <span className="text-sm text-gray-600">Current Skills</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
          <span className="text-sm text-gray-600">Target Skills</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 border-2 border-dashed border-gray-400 rounded-full mr-2"></div>
          <span className="text-sm text-gray-600">Skill Gap</span>
        </div>
      </div>
    </div>
  )
}

export default SkillRadarChart