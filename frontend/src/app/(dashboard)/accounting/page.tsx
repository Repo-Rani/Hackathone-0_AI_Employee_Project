'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '@/lib/store/useAppStore'
import { mockTransactions } from '@/lib/mock-data'
import { TransactionTable } from '@/components/accounting/TransactionTable'
import { RevenueChart } from '@/components/accounting/RevenueChart'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { EmptyState } from '@/components/shared/EmptyState'
import { DollarSign, TrendingUp, TrendingDown, CreditCard } from 'lucide-react'

export default function AccountingPage() {
  const { initialize } = useAppStore()
  const [transactions, setTransactions] = useState(mockTransactions)
  const [period, setPeriod] = useState('this_month')

  useEffect(() => {
    initialize()
  }, [initialize])

  // Calculate accounting summary
  const totalIncome = transactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = transactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0)

  const netRevenue = totalIncome - totalExpenses
  const flaggedCount = transactions.filter(t => t.flagged).length

  // Prepare chart data (last 30 days of income)
  const incomeData = transactions
    .filter(t => t.amount > 0)
    .slice(0, 30)
    .map(t => ({
      date: t.date,
      amount: t.amount
    }))

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold font-display">Accounting</h1>
        <p className="text-sm text-muted">Financial overview and transaction history</p>
      </div>

      {/* Period selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="this_month">This Month</SelectItem>
            <SelectItem value="last_month">Last Month</SelectItem>
            <SelectItem value="last_3_months">Last 3 Months</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" size="sm">
          Export CSV
        </Button>
      </div>

      {/* KPI Row */}
      <motion.div variants={containerVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
      </motion.div>

      {/* Revenue Chart */}
      <motion.div variants={containerVariants}>
        <RevenueChart data={incomeData} />
      </motion.div>

      {/* Transaction Table */}
      <motion.div variants={containerVariants}>
        {transactions.length === 0 ? (
          <EmptyState page="logs" />
        ) : (
          <TransactionTable transactions={transactions} />
        )}
      </motion.div>
    </motion.div>
  )
}