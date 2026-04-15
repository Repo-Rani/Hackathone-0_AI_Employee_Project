'use client'

import { LogEntry } from '@/lib/types'
import { formatTimeAgo } from '@/lib/utils'
import {
  Mail,
  CreditCard,
  Share2,
  FileText,
  AlertTriangle,
  Activity,
  User,
  Bot
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface RecentActivityFeedProps {
  logs: LogEntry[]
}

export function RecentActivityFeed({ logs }: RecentActivityFeedProps) {
  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'email_send':
      case 'email_draft':
        return <Mail className="size-4 text-primary" />
      case 'payment_execute':
      case 'payment_draft':
        return <CreditCard className="size-4 text-warning" />
      case 'social_post':
      case 'social_draft':
        return <Share2 className="size-4 text-cyan" />
      case 'file_move':
      case 'file_create':
      case 'file_delete':
        return <FileText className="size-4 text-muted" />
      case 'watcher_trigger':
        return <Activity className="size-4 text-success" />
      case 'claude_error':
        return <AlertTriangle className="size-4 text-danger" />
      default:
        return <Activity className="size-4 text-muted" />
    }
  }

  const getActorIcon = (actor: string) => {
    switch (actor) {
      case 'claude_code':
        return <Bot className="size-4 text-cyan" />
      case 'human':
        return <User className="size-4 text-primary" />
      default:
        return <Activity className="size-4 text-muted" />
    }
  }

  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold font-display">Recent Activity</h3>
        <a href="/logs" className="text-xs text-primary hover:underline">
          View all logs →
        </a>
      </div>

      <div className="space-y-4">
        {logs.slice(0, 8).map((log) => (
          <div key={log.id} className="flex items-start gap-3">
            <div className="size-8 rounded-full bg-background-2 flex items-center justify-center flex-shrink-0">
              {getActionIcon(log.actionType)}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground truncate">
                {log.actionType.replace('_', ' ')}
              </p>
              <p className="text-xs text-muted truncate">
                {log.target || 'Action completed'}
              </p>

              <div className="flex items-center gap-2 mt-1">
                <div className="size-4 rounded-full bg-background-2 flex items-center justify-center">
                  {getActorIcon(log.actor)}
                </div>
                <span className="text-xs text-muted">
                  {formatTimeAgo(log.timestamp)}
                </span>

                <span className={cn(
                  "text-xs px-2 py-0.5 rounded-full",
                  log.result === 'success' ? 'bg-success/10 text-success' :
                  log.result === 'failure' ? 'bg-danger/10 text-danger' :
                  log.result === 'pending' ? 'bg-warning/10 text-warning' :
                  'bg-muted/20 text-muted'
                )}>
                  {log.result}
                </span>
              </div>
            </div>
          </div>
        ))}

        {logs.length === 0 && (
          <div className="text-center py-4">
            <p className="text-sm text-muted">No recent activity</p>
          </div>
        )}
      </div>
    </div>
  )
}