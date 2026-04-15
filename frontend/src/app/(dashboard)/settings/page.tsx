'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAppStore } from '@/lib/store/useAppStore'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { toast } from 'sonner'

export default function SettingsPage() {
  const { initialize } = useAppStore()

  const [activeTab, setActiveTab] = useState('handbook')
  const [handbook, setHandbook] = useState('')
  const [goals, setGoals] = useState({
    monthlyRevenueTarget: 15000,
    clientResponseTimeHours: 24,
    invoicePaymentRatePct: 95,
    maxSoftwareCostMonthly: 500,
    subscriptionAuditDays: 30
  })
  const [config, setConfig] = useState({
    gmailCheckInterval: 60,
    whatsappCheckInterval: 30,
    bankCheckInterval: 120,
    autoApproveThreshold: 100,
    ralphMaxIterations: 10,
    approvalWindowHours: 24,
    devMode: false,
    dryRun: false
  })

  useEffect(() => {
    initialize()

    // Load mock data
    setHandbook("# Company Handbook\n\nThis is the default company handbook.\n\n## Rules:\n1. Always maintain professional communication\n2. Follow up on all client requests within 24 hours\n3. Invoice clients monthly\n4. Keep software costs under $500/month")
  }, [initialize])

  const handleSave = () => {
    toast.success('Settings saved successfully')
  }

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
        <h1 className="text-2xl font-bold font-display">Settings</h1>
        <p className="text-sm text-muted">Configure your AI Employee system</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="handbook">Handbook</TabsTrigger>
          <TabsTrigger value="goals">Business Goals</TabsTrigger>
          <TabsTrigger value="system">System Config</TabsTrigger>
        </TabsList>

        <TabsContent value="handbook" className="mt-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="handbook">Company Handbook</Label>
              <Textarea
                id="handbook"
                value={handbook}
                onChange={(e) => setHandbook(e.target.value)}
                className="min-h-[300px] font-mono text-sm"
                placeholder="Enter your company rules and guidelines..."
              />
            </div>
            <div className="text-sm text-muted">
              {handbook.length} characters
            </div>
          </div>
        </TabsContent>

        <TabsContent value="goals" className="mt-4">
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="monthlyRevenueTarget">Monthly Revenue Target ($)</Label>
                <Input
                  id="monthlyRevenueTarget"
                  type="number"
                  value={goals.monthlyRevenueTarget}
                  onChange={(e) => setGoals({...goals, monthlyRevenueTarget: Number(e.target.value)})}
                />
              </div>

              <div>
                <Label htmlFor="clientResponseTimeHours">Client Response Time (hours)</Label>
                <Slider
                  id="clientResponseTimeHours"
                  min={1}
                  max={72}
                  step={1}
                  value={[goals.clientResponseTimeHours]}
                  onValueChange={(value: number[]) => setGoals({...goals, clientResponseTimeHours: value[0]})}
                />
                <div className="text-right text-sm text-muted">
                  {goals.clientResponseTimeHours} hours
                </div>
              </div>

              <div>
                <Label htmlFor="invoicePaymentRatePct">Invoice Payment Rate (%)</Label>
                <Slider
                  id="invoicePaymentRatePct"
                  min={70}
                  max={100}
                  step={1}
                  value={[goals.invoicePaymentRatePct]}
                  onValueChange={(value: number[]) => setGoals({...goals, invoicePaymentRatePct: value[0]})}
                />
                <div className="text-right text-sm text-muted">
                  {goals.invoicePaymentRatePct}% target
                </div>
              </div>

              <div>
                <Label htmlFor="maxSoftwareCostMonthly">Max Software Cost Monthly ($)</Label>
                <Input
                  id="maxSoftwareCostMonthly"
                  type="number"
                  value={goals.maxSoftwareCostMonthly}
                  onChange={(e) => setGoals({...goals, maxSoftwareCostMonthly: Number(e.target.value)})}
                />
              </div>

              <div>
                <Label htmlFor="subscriptionAuditDays">Subscription Audit Days</Label>
                <Slider
                  id="subscriptionAuditDays"
                  min={7}
                  max={90}
                  step={1}
                  value={[goals.subscriptionAuditDays]}
                  onValueChange={(value: number[]) => setGoals({...goals, subscriptionAuditDays: value[0]})}
                />
                <div className="text-right text-sm text-muted">
                  Flag unused subscriptions after {goals.subscriptionAuditDays} days
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="system" className="mt-4">
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="gmailCheckInterval">Gmail Check Interval (seconds)</Label>
                <Select
                  value={config.gmailCheckInterval.toString()}
                  onValueChange={(value) => setConfig({...config, gmailCheckInterval: Number(value)})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 seconds</SelectItem>
                    <SelectItem value="60">60 seconds</SelectItem>
                    <SelectItem value="120">2 minutes</SelectItem>
                    <SelectItem value="300">5 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="whatsappCheckInterval">WhatsApp Check Interval (seconds)</Label>
                <Select
                  value={config.whatsappCheckInterval.toString()}
                  onValueChange={(value) => setConfig({...config, whatsappCheckInterval: Number(value)})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 seconds</SelectItem>
                    <SelectItem value="30">30 seconds</SelectItem>
                    <SelectItem value="60">1 minute</SelectItem>
                    <SelectItem value="120">2 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="autoApproveThreshold">Auto-approve Threshold ($)</Label>
                <Input
                  id="autoApproveThreshold"
                  type="number"
                  value={config.autoApproveThreshold}
                  onChange={(e) => setConfig({...config, autoApproveThreshold: Number(e.target.value)})}
                />
                <div className="text-sm text-muted mt-1">
                  Payments below this amount will auto-approve
                </div>
              </div>

              <div>
                <Label htmlFor="ralphMaxIterations">Ralph Max Iterations</Label>
                <Slider
                  id="ralphMaxIterations"
                  min={5}
                  max={20}
                  step={1}
                  value={[config.ralphMaxIterations]}
                  onValueChange={(value: number[]) => setConfig({...config, ralphMaxIterations: value[0]})}
                />
                <div className="text-right text-sm text-muted">
                  {config.ralphMaxIterations} iterations max
                </div>
              </div>

              <div>
                <Label htmlFor="approvalWindowHours">Approval Window (hours)</Label>
                <Select
                  value={config.approvalWindowHours.toString()}
                  onValueChange={(value) => setConfig({...config, approvalWindowHours: Number(value)})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 hour</SelectItem>
                    <SelectItem value="6">6 hours</SelectItem>
                    <SelectItem value="12">12 hours</SelectItem>
                    <SelectItem value="24">24 hours</SelectItem>
                    <SelectItem value="48">48 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="devMode" className="text-base">Dev Mode</Label>
                  <p className="text-sm text-muted">Disables all real actions</p>
                </div>
                <Switch
                  id="devMode"
                  checked={config.devMode}
                  onCheckedChange={(checked: boolean) => setConfig({...config, devMode: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="dryRun" className="text-base">Dry Run</Label>
                  <p className="text-sm text-muted">Logs but doesn't execute actions</p>
                </div>
                <Switch
                  id="dryRun"
                  checked={config.dryRun}
                  onCheckedChange={(checked: boolean) => setConfig({...config, dryRun: checked})}
                />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="sticky bottom-4 flex justify-end">
        <Button onClick={handleSave}>
          Save Changes
        </Button>
      </div>
    </motion.div>
  )
}