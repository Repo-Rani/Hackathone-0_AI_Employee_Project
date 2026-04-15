'use client'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'

interface SystemConfig {
  gmailCheckInterval: number
  whatsappCheckInterval: number
  bankCheckInterval: number
  autoApproveThreshold: number
  ralphMaxIterations: number
  approvalWindowHours: number
  devMode: boolean
  dryRun: boolean
}

interface SystemConfigProps {
  config: SystemConfig
  onChange: (config: SystemConfig) => void
}

export function SystemConfig({ config, onChange }: SystemConfigProps) {
  const handleChange = (key: keyof SystemConfig, value: number | boolean) => {
    onChange({ ...config, [key]: value })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="gmailCheckInterval">Gmail Check Interval (seconds)</Label>
          <Select
            value={config.gmailCheckInterval.toString()}
            onValueChange={(value) => handleChange('gmailCheckInterval', Number(value))}
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
            onValueChange={(value) => handleChange('whatsappCheckInterval', Number(value))}
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
            onChange={(e) => handleChange('autoApproveThreshold', Number(e.target.value))}
          />
          <p className="text-sm text-muted mt-1">
            Payments below this amount will auto-approve
          </p>
        </div>

        <div>
          <Label htmlFor="ralphMaxIterations">Ralph Max Iterations</Label>
          <Slider
            id="ralphMaxIterations"
            min={5}
            max={20}
            step={1}
            value={[config.ralphMaxIterations]}
            onValueChange={(value: number[]) => handleChange('ralphMaxIterations', value[0])}
          />
          <div className="text-right text-sm text-muted mt-1">
            {config.ralphMaxIterations} iterations max
          </div>
        </div>

        <div>
          <Label htmlFor="approvalWindowHours">Approval Window (hours)</Label>
          <Select
            value={config.approvalWindowHours.toString()}
            onValueChange={(value) => handleChange('approvalWindowHours', Number(value))}
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
            onCheckedChange={(checked: boolean) => handleChange('devMode', checked)}
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
            onCheckedChange={(checked: boolean) => handleChange('dryRun', checked)}
          />
        </div>
      </div>
    </div>
  )
}
