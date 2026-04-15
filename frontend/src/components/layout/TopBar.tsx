'use client'

import { usePathname, useRouter } from 'next/navigation'
import { Menu, ChevronRight, ArrowLeft, Home, RefreshCw, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/lib/store/useAppStore'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface TopBarProps {
  title?: string
  subtitle?: string
}

export function TopBar({ title, subtitle }: TopBarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { sidebarOpen, toggleSidebar, topBarVisible, toggleTopBar } = useAppStore()

  // Generate breadcrumb from pathname
  const getBreadcrumb = () => {
    const segments = pathname.split('/').filter(Boolean)
    const lastSegment = segments[segments.length - 1]

    if (!lastSegment || lastSegment === 'dashboard') {
      return { title: 'Dashboard', subtitle: 'Command Center' }
    }

    const formattedTitle = lastSegment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')

    return { title: formattedTitle, subtitle: subtitle || '' }
  }

  const { title: breadcrumbTitle, subtitle: breadcrumbSubtitle } = getBreadcrumb()

  const isHomePage = pathname === '/'
  const isDashboard = pathname === '/dashboard' || pathname === '/'

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      initial={{ opacity: 1, y: 0 }}
      animate={{
        opacity: topBarVisible ? 1 : 0,
        y: topBarVisible ? 0 : -100,
        pointerEvents: topBarVisible ? 'auto' : 'none'
      }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex h-16 items-center gap-4 px-4">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={toggleSidebar}
          aria-label="Toggle menu"
        >
          <Menu className="size-5" />
        </Button>

        {/* Desktop sidebar toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="hidden lg:flex"
          onClick={toggleSidebar}
          aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          <ChevronRight className={cn(
            "size-5 transition-transform",
            !sidebarOpen && "rotate-180"
          )} />
        </Button>

        {/* Back to Home Button */}
        {!isHomePage && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push('/')}
                    className="gap-2 text-muted hover:text-primary"
                  >
                    <ArrowLeft className="size-4" />
                    <span className="hidden sm:inline text-sm font-medium">Back to Home</span>
                  </Button>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Go to Home Page</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        {/* Breadcrumb / Title */}
        <div className="flex-1">
          <div className="flex items-center gap-2 text-sm text-muted">
            {!isDashboard && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push('/dashboard')}
                  className="h-auto p-0 text-muted hover:text-primary"
                >
                  <Home className="size-4" />
                </Button>
                <ChevronRight className="size-4" />
              </>
            )}
            <span>Dashboard</span>
            {pathname !== '/dashboard' && pathname !== '/' && (
              <>
                <ChevronRight className="size-4" />
                <span className="text-foreground font-medium">{breadcrumbTitle}</span>
              </>
            )}
          </div>
          <h1 className="text-xl font-bold font-display mt-0.5">
            {title || breadcrumbTitle}
          </h1>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {/* Toggle TopBar Visibility */}
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
                    size="icon"
                    onClick={toggleTopBar}
                    className="text-muted hover:text-primary"
                    aria-label={topBarVisible ? "Hide navbar" : "Show navbar"}
                  >
                    {topBarVisible ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </Button>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{topBarVisible ? 'Hide Navbar (Focus Mode)' : 'Show Navbar'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Refresh Button */}
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
                    size="icon"
                    onClick={() => window.location.reload()}
                    className="text-muted hover:text-primary"
                    aria-label="Refresh page"
                  >
                    <RefreshCw className="size-4" />
                  </Button>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Refresh Page</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </motion.header>
  )
}
