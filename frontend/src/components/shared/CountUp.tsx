'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface CountUpProps {
  value: number
  format?: 'number' | 'currency' | 'percentage'
  duration?: number
  className?: string
  prefix?: string
  suffix?: string
}

export function CountUp({
  value,
  format = 'number',
  duration = 1200,
  className,
  prefix = '',
  suffix = ''
}: CountUpProps) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    let startTime: number | null = null
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = timestamp - startTime
      const percentage = Math.min(progress / duration, 1)

      // Easing function (easeOutQuart)
      const eased = 1 - Math.pow(1 - percentage, 4)
      const currentValue = Math.floor(value * eased)

      setDisplayValue(currentValue)

      if (progress < duration) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame)
    }
  }, [value, duration])

  const formattedValue =
    format === 'currency'
      ? `$${displayValue.toLocaleString()}`
      : format === 'percentage'
      ? `${displayValue}%`
      : displayValue.toLocaleString()

  return (
    <span className={cn("font-semibold", className)}>
      {prefix}{formattedValue}{suffix}
    </span>
  )
}
