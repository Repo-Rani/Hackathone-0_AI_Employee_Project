'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  page: 'inbox' | 'approvals' | 'plans-active' | 'plans-done' | 'briefings' | 'logs' | 'logs-filtered'
  onAction?: () => void
  actionLabel?: string
}

export function EmptyState({ page, onAction, actionLabel }: EmptyStateProps) {
  let icon = '📝'
  let title = ''
  let description = ''

  switch (page) {
    case 'inbox':
      icon = '🎉'
      title = 'All Clear!'
      description = 'Your AI Employee is staying on top of things.'
      break
    case 'approvals':
      icon = '✅'
      title = 'No Pending Approvals'
      description = 'The AI is running within approved boundaries.'
      break
    case 'plans-active':
      icon = '📋'
      title = 'No Active Plans'
      description = 'Drop files in /Needs_Action to get Claude working.'
      break
    case 'plans-done':
      icon = '🏆'
      title = 'No Completed Plans Yet'
      description = 'Plans move here when Claude finishes them.'
      break
    case 'briefings':
      icon = '📊'
      title = 'No Briefings Yet'
      description = 'Briefings are generated every Monday morning.'
      break
    case 'logs':
      icon = '📝'
      title = 'No Log Entries'
      description = 'Actions will appear here once the system is running.'
      break
    case 'logs-filtered':
      icon = '🔍'
      title = 'No Results'
      description = 'Try adjusting your filters.'
      break
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold font-display mb-2">{title}</h3>
      <p className="text-muted mb-6">{description}</p>
      {onAction && actionLabel && (
        <Button onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  )
}