'use client'

import { Approval } from '@/lib/types'
import { format } from 'date-fns'
import {
  CreditCard,
  Send,
  Share2,
  Trash2,
  XCircle,
  UserPlus,
  CheckCircle2,
  XCircle as XCircleIcon
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface ApprovalHistoryProps {
  decisions: Approval[]
}

export function ApprovalHistory({ decisions }: ApprovalHistoryProps) {
  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'payment': return <CreditCard className="size-4" />
      case 'email_send': return <Send className="size-4" />
      case 'social_post': return <Share2 className="size-4" />
      case 'file_delete': return <Trash2 className="size-4" />
      case 'subscription_cancel': return <XCircle className="size-4" />
      case 'new_contact_email': return <UserPlus className="size-4" />
      default: return <CheckCircle2 className="size-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-success bg-success/10'
      case 'rejected': return 'text-danger bg-danger/10'
      case 'expired': return 'text-muted bg-muted/20'
      default: return 'text-muted bg-muted/20'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle2 className="size-3" />
      case 'rejected': return <XCircleIcon className="size-3" />
      default: return <CheckCircle2 className="size-3" />
    }
  }

  if (decisions.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-6 text-center text-muted">
        <p>No recent decisions</p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border bg-card">
      <div className="p-4 border-b">
        <h3 className="font-semibold font-display">Recently Decided</h3>
      </div>
      <div className="divide-y">
        {decisions.slice(0, 5).map((approval) => (
          <div
            key={approval.id}
            className="flex items-center justify-between p-4 hover:bg-background-2/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                "size-8 rounded-full flex items-center justify-center",
                getStatusColor(approval.status)
              )}>
                {getActionIcon(approval.actionType)}
              </div>
              <div>
                <p className="text-sm font-medium">{approval.title}</p>
                <p className="text-xs text-muted">
                  {format(new Date(approval.decidedAt || approval.expiresAt), 'MMM dd, HH:mm')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={cn(
                "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                getStatusColor(approval.status)
              )}>
                {getStatusIcon(approval.status)}
                {approval.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
