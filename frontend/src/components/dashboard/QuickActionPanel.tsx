'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Mail,
  FileText,
  BarChart3,
  Pause,
  Play,
  Loader2
} from 'lucide-react'
import { toast } from 'sonner'

export function QuickActionPanel() {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({})

  const handleAction = async (action: string, title: string) => {
    setLoadingStates(prev => ({ ...prev, [action]: true }))

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    setLoadingStates(prev => ({ ...prev, [action]: false }))

    toast.success(`${title} successfully triggered`, {
      description: `${title} has been sent to the AI Employee for processing`
    })
  }

  return (
    <div className="rounded-lg border bg-card p-6">
      <h3 className="font-semibold font-display mb-4">Quick Actions</h3>

      <div className="space-y-3">
        <Button
          className="w-full justify-start"
          variant="outline"
          onClick={() => handleAction('gmail', 'Gmail check')}
          disabled={loadingStates.gmail}
        >
          {loadingStates.gmail ? (
            <>
              <Loader2 className="size-4 mr-2 animate-spin" />
              Checking...
            </>
          ) : (
            <>
              <Mail className="size-4 mr-2" />
              Check Gmail Now
            </>
          )}
        </Button>

        <Button
          className="w-full justify-start"
          variant="outline"
          onClick={() => handleAction('audit', 'Business audit')}
          disabled={loadingStates.audit}
        >
          {loadingStates.audit ? (
            <>
              <Loader2 className="size-4 mr-2 animate-spin" />
              Triggering...
            </>
          ) : (
            <>
              <BarChart3 className="size-4 mr-2" />
              Run Business Audit
            </>
          )}
        </Button>

        <Button
          className="w-full justify-start"
          variant="outline"
          onClick={() => handleAction('briefing', 'Briefing generation')}
          disabled={loadingStates.briefing}
        >
          {loadingStates.briefing ? (
            <>
              <Loader2 className="size-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <FileText className="size-4 mr-2" />
              Generate Briefing
            </>
          )}
        </Button>

        <Button
          className="w-full justify-start"
          variant="outline"
          onClick={() => handleAction('pause', 'Pause watchers')}
          disabled={loadingStates.pause}
        >
          {loadingStates.pause ? (
            <>
              <Loader2 className="size-4 mr-2 animate-spin" />
              Pausing...
            </>
          ) : (
            <>
              <Pause className="size-4 mr-2" />
              Pause All Watchers
            </>
          )}
        </Button>
      </div>
    </div>
  )
}