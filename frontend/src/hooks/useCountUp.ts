import { useEffect, useState } from 'react'

interface UseCountUpOptions {
  duration?: number
  easing?: 'linear' | 'easeOut' | 'easeInOut'
}

export function useCountUp(
  target: number,
  options: UseCountUpOptions = {}
): number {
  const { duration = 1200, easing = 'easeOut' } = options
  const [value, setValue] = useState(0)

  useEffect(() => {
    let startTime: number | null = null
    let animationFrame: number

    const easeFunctions = {
      linear: (t: number) => t,
      easeOut: (t: number) => 1 - Math.pow(1 - t, 4),
      easeInOut: (t: number) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2,
    }

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = timestamp - startTime
      const percentage = Math.min(progress / duration, 1)
      const eased = easeFunctions[easing](percentage)
      const currentValue = Math.floor(target * eased)

      setValue(currentValue)

      if (progress < duration) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame)
    }
  }, [target, duration, easing])

  return value
}
