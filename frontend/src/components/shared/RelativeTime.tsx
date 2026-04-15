'use client'

import { useEffect, useState } from 'react'
import { formatDistanceToNow } from 'date-fns'

interface RelativeTimeProps {
  timestamp: string
  updateInterval?: number
  className?: string
}

export function RelativeTime({
  timestamp,
  updateInterval = 60000,
  className
}: RelativeTimeProps) {
  const [timeAgo, setTimeAgo] = useState('')

  useEffect(() => {
    const updateTime = () => {
      try {
        setTimeAgo(formatDistanceToNow(new Date(timestamp), { addSuffix: true }))
      } catch (error) {
        console.error('Error formatting relative time:', error)
      }
    }

    updateTime()
    const interval = setInterval(updateTime, updateInterval)

    return () => clearInterval(interval)
  }, [timestamp, updateInterval])

  return (
    <span className={className}>
      {timeAgo}
    </span>
  )
}
