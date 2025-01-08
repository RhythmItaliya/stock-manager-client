import * as React from 'react'
import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  size?: 'mini' | 'small' | 'large'
  color?: string
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'small',
  color = 'border-blue-600',
}) => {
  const sizeClasses =
    size === 'large' ? 'w-16 h-16' : size === 'mini' ? 'w-4 h-4' : 'w-8 h-8'
  return (
    <div
      className={cn(
        `border-t-2 border-b-2 ${color} rounded-full animate-spin ${sizeClasses}`,
        'border-t-transparent'
      )}
    />
  )
}

export default LoadingSpinner
