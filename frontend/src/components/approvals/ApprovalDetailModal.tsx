'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Approval } from '@/lib/types'
import { format } from 'date-fns'
import {
  CreditCard,
  Send,
  Share2,
  Trash2,
  XCircle,
  UserPlus,
  Clock,
  DollarSign,
  Mail,
  Calendar
} from 'lucide-react'

interface ApprovalDetailModalProps {
  approval: Approval | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onApprove: (id: string) => void
  onReject: (id: string, reason?: string) => void
}

export function ApprovalDetailModal({
  approval,
  open,
  onOpenChange,
  onApprove,
  onReject,
}: ApprovalDetailModalProps) {
  if (!approval) return null

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'payment': return <CreditCard className="size-5 text-warning" />
      case 'email_send': return <Send className="size-5 text-primary" />
      case 'social_post': return <Share2 className="size-5 text-cyan" />
      case 'file_delete': return <Trash2 className="size-5 text-danger" />
      case 'subscription_cancel': return <XCircle className="size-5 text-danger" />
      case 'new_contact_email': return <UserPlus className="size-5 text-warning" />
      default: return <Clock className="size-5 text-muted" />
    }
  }

  const isExpired = new Date() > new Date(approval.expiresAt)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-background-2 flex items-center justify-center">
              {getActionIcon(approval.actionType)}
            </div>
            <div>
              <DialogTitle>{approval.title}</DialogTitle>
              <DialogDescription>{approval.description}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Amount */}
          {approval.metadata.amount && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-background-2">
              <DollarSign className="size-5 text-warning" />
              <div>
                <p className="text-sm text-muted">Amount</p>
                <p className="text-lg font-semibold text-warning">
                  ${approval.metadata.amount.toLocaleString()}
                </p>
              </div>
            </div>
          )}

          {/* Recipient */}
          {approval.metadata.recipient && (
            <div className="flex items-center gap-3">
              <UserPlus className="size-4 text-muted" />
              <div>
                <p className="text-sm text-muted">Recipient</p>
                <p className="font-medium">{approval.metadata.recipient}</p>
              </div>
            </div>
          )}

          {/* Email details */}
          {approval.metadata.to && (
            <div className="flex items-center gap-3">
              <Mail className="size-4 text-muted" />
              <div>
                <p className="text-sm text-muted">To</p>
                <p className="font-medium">{approval.metadata.to}</p>
              </div>
            </div>
          )}

          {approval.metadata.subject && (
            <div className="flex items-center gap-3">
              <div className="size-4" />
              <div>
                <p className="text-sm text-muted">Subject</p>
                <p className="font-medium">{approval.metadata.subject}</p>
              </div>
            </div>
          )}

          {/* Subscription details */}
          {approval.metadata.serviceName && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Subscription Details</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted">Service</p>
                  <p className="text-sm">{approval.metadata.serviceName}</p>
                </div>
                {approval.metadata.monthlyCost && (
                  <div>
                    <p className="text-xs text-muted">Monthly Cost</p>
                    <p className="text-sm">${approval.metadata.monthlyCost}</p>
                  </div>
                )}
                {approval.metadata.daysSinceUsed && (
                  <div>
                    <p className="text-xs text-muted">Days Since Used</p>
                    <p className="text-sm">{approval.metadata.daysSinceUsed}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <p className="text-xs text-muted flex items-center gap-1">
                <Calendar className="size-3" /> Created
              </p>
              <p className="text-sm">
                {format(new Date(approval.createdAt), 'MMM dd, yyyy HH:mm')}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted flex items-center gap-1">
                <Clock className="size-3" /> Expires
              </p>
              <p className={cn(
                "text-sm",
                isExpired ? "text-danger" : "text-foreground"
              )}>
                {format(new Date(approval.expiresAt), 'MMM dd, yyyy HH:mm')}
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            className="border-danger text-danger hover:bg-danger/5"
            onClick={() => {
              onReject(approval.id)
              onOpenChange(false)
            }}
            disabled={isExpired}
          >
            Reject
          </Button>
          <Button
            onClick={() => {
              onApprove(approval.id)
              onOpenChange(false)
            }}
            disabled={isExpired}
          >
            Approve
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ')
}
