'use client'

import { motion } from 'framer-motion'
import { Approval, ApprovalActionType } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { useApprovalTimer } from '@/hooks/useApprovalTimer'
import {
  CreditCard,
  Send,
  Share2,
  Trash2,
  XCircle,
  UserPlus,
  Clock,
  Check,
  X
} from 'lucide-react'
import { format, formatDistanceToNow } from 'date-fns'
import { cn } from '@/lib/utils'

interface ApprovalCardProps {
  approval: Approval
  onApprove: (id: string) => void
  onReject: (id: string, reason?: string) => void
  isDragging?: boolean
  index: number
}

export function ApprovalCard({
  approval,
  onApprove,
  onReject,
  isDragging = false,
  index
}: ApprovalCardProps) {
  const timeLeft = useApprovalTimer(approval.expiresAt)

  const getActionIcon = (actionType: ApprovalActionType) => {
    switch (actionType) {
      case 'payment':
        return <CreditCard className="size-5 text-warning" />
      case 'email_send':
        return <Send className="size-5 text-primary" />
      case 'social_post':
        return <Share2 className="size-5 text-cyan" />
      case 'file_delete':
        return <Trash2 className="size-5 text-danger" />
      case 'subscription_cancel':
        return <XCircle className="size-5 text-danger" />
      case 'new_contact_email':
        return <UserPlus className="size-5 text-warning" />
      default:
        return <Clock className="size-5 text-muted" />
    }
  }

  const getActionLabel = (actionType: ApprovalActionType) => {
    switch (actionType) {
      case 'payment':
        return 'Payment Request'
      case 'email_send':
        return 'Email Send'
      case 'social_post':
        return 'Social Post'
      case 'file_delete':
        return 'File Deletion'
      case 'subscription_cancel':
        return 'Cancel Subscription'
      case 'new_contact_email':
        return 'New Contact Email'
      default:
        return 'Approval Request'
    }
  }

  const getActionColor = (actionType: ApprovalActionType) => {
    switch (actionType) {
      case 'payment':
        return 'text-warning'
      case 'email_send':
        return 'text-primary'
      case 'social_post':
        return 'text-cyan'
      case 'file_delete':
        return 'text-danger'
      case 'subscription_cancel':
        return 'text-danger'
      case 'new_contact_email':
        return 'text-warning'
      default:
        return 'text-muted'
    }
  }

  const getTimeLeftColor = () => {
    if (approval.status === 'expired') return 'text-danger'
    if (timeLeft.milliseconds < 7200000) return 'text-danger' // 2 hours
    if (timeLeft.milliseconds < 21600000) return 'text-warning' // 6 hours
    return 'text-muted'
  }

  const isExpired = approval.status === 'expired' || new Date() > new Date(approval.expiresAt)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: 1,
        y: 0,
        ...(isDragging ? { scale: 1.03, rotate: 1.5 } : { scale: 1, rotate: 0 })
      }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={!isExpired ? { y: -2 } : {}}
      className={cn(
        "rounded-lg border bg-card p-5 flex flex-col",
        isExpired ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-md transition-shadow',
        approval.actionType === 'payment' ? 'border-warning/30' :
        approval.actionType === 'email_send' ? 'border-primary/30' :
        approval.actionType === 'social_post' ? 'border-cyan/30' :
        approval.actionType === 'file_delete' ? 'border-danger/30' :
        approval.actionType === 'subscription_cancel' ? 'border-danger/30' :
        approval.actionType === 'new_contact_email' ? 'border-warning/30' : 'border-border'
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-full bg-background-2 flex items-center justify-center">
            {getActionIcon(approval.actionType)}
          </div>
          <div>
            <h3 className={cn("font-semibold", getActionColor(approval.actionType))}>
              {getActionLabel(approval.actionType)}
            </h3>
            <p className="text-xs text-muted">Expires in {timeLeft.label}</p>
          </div>
        </div>

        <div className={cn("text-right text-sm font-mono", getTimeLeftColor())}>
          <div className="text-xs text-muted">Expires</div>
          <div>{format(new Date(approval.expiresAt), 'MMM dd, HH:mm')}</div>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div>
          <p className="text-sm text-muted">Title</p>
          <p className="font-medium">{approval.title}</p>
        </div>

        {approval.metadata.amount && (
          <div>
            <p className="text-sm text-muted">Amount</p>
            <p className="font-semibold text-warning text-lg">${approval.metadata.amount.toLocaleString()}</p>
          </div>
        )}

        {approval.metadata.recipient && (
          <div>
            <p className="text-sm text-muted">Recipient</p>
            <p>{approval.metadata.recipient}</p>
          </div>
        )}

        {approval.metadata.subject && (
          <div>
            <p className="text-sm text-muted">Subject</p>
            <p>{approval.metadata.subject}</p>
          </div>
        )}

        <div>
          <p className="text-sm text-muted">Created</p>
          <p className="text-sm">{format(new Date(approval.createdAt), 'MMM dd, yyyy HH:mm')}</p>
        </div>
      </div>

      <div className="mb-3">
        <p className="text-sm text-muted mb-1">Description</p>
        <p className="text-sm line-clamp-2">{approval.description}</p>
      </div>

      {!isExpired ? (
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1 border-danger text-danger hover:bg-danger/5"
            onClick={() => onReject(approval.id)}
          >
            <X className="size-4 mr-2" />
            Reject
          </Button>
          <Button
            className="flex-1"
            onClick={() => onApprove(approval.id)}
          >
            <Check className="size-4 mr-2" />
            Approve
          </Button>
        </div>
      ) : (
        <div className="text-center py-2 bg-danger/10 rounded-lg">
          <p className="text-danger text-sm">This approval has expired</p>
        </div>
      )}
    </motion.div>
  )
}