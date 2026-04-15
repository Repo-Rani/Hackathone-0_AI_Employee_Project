'use client'

import { useState, useEffect } from 'react'

interface TimeLeft {
  label: string
  milliseconds: number
  hours: number
  minutes: number
  seconds: number
}

export function ApprovalTimer({ expiresAt, onExpire }: { expiresAt: string; onExpire?: () => void }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    label: '',
    milliseconds: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date()
      const expiry = new Date(expiresAt)
      const diff = expiry.getTime() - now.getTime()

      if (diff <= 0) {
        setTimeLeft({ label: 'Expired', milliseconds: 0, hours: 0, minutes: 0, seconds: 0 })
        onExpire?.()
        return
      }

      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      let label = ''
      if (hours > 0) {
        label = `${hours}h ${minutes}m ${seconds}s`
      } else if (minutes > 0) {
        label = `${minutes}m ${seconds}s`
      } else {
        label = `${seconds}s`
      }

      setTimeLeft({ label, milliseconds: diff, hours, minutes, seconds })
    }

    updateTimer()
    const timerId = setInterval(updateTimer, 1000)

    return () => clearInterval(timerId)
  }, [expiresAt, onExpire])

  return (
    <span className="font-mono text-sm">
      {timeLeft.label}
    </span>
  )
}
