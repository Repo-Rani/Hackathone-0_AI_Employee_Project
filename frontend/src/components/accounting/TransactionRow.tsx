'use client'

import { Transaction, TransactionType } from '@/lib/types'
import { format } from 'date-fns'
import { AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface TransactionRowProps {
  transaction: Transaction
}

export function TransactionRow({ transaction }: TransactionRowProps) {
  const [expanded, setExpanded] = useState(false)

  const typeColors = {
    income: 'text-success bg-success/10',
    expense: 'text-danger bg-danger/10',
    subscription: 'text-warning bg-warning/10',
    refund: 'text-cyan bg-cyan/10',
    transfer: 'text-muted bg-muted/20',
  }

  return (
    <>
      <tr
        className={cn(
          "border-b transition-colors hover:bg-background-2/50 cursor-pointer",
          transaction.flagged && "bg-danger/5"
        )}
        onClick={() => setExpanded(!expanded)}
      >
        <td className="p-4 font-mono text-sm">
          {format(new Date(transaction.date), 'MMM dd, yyyy')}
        </td>
        <td className="p-4">
          <div>
            <p className="font-medium">{transaction.description}</p>
            {transaction.merchant && (
              <p className="text-sm text-muted">{transaction.merchant}</p>
            )}
          </div>
        </td>
        <td className="p-4">
          <span className="px-2 py-1 text-xs rounded-full bg-background-2">
            {transaction.category}
          </span>
        </td>
        <td className="p-4">
          <span className={cn(
            "px-2 py-1 text-xs rounded-full",
            typeColors[transaction.type]
          )}>
            {transaction.type.toUpperCase()}
          </span>
        </td>
        <td className={cn(
          "p-4 font-semibold",
          transaction.amount > 0 ? "text-success" : "text-danger"
        )}>
          {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toLocaleString()}
        </td>
        <td className="p-4">
          {transaction.flagged ? (
            <div className="flex items-center gap-1 text-danger">
              <AlertTriangle className="size-4" />
              <span className="text-xs">Flagged</span>
            </div>
          ) : (
            <span className="text-muted">-</span>
          )}
        </td>
        <td className="p-4">
          <div className="flex items-center justify-center">
            {expanded ? (
              <ChevronUp className="size-4 text-muted" />
            ) : (
              <ChevronDown className="size-4 text-muted" />
            )}
          </div>
        </td>
      </tr>

      {expanded && (
        <tr>
          <td colSpan={7} className="p-4 bg-background-2">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted">Transaction ID</p>
                <p className="font-mono">{transaction.id}</p>
              </div>
              <div>
                <p className="text-muted">Date</p>
                <p>{format(new Date(transaction.date), 'MMMM dd, yyyy')}</p>
              </div>
              {transaction.flagReason && (
                <div className="col-span-2">
                  <p className="text-muted">Flag Reason</p>
                  <p className="text-danger">{transaction.flagReason}</p>
                </div>
              )}
              {transaction.reviewAction && (
                <div className="col-span-2">
                  <p className="text-muted">Review Action</p>
                  <p className="font-medium">{transaction.reviewAction}</p>
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  )
}
