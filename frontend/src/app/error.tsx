'use client'

import { useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Global error:', error)
  }, [error])

  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="flex flex-col items-center gap-6 text-center max-w-md px-4">
            <div className="size-20 rounded-full bg-danger/10 flex items-center justify-center">
              <AlertTriangle className="size-10 text-danger" />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-display">Something Went Wrong</h1>
              <p className="text-muted mt-2">{error.message}</p>
            </div>
            <div className="flex gap-3">
              <Button onClick={reset}>Try Again</Button>
              <Button variant="outline" onClick={() => window.location.reload()}>
                Reload Page
              </Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
