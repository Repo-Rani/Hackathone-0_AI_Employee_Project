'use client'

import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function PlansError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 text-center">
      <div className="size-16 rounded-full bg-danger/10 flex items-center justify-center">
        <AlertTriangle className="size-8 text-danger" />
      </div>
      <div>
        <h2 className="text-xl font-bold font-display">Plans Error</h2>
        <p className="text-muted text-sm mt-1">{error.message}</p>
      </div>
      <Button onClick={reset}>Try Again</Button>
    </div>
  )
}
