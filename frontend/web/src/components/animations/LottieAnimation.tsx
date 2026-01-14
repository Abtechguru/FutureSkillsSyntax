import React from 'react'
import Lottie from 'lottie-react'
import type { LottieComponentProps } from 'lottie-react'
import { cn } from '@/utils/cn'

interface LottieAnimationProps extends Omit<LottieComponentProps, 'animationData'> {
  animation: any // Lottie JSON data
  className?: string
  loop?: boolean
  autoplay?: boolean
  speed?: number
}

const LottieAnimation: React.FC<LottieAnimationProps> = ({
  animation,
  className,
  loop = true,
  autoplay = true,
  ...props
}) => {
  return (
    <div className={cn('flex items-center justify-center', className)}>
      <Lottie
        animationData={animation}
        loop={loop}
        autoplay={autoplay}
        {...props}
      />
    </div>
  )
}

export default LottieAnimation