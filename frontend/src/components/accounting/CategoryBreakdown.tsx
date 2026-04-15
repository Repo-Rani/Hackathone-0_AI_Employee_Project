'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

interface CategoryBreakdownProps {
  data: { category: string; amount: number }[]
}

export function CategoryBreakdown({ data }: CategoryBreakdownProps) {
  // Sort by amount descending and limit to 8 categories
  const sortedData = [...data]
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 8)

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border rounded-lg p-3 shadow-md">
          <p className="text-sm font-medium">{payload[0].name}</p>
          <p className="text-sm text-danger">
            Amount: <span className="font-semibold">${payload[0].value.toLocaleString()}</span>
          </p>
        </div>
      )
    }
    return null
  }

  const colors = [
    'hsl(var(--primary))',
    'hsl(var(--success))',
    'hsl(var(--warning))',
    'hsl(var(--danger))',
    'hsl(var(--accent-cyan))',
    'hsl(var(--foreground-muted))',
    'hsl(280 70% 50%)',
    'hsl(30 90% 50%)',
  ]

  return (
    <div className="rounded-lg border bg-card p-4 h-60">
      <h3 className="font-semibold font-display mb-2">Expenses by Category</h3>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart
          data={sortedData}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis type="number" stroke="hsl(var(--foreground-muted))" fontSize={12} tickFormatter={(value) => `$${value}`} />
          <YAxis
            type="category"
            dataKey="category"
            stroke="hsl(var(--foreground-muted))"
            fontSize={12}
            width={75}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="amount" radius={[0, 4, 4, 0]}>
            {sortedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
