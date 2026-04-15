'use client'

import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

interface HandbookEditorProps {
  value: string
  onChange: (value: string) => void
  onReset?: () => void
}

export function HandbookEditor({ value, onChange, onReset }: HandbookEditorProps) {
  const [localValue, setLocalValue] = useState(value)

  const handleChange = (newValue: string) => {
    setLocalValue(newValue)
    onChange(newValue)
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="handbook">Company Handbook</Label>
        <Textarea
          id="handbook"
          value={localValue}
          onChange={(e) => handleChange(e.target.value)}
          className="min-h-[400px] font-mono text-sm"
          placeholder="Enter your company rules and guidelines..."
        />
      </div>
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted">
          {localValue.length} characters
        </div>
        {onReset && (
          <Button variant="outline" size="sm" onClick={onReset}>
            Reset to Default
          </Button>
        )}
      </div>
    </div>
  )
}
