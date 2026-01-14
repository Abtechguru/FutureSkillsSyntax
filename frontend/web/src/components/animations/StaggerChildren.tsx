import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'

interface StaggerChildrenProps {
  children: React.ReactNode
  staggerDelay?: number
  className?: string
  direction?: 'column' | 'row'
}

const StaggerChildren: React.FC<StaggerChildrenProps> = ({
  children,
  staggerDelay = 0.1,
  className,
  direction = 'column',
}) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className={cn(
        {
          'flex flex-col': direction === 'column',
          'flex flex-row': direction === 'row',
        },
        className
      )}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div key={index} variants={item}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  )
}

export default StaggerChildren