'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '@/lib/store/useAppStore'
import { mockBriefings } from '@/lib/mock-data'
import { BriefingSidebar } from '@/components/briefings/BriefingSidebar'
import { BriefingRenderer } from '@/components/briefings/BriefingRenderer'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/shared/EmptyState'
import { Printer, Download, Share2 } from 'lucide-react'
import { Briefing } from '@/lib/types'

export default function BriefingsPage() {
  const { initialize } = useAppStore()
  const [briefings] = useState(mockBriefings)
  const [selectedBriefingId, setSelectedBriefingId] = useState<string | null>(null)
  const [selectedBriefing, setSelectedBriefing] = useState<Briefing | null>(null)

  useEffect(() => {
    initialize()
    if (briefings.length > 0) {
      setSelectedBriefingId(briefings[0].id)
      setSelectedBriefing(briefings[0])
    }
  }, [initialize, briefings])

  useEffect(() => {
    if (selectedBriefingId) {
      const briefing = briefings.find(b => b.id === selectedBriefingId)
      setSelectedBriefing(briefing || null)
    }
  }, [selectedBriefingId, briefings])

  const handlePrint = () => {
    window.print()
  }

  const handleExport = () => {
    if (!selectedBriefing) return

    const element = document.createElement('a')
    const file = new Blob([selectedBriefing.content], { type: 'text/markdown' })
    element.href = URL.createObjectURL(file)
    element.download = `briefing-${selectedBriefing.date}.md`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1 }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold font-display">Briefings</h1>
        <p className="text-sm text-muted">Weekly CEO briefings from AI Employee</p>
      </div>

      {briefings.length === 0 ? (
        <EmptyState page="briefings" />
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-72 flex-shrink-0">
            <BriefingSidebar
              briefings={briefings}
              selectedBriefingId={selectedBriefingId}
              onSelectBriefing={setSelectedBriefingId}
            />
          </div>

          {/* Main content */}
          <div className="flex-1">
            {selectedBriefing ? (
              <div className="bg-card rounded-lg border p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-2xl font-bold font-display">{selectedBriefing.title}</h2>
                    <p className="text-sm text-muted">{selectedBriefing.period}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" onClick={handlePrint}>
                      <Printer className="size-4 mr-2" />
                      Print
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleExport}>
                      <Download className="size-4 mr-2" />
                      Export
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="size-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>

                {/* KPI Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  <div className="bg-background-2 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-success">
                      ${selectedBriefing.kpi.revenueThisWeek.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted">Revenue This Week</div>
                  </div>
                  <div className="bg-background-2 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-primary">
                      {selectedBriefing.kpi.tasksCompleted}
                    </div>
                    <div className="text-xs text-muted">Tasks Completed</div>
                  </div>
                  <div className="bg-background-2 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-danger">
                      {selectedBriefing.kpi.bottlenecksCount}
                    </div>
                    <div className="text-xs text-muted">Bottlenecks</div>
                  </div>
                  <div className="bg-background-2 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-warning">
                      {selectedBriefing.kpi.suggestionsCount}
                    </div>
                    <div className="text-xs text-muted">Suggestions</div>
                  </div>
                </div>

                {/* Content */}
                <div className="prose prose-invert max-w-none">
                  <BriefingRenderer content={selectedBriefing.content} />
                </div>
              </div>
            ) : (
              <div className="bg-card rounded-lg border p-8 text-center">
                <h3 className="text-lg font-medium mb-2">No Briefing Selected</h3>
                <p className="text-muted">Select a briefing from the sidebar to view its content</p>
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  )
}