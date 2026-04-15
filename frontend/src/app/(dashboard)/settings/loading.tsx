'use client'

import { Skeleton } from '@/components/ui/skeleton'

export default function SettingsLoading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-4 w-56 mt-2" />
      </div>

      {/* Tabs */}
      <Skeleton className="h-10 w-full" />

      {/* Tab Content */}
      <div className="space-y-6">
        {/* Handbook tab skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-[400px] w-full" />
          <div className="flex justify-between">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-9 w-32" />
          </div>
        </div>

        {/* Goals tab skeleton */}
        <div className="space-y-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-9 w-full" />
              {i % 2 === 0 && <Skeleton className="h-3 w-32 ml-auto" />}
            </div>
          ))}
        </div>

        {/* System config tab skeleton */}
        <div className="space-y-6">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-9 w-full" />
              {i < 5 && <Skeleton className="h-3 w-48" />}
            </div>
          ))}
        </div>
      </div>

      {/* Save button */}
      <div className="flex justify-end">
        <Skeleton className="h-9 w-24" />
      </div>
    </div>
  )
}
