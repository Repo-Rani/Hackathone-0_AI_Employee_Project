'use client'

import { motion } from 'framer-motion'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { format } from 'date-fns'
import { TrendingUp } from 'lucide-react'

interface RevenueData {
  date: string
  amount: number
}

interface RevenueAreaChartProps {
  data: RevenueData[]
}

export function RevenueAreaChart({ data }: RevenueAreaChartProps) {
  // Format the date for display on x-axis
  const formattedData = data.map(item => ({
    ...item,
    formattedDate: format(new Date(item.date), 'MMM dd')
  }))

  // Calculate total and average
  const total = data.reduce((sum, item) => sum + item.amount, 0)
  const average = total / data.length

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card border border-primary/20 rounded-xl p-3 shadow-lg shadow-primary/10"
        >
          <p className="text-sm font-medium text-muted mb-1">{label}</p>
          <p className="text-base font-bold text-primary">
            ${payload[0].value.toLocaleString()}
          </p>
        </motion.div>
      )
    }
    return null
  }

  return (
    <motion.div
      className="rounded-xl border bg-card p-5"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <motion.div
            className="p-2 rounded-lg bg-primary/10"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          >
            <TrendingUp className="w-5 h-5 text-primary" />
          </motion.div>
          <div>
            <h3 className="font-semibold font-display text-lg">Revenue Trend</h3>
            <p className="text-xs text-muted">Last 7 Days Performance</p>
          </div>
        </div>
        
        <motion.div
          className="text-right"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-xs text-muted">Total</p>
          <p className="text-xl font-bold font-display bg-gradient-to-r from-primary to-cyan bg-clip-text text-transparent">
            ${total.toLocaleString()}
          </p>
        </motion.div>
      </div>
      
      <div className="h-60">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={formattedData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="colorCyan" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--accent-cyan))" stopOpacity={0.6}/>
                <stop offset="95%" stopColor="hsl(var(--accent-cyan))" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
            <XAxis
              dataKey="formattedDate"
              stroke="hsl(var(--foreground-muted))"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="hsl(var(--foreground-muted))"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="amount"
              stroke="hsl(var(--primary))"
              fillOpacity={1}
              fill="url(#colorRevenue)"
              strokeWidth={3}
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}