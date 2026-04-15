'use client'

import { motion } from 'framer-motion'
import { Pause, Play, AlertTriangle, Activity, Clock, Eye } from 'lucide-react'
import { formatTimeAgo } from '@/lib/utils'
import { useAppStore } from '@/lib/store/useAppStore'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

export function AIStatusBar() {
  const { aiState, setAIState, topBarVisible, toggleTopBar } = useAppStore()

  const handlePauseAI = () => {
    setAIState({ status: 'paused' })
  }

  const handleResumeAI = () => {
    setAIState({ status: 'active' })
  }

  // Define status colors and icons
  const statusConfig = {
    active: {
      bg: 'bg-primary/10',
      border: 'border-primary/20',
      text: 'text-primary',
      icon: Activity,
      label: 'ACTIVE',
      pulse: true,
    },
    idle: {
      bg: 'bg-background-2',
      border: 'border-muted',
      text: 'text-muted',
      icon: Clock,
      label: 'IDLE',
      pulse: false,
    },
    processing: {
      bg: 'bg-cyan/10',
      border: 'border-cyan/20',
      text: 'text-cyan',
      icon: Activity,
      label: 'PROCESSING',
      pulse: true,
    },
    paused: {
      bg: 'bg-warning/10',
      border: 'border-warning/20',
      text: 'text-warning',
      icon: Pause,
      label: 'PAUSED',
      pulse: false,
    },
    error: {
      bg: 'bg-danger/10',
      border: 'border-danger/20',
      text: 'text-danger',
      icon: AlertTriangle,
      label: 'ERROR',
      pulse: false,
    },
    offline: {
      bg: 'bg-muted/50',
      border: 'border-muted',
      text: 'text-muted',
      icon: Clock,
      label: 'OFFLINE',
      pulse: false,
    },
  }

  const config = statusConfig[aiState.status]

  return (
    <motion.div
      className={cn(
        "fixed z-40 px-4 py-2 border-b backdrop-blur-sm transition-all duration-300",
        config.bg,
        config.border,
        topBarVisible ? "top-16 right-0 left-0" : "top-0 right-0 left-0"
      )}
      initial={{ opacity: 1, y: 0 }}
      animate={{
        opacity: topBarVisible ? 1 : 0.7,
        y: topBarVisible ? 0 : 0,
      }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <motion.div
            className={cn(
              "size-3 rounded-full",
              config.text,
              config.pulse && "live-dot"
            )}
            animate={config.pulse ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
          <span className={cn("text-sm font-semibold uppercase tracking-wide", config.text)}>
            CLAUDE {config.label}
          </span>

          {aiState.currentTask && (
            <>
              <span className="text-muted mx-2">|</span>
              <span className="text-sm truncate max-w-xs md:max-w-md lg:max-w-lg">
                Processing: {aiState.currentTask}
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-muted">
            {aiState.queueLength} in queue
          </span>

          <span className="text-sm text-muted hidden sm:inline">
            Last: {aiState.lastActionAt ? formatTimeAgo(aiState.lastActionAt) : 'never'}
          </span>

          <span className="text-sm text-muted hidden sm:inline">
            {aiState.tasksCompleted} tasks today
          </span>

          {/* Show TopBar Button - Only visible when TopBar is hidden */}
          {!topBarVisible && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleTopBar}
                      className="text-primary hover:text-primary gap-2"
                      aria-label="Show navbar"
                    >
                      <Eye className="size-4" />
                      <span className="hidden sm:inline text-xs font-medium">Show Navbar</span>
                    </Button>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Show Navigation Bar</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {aiState.status === 'active' || aiState.status === 'processing' ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handlePauseAI}
                    className="text-muted hover:text-foreground"
                  >
                    <Pause className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Pause AI</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : aiState.status === 'paused' ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleResumeAI}
                    className="text-warning hover:text-warning"
                  >
                    <Play className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Resume AI</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : null}

          {aiState.status === 'error' && aiState.errorMessage && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="text-sm text-danger truncate max-w-xs">
                    {aiState.errorMessage}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{aiState.errorMessage}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>
    </motion.div>
  )
}