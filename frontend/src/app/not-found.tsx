import Link from 'next/link'
import { FileQuestion } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-6 text-center max-w-md px-4">
        <div className="size-20 rounded-full bg-muted/50 flex items-center justify-center">
          <FileQuestion className="size-10 text-muted" />
        </div>
        <div>
          <h1 className="text-4xl font-bold font-display">404</h1>
          <h2 className="text-xl font-semibold mt-2">Page Not Found</h2>
          <p className="text-muted mt-2">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard">
            <Button>Go to Dashboard</Button>
          </Link>
          <Link href="/">
            <Button variant="outline">Go Home</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
