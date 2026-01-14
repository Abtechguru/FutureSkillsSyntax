import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'

interface FadeInProps {
  children: React.ReactNode
  delay?: number
  duration?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  distance?: number
  className?: string
  once?: boolean
}

const FadeIn: React.FC<FadeInProps> = ({
  children,
  delay = 0,
  duration = 0.5,
  direction = 'up',
  distance = 20,
  className,
  once = true,
}) => {
  const directions = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
    none: { x: 0, y: 0 },
  }

  const initial = {
    opacity: 0,
    ...directions[direction],
  }

  const animate = {
    opacity: 1,
    x: 0,
    y: 0,
  }

  return (
    <motion.div
      initial={initial}
      animate={animate}
      transition={{
        duration,
        delay,
        ease: 'easeOut',
      }}
      viewport={{ once }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}

export default FadeIn