'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface TaskFilterProps {
  filter: string
  setFilter: (filter: string) => void
  sortBy: string
  setSortBy: (sortBy: string) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
}

export function TaskFilter({
  filter,
  setFilter,
  sortBy,
  setSortBy,
  searchQuery,
  setSearchQuery
}: TaskFilterProps) {
  const filters = [
    { id: 'all', label: 'All' },
    { id: 'email', label: 'Email' },
    { id: 'whatsapp', label: 'WhatsApp' },
    { id: 'file', label: 'File' },
    { id: 'finance', label: 'Finance' },
  ]

  const sortOptions = [
    { id: 'latest', label: 'Latest' },
    { id: 'priority', label: 'Priority' },
    { id: 'type', label: 'Type' },
  ]

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="flex gap-1">
        {filters.map((option) => (
          <Button
            key={option.id}
            variant={filter === option.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(option.id)}
          >
            {option.label}
          </Button>
        ))}
      </div>

      <div className="flex gap-1">
        {sortOptions.map((option) => (
          <Button
            key={option.id}
            variant={sortBy === option.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortBy(option.id)}
          >
            Sort: {option.label}
          </Button>
        ))}
      </div>

      <div className="flex-1">
        <Input
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-9"
        />
      </div>
    </div>
  )
}