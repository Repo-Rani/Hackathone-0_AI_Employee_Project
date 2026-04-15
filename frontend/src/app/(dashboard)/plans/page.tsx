'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAppStore } from '@/lib/store/useAppStore'
import { mockPlans } from '@/lib/mock-data'
import { PlanCard } from '@/components/plans/PlanCard'
import { EmptyState } from '@/components/shared/EmptyState'

export default function PlansPage() {
  const { initialize } = useAppStore()
  const [plans, setPlans] = useState(mockPlans)
  const [activeTab, setActiveTab] = useState('active')

  useEffect(() => {
    initialize()
  }, [initialize])

  // Filter plans by status
  const activePlans = plans.filter(plan =>
    plan.status === 'in_progress' || plan.status === 'pending_approval'
  )
  const completedPlans = plans.filter(plan => plan.status === 'complete')
  const blockedPlans = plans.filter(plan => plan.status === 'blocked')

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display">Plans</h1>
        <p className="text-sm text-muted">Claude's active work plans</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">
            Active ({activePlans.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completedPlans.length})
          </TabsTrigger>
          <TabsTrigger value="blocked">
            Blocked ({blockedPlans.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-4">
          {activePlans.length === 0 ? (
            <EmptyState page="plans-active" />
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 lg:grid-cols-2 gap-4"
            >
              {activePlans.map((plan, index) => (
                <motion.div key={plan.id} variants={containerVariants}>
                  <PlanCard plan={plan} index={index} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="mt-4">
          {completedPlans.length === 0 ? (
            <EmptyState page="plans-done" />
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 lg:grid-cols-2 gap-4"
            >
              {completedPlans.map((plan, index) => (
                <motion.div key={plan.id} variants={containerVariants}>
                  <PlanCard plan={plan} index={index} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </TabsContent>

        <TabsContent value="blocked" className="mt-4">
          {blockedPlans.length === 0 ? (
            <EmptyState page="plans-done" />
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 lg:grid-cols-2 gap-4"
            >
              {blockedPlans.map((plan, index) => (
                <motion.div key={plan.id} variants={containerVariants}>
                  <PlanCard plan={plan} index={index} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}