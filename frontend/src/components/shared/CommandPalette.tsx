'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Keyboard } from 'lucide-react'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { useAppStore } from '@/lib/store/useAppStore'

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter()
  const { stats } = useAppStore()
  const [searchQuery, setSearchQuery] = useState('')

  // Keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        onOpenChange(true)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onOpenChange])

  const handleNavigate = (href: string) => {
    router.push(href)
    onOpenChange(false)
  }

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Type to search..."
        value={searchQuery}
        onValueChange={setSearchQuery}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        
        <CommandGroup heading="Pages">
          <CommandItem onSelect={() => handleNavigate('/dashboard')}>
            <Search className="mr-2 size-4" />
            Dashboard
          </CommandItem>
          <CommandItem onSelect={() => handleNavigate('/inbox')}>
            <Search className="mr-2 size-4" />
            Inbox
            {stats.tasksTotal > 0 && (
              <span className="ml-auto text-xs text-muted">
                {stats.tasksTotal} items
              </span>
            )}
          </CommandItem>
          <CommandItem onSelect={() => handleNavigate('/approvals')}>
            <Search className="mr-2 size-4" />
            Approvals
            {stats.pendingApprovals > 0 && (
              <span className="ml-auto text-xs text-danger">
                {stats.pendingApprovals} pending
              </span>
            )}
          </CommandItem>
          <CommandItem onSelect={() => handleNavigate('/plans')}>
            <Search className="mr-2 size-4" />
            Plans
          </CommandItem>
          <CommandItem onSelect={() => handleNavigate('/briefings')}>
            <Search className="mr-2 size-4" />
            Briefings
          </CommandItem>
          <CommandItem onSelect={() => handleNavigate('/accounting')}>
            <Search className="mr-2 size-4" />
            Accounting
          </CommandItem>
          <CommandItem onSelect={() => handleNavigate('/logs')}>
            <Search className="mr-2 size-4" />
            Audit Logs
          </CommandItem>
          <CommandItem onSelect={() => handleNavigate('/settings')}>
            <Search className="mr-2 size-4" />
            Settings
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Keyboard Shortcuts">
          <CommandItem>
            <Keyboard className="mr-2 size-4" />
            <span>⌘K - Open command palette</span>
          </CommandItem>
          <CommandItem>
            <Keyboard className="mr-2 size-4" />
            <span>⌘D - Go to Dashboard</span>
          </CommandItem>
          <CommandItem>
            <Keyboard className="mr-2 size-4" />
            <span>⌘I - Go to Inbox</span>
          </CommandItem>
          <CommandItem>
            <Keyboard className="mr-2 size-4" />
            <span>⌘A - Go to Approvals</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
