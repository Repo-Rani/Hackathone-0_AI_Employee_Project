'use client'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'

interface BusinessGoals {
  monthlyRevenueTarget: number
  clientResponseTimeHours: number
  invoicePaymentRatePct: number
  maxSoftwareCostMonthly: number
  subscriptionAuditDays: number
}

interface GoalsEditorProps {
  goals: BusinessGoals
  onChange: (goals: BusinessGoals) => void
}

export function GoalsEditor({ goals, onChange }: GoalsEditorProps) {
  const handleChange = (key: keyof BusinessGoals, value: number) => {
    onChange({ ...goals, [key]: value })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="monthlyRevenueTarget">Monthly Revenue Target ($)</Label>
          <Input
            id="monthlyRevenueTarget"
            type="number"
            value={goals.monthlyRevenueTarget}
            onChange={(e) => handleChange('monthlyRevenueTarget', Number(e.target.value))}
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
            onValueChange={(value: number[]) => handleChange('clientResponseTimeHours', value[0])}
          />
          <div className="text-right text-sm text-muted mt-1">
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
            onValueChange={(value: number[]) => handleChange('invoicePaymentRatePct', value[0])}
          />
          <div className="text-right text-sm text-muted mt-1">
            {goals.invoicePaymentRatePct}% target
          </div>
        </div>

        <div>
          <Label htmlFor="maxSoftwareCostMonthly">Max Software Cost Monthly ($)</Label>
          <Input
            id="maxSoftwareCostMonthly"
            type="number"
            value={goals.maxSoftwareCostMonthly}
            onChange={(e) => handleChange('maxSoftwareCostMonthly', Number(e.target.value))}
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
            onValueChange={(value: number[]) => handleChange('subscriptionAuditDays', value[0])}
          />
          <div className="text-right text-sm text-muted mt-1">
            Flag unused subscriptions after {goals.subscriptionAuditDays} days
          </div>
        </div>
      </div>
    </div>
  )
}
