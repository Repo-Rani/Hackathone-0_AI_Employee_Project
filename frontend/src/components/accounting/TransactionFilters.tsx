'use client'

import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TransactionType } from '@/lib/types'

interface TransactionFiltersProps {
  filter: TransactionType | 'all'
  onFilterChange: (filter: TransactionType | 'all') => void
  searchQuery: string
  onSearchChange: (query: string) => void
}

export function TransactionFilters({
  filter,
  onFilterChange,
  searchQuery,
  onSearchChange,
}: TransactionFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <Tabs value={filter} onValueChange={(v) => onFilterChange(v as TransactionType | 'all')}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="income">Income</TabsTrigger>
          <TabsTrigger value="expense">Expenses</TabsTrigger>
          <TabsTrigger value="subscription">Subscriptions</TabsTrigger>
          <TabsTrigger value="flagged">Flagged</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex-1">
        <Input
          placeholder="Search transactions..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="max-w-sm"
        />
      </div>
    </div>
  )
}
