'use client'

import { DollarSign, TrendingUp, TrendingDown, CreditCard } from 'lucide-react'

interface AccountingKPIRowProps {
  totalIncome: number
  totalExpenses: number
  netRevenue: number
  flaggedCount: number
}

export function AccountingKPIRow({
  totalIncome,
  totalExpenses,
  netRevenue,
  flaggedCount,
}: AccountingKPIRowProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Revenue */}
      <div className="rounded-lg border bg-card p-5">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-lg bg-success/10 flex items-center justify-center">
            <DollarSign className="size-5 text-success" />
          </div>
          <div>
            <p className="text-sm text-muted">Revenue</p>
            <p className="text-xl font-bold text-success">${totalIncome.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Expenses */}
      <div className="rounded-lg border bg-card p-5">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-lg bg-danger/10 flex items-center justify-center">
            <TrendingDown className="size-5 text-danger" />
          </div>
          <div>
            <p className="text-sm text-muted">Expenses</p>
            <p className="text-xl font-bold text-danger">${totalExpenses.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Net */}
      <div className="rounded-lg border bg-card p-5">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <TrendingUp className="size-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted">Net</p>
            <p className="text-xl font-bold text-foreground">${netRevenue.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Flagged */}
      <div className="rounded-lg border bg-card p-5">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-lg bg-warning/10 flex items-center justify-center">
            <CreditCard className="size-5 text-warning" />
          </div>
          <div>
            <p className="text-sm text-muted">Flagged</p>
            <p className="text-xl font-bold text-warning">{flaggedCount}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
