'use client'

import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate } from 'framer-motion'
import { useEffect, useState, useRef } from 'react'
import { ThemeToggle } from '@/components/shared/ThemeToggle'
import { Button } from '@/components/ui/button'
import { apiClient } from '@/lib/api/client'
import {
  Brain,
  Mail,
  MessageCircle,
  TrendingUp,
  Shield,
  Zap,
  FileText,
  Users,
  Calendar,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  Activity,
  DollarSign,
  Bell,
  Rocket,
  Sparkles,
  Stars,
  Globe,
  Cpu,
  Layers,
  Workflow,
  ChevronRight,
  Play,
  Award,
  Target,
  Clock,
  Lock,
  ZapOff
} from 'lucide-react'
import Link from 'next/link'
import { useTheme } from 'next-themes'

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.3 }
  }
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: 'easeOut' } }
}

const slideInLeft = {
  hidden: { opacity: 0, x: -80 },
  show: { opacity: 1, x: 0, transition: { duration: 0.7, ease: 'easeOut' } }
}

const slideInRight = {
  hidden: { opacity: 0, x: 80 },
  show: { opacity: 1, x: 0, transition: { duration: 0.7, ease: 'easeOut' } }
}

const floatAnimation = {
  animate: {
    y: [0, -15, 0],
    rotate: [0, 2, -2, 0],
    transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' }
  }
}

const pulseGlow = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [0.5, 0.8, 0.5],
    transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' }
  }
}

interface DashboardStats {
  revenueMTD: number
  revenueChange: number
  revenueTarget: number
  pendingApprovals: number
  tasksDoneToday: number
  activeWatchers: number
}

// Particle component
function Particle({ delay }: { delay: number }) {
  return (
    <motion.div
      className="absolute w-1 h-1 bg-primary/40 rounded-full"
      initial={{ opacity: 0, y: 0, x: 0 }}
      animate={{
        opacity: [0, 0.8, 0],
        y: -200 - Math.random() * 300,
        x: (Math.random() - 0.5) * 100,
      }}
      transition={{
        duration: 3 + Math.random() * 2,
        delay: delay,
        repeat: Infinity,
        ease: 'easeOut',
      }}
    />
  )
}

// Animated background grid
function AnimatedGrid() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.1)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.1)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--primary)/0.05),transparent_50%)]"
        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 10, repeat: Infinity }}
      />
    </div>
  )
}

// Logo component with animation
function Logo({ className = '' }: { className?: string }) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <motion.div
      className={`flex items-center gap-5 ${className}`}
      whileHover={{ scale: 1.05 }}
    >
      {/* Animated Logo Icon */}
      <div className="relative w-20 h-20">
        {/* Outer rotating ring - theme aware */}
        <motion.div
          className={`absolute inset-0 rounded-2xl border-2 ${isDark ? 'border-primary/30' : 'border-primary/40'}`}
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        />
        {/* Middle gradient ring - theme aware */}
        <motion.div
          className={`absolute inset-1 rounded-xl border-2 ${isDark ? 'border-cyan/40' : 'border-cyan/50'}`}
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        />
        {/* Inner gradient background - theme aware */}
        <motion.div
          className={`absolute inset-2 rounded-lg ${
            isDark 
              ? 'bg-gradient-to-br from-primary via-cyan to-primary' 
              : 'bg-gradient-to-br from-primary/90 via-cyan/90 to-primary/90'
          } bg-[length:200%_auto]`}
          animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        {/* Brain icon with glow - theme aware */}
        <div className="absolute inset-2 flex items-center justify-center">
          <motion.div
            animate={{ 
              boxShadow: isDark
                ? ['0 0 20px hsl(var(--primary)/0.5)', '0 0 40px hsl(var(--primary)/0.8)', '0 0 20px hsl(var(--primary)/0.5)']
                : ['0 0 15px hsl(var(--primary)/0.4)', '0 0 30px hsl(var(--primary)/0.6)', '0 0 15px hsl(var(--primary)/0.4)']
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="rounded-md p-2"
          >
            <Brain className={`w-10 h-10 ${isDark ? 'text-white drop-shadow-lg' : 'text-white drop-shadow-md'}`} />
          </motion.div>
        </div>
        {/* Pulsing success dot - theme aware */}
        <motion.div
          className={`absolute -top-1 -right-1 w-5 h-5 bg-success rounded-full border-2 ${
            isDark ? 'border-background' : 'border-white'
          }`}
          animate={{ 
            scale: [1, 1.3, 1],
            boxShadow: isDark
              ? ['0 0 10px hsl(var(--success)/0.5)', '0 0 20px hsl(var(--success)/0.8)', '0 0 10px hsl(var(--success)/0.5)']
              : ['0 0 8px hsl(var(--success)/0.4)', '0 0 16px hsl(var(--success)/0.6)', '0 0 8px hsl(var(--success)/0.4)']
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        {/* Orbiting particle - theme aware */}
        <motion.div
          className={`absolute -top-2 -left-2 w-2 h-2 rounded-full ${
            isDark ? 'bg-cyan' : 'bg-cyan/80'
          }`}
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          style={{ originX: '32px', originY: '32px' }}
        />
      </div>
      {/* Logo Text - theme aware with glow animation */}
      <div className="flex flex-col">
        <motion.span 
          className={`text-5xl font-bold font-display bg-gradient-to-r from-primary via-cyan to-primary bg-[length:200%_auto] bg-clip-text text-transparent ${
            isDark ? 'drop-shadow-2xl' : 'drop-shadow-xl'
          }`}
          animate={{ 
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            textShadow: isDark
              ? ['0 0 20px hsl(var(--primary)/0.5)', '0 0 40px hsl(var(--primary)/0.8)', '0 0 20px hsl(var(--primary)/0.5)']
              : ['0 0 15px hsl(var(--primary)/0.4)', '0 0 30px hsl(var(--primary)/0.6)', '0 0 15px hsl(var(--primary)/0.4)']
          }}
          transition={{ 
            backgroundPosition: { duration: 5, repeat: Infinity },
            textShadow: { duration: 3, repeat: Infinity }
          }}
        >
          AI Employee
        </motion.span>
        <motion.span 
          className={`text-sm -mt-1 tracking-widest uppercase font-semibold ${
            isDark ? 'text-muted' : 'text-muted-foreground'
          }`}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          AI Employee
        </motion.span>
      </div>
    </motion.div>
  )
}

// Stat card with hover effects
function AnimatedStatCard({ stat, index }: { stat: any; index: number }) {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const glowX = useSpring(mouseX, { stiffness: 500, damping: 100 })
  const glowY = useSpring(mouseY, { stiffness: 500, damping: 100 })

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect()
    mouseX.set(event.clientX - rect.left)
    mouseY.set(event.clientY - rect.top)
  }

  function handleMouseLeave() {
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <motion.div
      variants={scaleIn}
      whileHover={{ y: -8, scale: 1.03 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative"
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-primary/20 to-cyan/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ x: glowX, y: glowY }}
      />
      <div className="relative bg-card border border-border-subtle rounded-2xl p-6 hover:border-primary/50 transition-colors overflow-hidden">
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-xl bg-${stat.color}/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
              <stat.icon className={`w-6 h-6 text-${stat.color}`} />
            </div>
            {stat.change !== 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`text-xs font-medium px-2 py-1 rounded-full ${
                  stat.change > 0 ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
                }`}
              >
                {stat.change > 0 ? '+' : ''}{stat.change}%
              </motion.div>
            )}
          </div>
          <motion.div
            className="text-3xl font-bold font-display"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 + index * 0.1 }}
          >
            {stat.format === 'currency'
              ? `$${stat.value.toLocaleString()}`
              : stat.value.toLocaleString()}
          </motion.div>
          <div className="text-sm text-muted mt-1">{stat.title}</div>
        </div>
      </div>
    </motion.div>
  )
}

export default function HomePage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await apiClient.getDashboardStats()
        setStats(data)
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchStats()
  }, [])

  const features = [
    {
      icon: Mail,
      title: 'Smart Email Triage',
      description: 'AI-powered email processing with automatic categorization and draft responses',
      color: 'primary',
      gradient: 'from-primary to-primary/50'
    },
    {
      icon: MessageCircle,
      title: 'WhatsApp Integration',
      description: 'Real-time WhatsApp message monitoring with keyword detection',
      color: 'cyan',
      gradient: 'from-cyan to-cyan/50'
    },
    {
      icon: Brain,
      title: 'Autonomous Loops',
      description: 'Ralph Wiggum protocol with 10-iteration safety limit for complex tasks',
      color: 'success',
      gradient: 'from-success to-success/50'
    },
    {
      icon: TrendingUp,
      title: 'Odoo ERP Integration',
      description: 'Seamless invoice creation, customer management, and financial tracking',
      color: 'warning',
      gradient: 'from-warning to-warning/50'
    },
    {
      icon: Shield,
      title: 'Human-in-the-Loop',
      description: 'Approval workflow for sensitive actions with 24-hour review window',
      color: 'primary',
      gradient: 'from-primary to-primary/50'
    },
    {
      icon: Zap,
      title: 'Multi-Platform Posting',
      description: 'Automated social media broadcasting to LinkedIn, Facebook, Instagram & Twitter',
      color: 'cyan',
      gradient: 'from-cyan to-cyan/50'
    }
  ]

  const statsCards = [
    {
      title: 'Revenue MTD',
      value: stats?.revenueMTD ?? 0,
      format: 'currency' as const,
      icon: DollarSign,
      color: 'primary',
      change: stats?.revenueChange ?? 0
    },
    {
      title: 'Pending Approvals',
      value: stats?.pendingApprovals ?? 0,
      format: 'number' as const,
      icon: Bell,
      color: 'warning',
      change: 0
    },
    {
      title: 'Tasks Completed',
      value: stats?.tasksDoneToday ?? 0,
      format: 'number' as const,
      icon: CheckCircle2,
      color: 'success',
      change: 15
    },
    {
      title: 'Active Watchers',
      value: stats?.activeWatchers ?? 0,
      format: 'number' as const,
      icon: Activity,
      color: 'cyan',
      change: 0
    }
  ]

  const capabilities = [
    { icon: FileText, label: 'CEO Briefings', desc: 'Weekly executive reports' },
    { icon: BarChart3, label: 'Subscription Audit', desc: 'Cost optimization alerts' },
    { icon: Users, label: 'Customer Management', desc: 'Odoo CRM integration' },
    { icon: Calendar, label: 'Task Scheduling', desc: 'Automated workflows' },
    { icon: Rocket, label: 'Cloud + Local', desc: '24/7 hybrid operation' },
    { icon: Sparkles, label: 'AI Reasoning', desc: 'Claude-powered decisions' }
  ]

  const trustBadges = [
    { icon: Lock, label: 'Enterprise Security' },
    { icon: Clock, label: '24/7 Monitoring' },
    { icon: Target, label: '99.9% Uptime' },
    { icon: Award, label: 'Gold Tier Certified' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-background-2 overflow-x-hidden">
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-cyan to-primary origin-left z-50"
        style={{ scaleX }}
      />

      {/* Theme Toggle - Fixed Top Right */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Navigation */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border-subtle"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Logo />
            <div className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-sm text-muted hover:text-primary transition-colors">Features</Link>
              <Link href="#architecture" className="text-sm text-muted hover:text-primary transition-colors">Architecture</Link>
              <Link href="#capabilities" className="text-sm text-muted hover:text-primary transition-colors">Capabilities</Link>
              <Link href="/dashboard">
                <Button size="sm" className="bg-primary hover:bg-primary-hover">
                  Open Dashboard
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-32 overflow-hidden min-h-screen flex items-center">
        {/* Animated background layers */}
        <AnimatedGrid />
        
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <Particle key={i} delay={i * 0.15} />
          ))}
        </div>

        {/* Animated gradient orbs - larger and more vibrant */}
        <motion.div
          className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-primary/30 via-primary/20 to-transparent rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.3, 1], 
            opacity: [0.3, 0.6, 0.3],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 15, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-cyan/30 via-cyan/20 to-transparent rounded-full blur-3xl"
          animate={{ 
            scale: [1.3, 1, 1.3], 
            opacity: [0.6, 0.3, 0.6],
            rotate: [360, 180, 0]
          }}
          transition={{ duration: 15, repeat: Infinity }}
        />
        {/* Third orb for depth */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-r from-success/20 to-warning/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1], 
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />

        {/* Animated rings in background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="absolute w-[400px] h-[400px] md:w-[600px] md:h-[600px] border border-primary/5 rounded-full"
              animate={{ 
                scale: [1, 1.5, 2],
                opacity: [0.3, 0.1, 0],
                rotate: i % 2 === 0 ? 360 : -360
              }}
              transition={{ 
                duration: 20 + i * 5, 
                repeat: Infinity,
                ease: 'linear',
                delay: i * 2
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial="hidden"
            animate="show"
            variants={staggerContainer}
            className="text-center max-w-6xl mx-auto"
          >
            {/* Enhanced Badge with multiple animations */}
            <motion.div variants={fadeInUp} className="flex justify-center mb-6">
              <motion.div
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-primary/30 via-primary/20 to-cyan/30 border-2 border-primary/50 backdrop-blur-md shadow-2xl shadow-primary/40"
                animate={{
                  boxShadow: ['0 0 40px hsl(var(--primary)/0.5)', '0 0 80px hsl(var(--primary)/0.7)', '0 0 40px hsl(var(--primary)/0.5)'],
                  scale: [1, 1.02, 1]
                }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                >
                  <Stars className="w-5 h-5 text-white" />
                </motion.div>
                <span className="text-sm font-bold text-white tracking-wide uppercase drop-shadow-lg">
                  Platinum Tier AI Employee System
                </span>
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                >
                  <Stars className="w-5 h-5 text-white" />
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Main Heading with 3D layered effect */}
            <motion.div variants={fadeInUp} className="relative mb-4">
              {/* Glow behind text */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary via-cyan to-primary bg-[length:200%_auto] blur-3xl opacity-40"
                animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                transition={{ duration: 5, repeat: Infinity }}
              />
              
              {/* Animated heading */}
              <motion.h1
                className="relative text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold font-display tracking-tight leading-tight"
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* "Your" */}
                <motion.span
                  className="block"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <span className="text-white drop-shadow-2xl">
                    Your
                  </span>
                </motion.span>

                {/* "Intelligent" - main gradient with shimmer */}
                <motion.span
                  className="block relative"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, delay: 0.4 }}
                >
                  <span className="bg-gradient-to-r from-white via-cyan-300 to-white bg-[length:300%_auto] bg-clip-text text-transparent animate-shimmer drop-shadow-2xl">
                    Intelligent
                  </span>
                  {/* Sparkle effect */}
                  <motion.div
                    className="absolute -top-3 -right-6 text-cyan-300"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1, rotate: 180 }}
                    transition={{ duration: 0.5, delay: 1 }}
                  >
                    <Sparkles className="w-6 h-6" />
                  </motion.div>
                </motion.span>

                {/* "Business Partner" */}
                <motion.span
                  className="block relative"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  <span className="text-white drop-shadow-2xl">
                    Business Partner
                  </span>
                  {/* Animated underline */}
                  <motion.div
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-cyan to-primary rounded-full"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 1, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
                  />
                </motion.span>
              </motion.h1>
            </motion.div>

            {/* Subtitle with enhanced styling */}
            <motion.div
              variants={fadeInUp}
              className="relative"
            >
              <motion.p
                className="text-lg sm:text-xl text-muted max-w-3xl mx-auto leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.9 }}
              >
                A semi-autonomous AI employee that monitors communications, manages finances,
                broadcasts on social media, and generates executive briefings — all while
                keeping you in control.
              </motion.p>
            </motion.div>

            {/* Enhanced CTA Buttons with 3D effects */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10"
            >
              <Link href="/dashboard">
                <motion.div
                  className="relative group"
                  whileHover={{ scale: 1.05, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Button glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-cyan rounded-2xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity" />
                  <Button
                    size="lg"
                    className="group relative text-base px-12 py-8 bg-gradient-to-r from-primary to-primary-hover hover:from-primary-hover hover:to-cyan transition-all shadow-2xl hover:shadow-primary/50 rounded-2xl overflow-hidden border border-primary/20"
                  >
                    {/* Shimmer effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '100%' }}
                      transition={{ duration: 0.6 }}
                    />
                    <span className="relative z-10 flex items-center gap-3 font-semibold">
                      <Rocket className="w-5 h-5 group-hover:rotate-45 transition-transform" />
                      Open Dashboard
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                    </span>
                  </Button>
                </motion.div>
              </Link>
              
              <Link href="#features">
                <motion.div
                  className="relative group"
                  whileHover={{ scale: 1.05, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    variant="outline"
                    className="group relative text-base px-12 py-8 border-2 border-primary/30 hover:border-primary transition-all rounded-2xl overflow-hidden bg-background/50 backdrop-blur-sm"
                  >
                    {/* Rotating border effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-primary via-cyan to-primary opacity-0 group-hover:opacity-20"
                      animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                    <span className="relative z-10 flex items-center gap-3">
                      <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      Explore Features
                    </span>
                  </Button>
                </motion.div>
              </Link>
            </motion.div>

            {/* Live Stats Preview - Enhanced */}
            <motion.div
              variants={scaleIn}
              className="relative mt-12 pt-12 border-t border-border-subtle"
            >
              {/* Stats section glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
              
              <div className="text-center mb-8">
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2 }}
                  className="text-sm text-muted uppercase tracking-widest"
                >
                  Live Dashboard Preview
                </motion.p>
              </div>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {statsCards.map((stat, index) => (
                  <AnimatedStatCard key={stat.title} stat={stat} index={index} />
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 border-y border-border-subtle bg-background-2/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {trustBadges.map((badge, index) => (
              <motion.div
                key={badge.label}
                variants={fadeInUp}
                whileHover={{ scale: 1.05, y: -4 }}
                className="flex items-center justify-center gap-3"
              >
                <badge.icon className="w-6 h-6 text-primary" />
                <span className="text-sm font-medium">{badge.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 sm:py-32 bg-background-2/50 border-y border-border-subtle">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Brain className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Core Capabilities</span>
            </motion.div>
            <motion.h2
              variants={fadeInUp}
              className="text-4xl sm:text-5xl md:text-6xl font-bold font-display mb-6"
            >
              Everything Your Business Needs
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-lg text-muted max-w-2xl mx-auto"
            >
              From communication monitoring to financial management, our AI handles it all
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={fadeInUp}
                whileHover={{ y: -12, scale: 1.02 }}
                className="group relative bg-card border border-border-subtle rounded-2xl p-8 hover:border-primary/50 transition-all duration-500 overflow-hidden"
              >
                {/* Animated gradient background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                
                {/* Animated border glow */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent blur-xl" style={{ transform: 'translateX(-100%)', animation: 'shimmer 1.5s infinite' }} />
                </div>
                
                <div className="relative">
                  <motion.div
                    className={`w-14 h-14 rounded-xl bg-${feature.color}/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
                    whileHover={{ rotate: 5 }}
                  >
                    <feature.icon className={`w-7 h-7 text-${feature.color}`} />
                  </motion.div>
                  <h3 className="text-2xl font-semibold font-display mb-3">{feature.title}</h3>
                  <p className="text-muted leading-relaxed">{feature.description}</p>
                  
                  {/* Learn more link */}
                  <motion.div
                    className="mt-4 flex items-center gap-2 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                    whileHover={{ x: 4 }}
                  >
                    Learn more
                    <ChevronRight className="w-4 h-4" />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Capabilities Strip */}
      <section id="capabilities" className="py-16 bg-background-3/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
          >
            {capabilities.map((cap, index) => (
              <motion.div
                key={cap.label}
                variants={scaleIn}
                whileHover={{ scale: 1.08, y: -4 }}
                className="flex flex-col items-center text-center p-6 rounded-xl bg-card border border-border-subtle hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300"
              >
                <cap.icon className="w-10 h-10 text-primary mb-3" />
                <div className="font-medium text-sm mb-1">{cap.label}</div>
                <div className="text-xs text-muted">{cap.desc}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Architecture Section */}
      <section id="architecture" className="py-20 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="grid lg:grid-cols-2 gap-16 items-center"
          >
            <motion.div variants={slideInLeft}>
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary/10 border border-primary/20 mb-6">
                <Rocket className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Platinum Architecture</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold font-display mb-8">
                Cloud + Local Hybrid System
              </h2>
              <p className="text-lg text-muted mb-10 leading-relaxed">
                Experience true 24/7 operation with our dual-agent architecture. The Cloud Agent
                works around the clock while the Local Agent handles sensitive operations —
                all synchronized through a shared vault.
              </p>

              <div className="space-y-6">
                {[
                  { title: '24/7 Cloud Monitoring', desc: 'Always awake, always watching your communications', icon: Globe },
                  { title: 'Local Execution Control', desc: 'You approve sensitive actions like payments and posts', icon: Cpu },
                  { title: 'Real-time Vault Sync', desc: 'Git-based synchronization ensures no data loss', icon: Layers },
                  { title: 'Security First', desc: 'Secrets never sync — credentials stay local only', icon: Lock }
                ].map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: -40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.15 }}
                    whileHover={{ x: 8 }}
                    className="flex items-start gap-4 p-4 rounded-xl hover:bg-background-2 transition-colors"
                  >
                    <div className={`w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0`}>
                      <item.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold mb-1">{item.title}</div>
                      <div className="text-sm text-muted">{item.desc}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              variants={slideInRight}
              className="relative"
            >
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-cyan/20 rounded-3xl blur-3xl animate-pulse" />
              
              {/* Main diagram */}
              <div className="relative bg-card border border-border-subtle rounded-3xl p-12 overflow-hidden">
                {/* Grid pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.1)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.1)_1px,transparent_1px)] bg-[size:2rem_2rem]" />
                
                <div className="relative aspect-square flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
                    className="relative w-72 h-72"
                  >
                    {/* Outer ring */}
                    <div className="absolute inset-0 rounded-full border-2 border-dashed border-primary/30" />
                    
                    {/* Inner ring */}
                    <motion.div
                      className="absolute inset-8 rounded-full border border-primary/20"
                      animate={{ rotate: -360 }}
                      transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                    />
                    
                    {/* Cloud Agent badge */}
                    <motion.div
                      className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-primary to-primary-hover text-primary-foreground px-6 py-3 rounded-full text-sm font-medium whitespace-nowrap shadow-lg"
                      animate={floatAnimation.animate}
                    >
                      ☁️ Cloud Agent
                    </motion.div>
                    
                    {/* Local Agent badge */}
                    <motion.div
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-gradient-to-r from-cyan to-cyan-light text-primary-foreground px-6 py-3 rounded-full text-sm font-medium whitespace-nowrap shadow-lg"
                      animate={floatAnimation.animate}
                    >
                      💻 Local Agent
                    </motion.div>
                    
                    {/* Center */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        className="text-center"
                      >
                        <motion.div
                          animate={{ rotate: [0, 360, 0] }}
                          transition={{ duration: 10, repeat: Infinity }}
                          className="w-20 h-20 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-primary/20 to-cyan/20 flex items-center justify-center"
                        >
                          <Brain className="w-10 h-10 text-primary" />
                        </motion.div>
                        <div className="font-semibold">Shared Vault</div>
                        <div className="text-xs text-muted">Git Sync</div>
                      </motion.div>
                    </div>
                    
                    {/* Orbiting dots */}
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="absolute inset-0"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 15 + i * 5, repeat: Infinity, ease: 'linear' }}
                      >
                        <div
                          className="absolute top-0 left-1/2 w-3 h-3 bg-primary rounded-full shadow-lg shadow-primary/50"
                          style={{ transform: 'translate(-50%, -50%)' }}
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-20 sm:py-32 bg-background-2/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Workflow className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">How It Works</span>
            </motion.div>
            <motion.h2 variants={fadeInUp} className="text-4xl sm:text-5xl font-bold font-display mb-6">
              Seamless Workflow
            </motion.h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            className="grid md:grid-cols-4 gap-8"
          >
            {[
              { step: '01', title: 'Monitor', desc: 'AI watches your communications 24/7', icon: Mail },
              { step: '02', title: 'Analyze', desc: 'Claude processes and categorizes', icon: Brain },
              { step: '03', title: 'Approve', desc: 'You review sensitive actions', icon: Shield },
              { step: '04', title: 'Execute', desc: 'Local agent completes the task', icon: Zap }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                variants={fadeInUp}
                whileHover={{ y: -8 }}
                className="relative text-center p-6"
              >
                {/* Connector line */}
                {index < 3 && (
                  <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent" />
                )}
                <div className="relative">
                  <motion.div
                    className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-primary/20 to-cyan/20 flex items-center justify-center mb-6"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <item.icon className="w-10 h-10 text-primary" />
                  </motion.div>
                  <div className="text-5xl font-bold font-display text-primary/10 absolute -top-4 left-1/2 -translate-x-1/2 -z-10">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-32 bg-background-2">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary via-primary to-cyan p-8 sm:p-12 lg:p-16"
          >
            {/* Animated background pattern */}
            <motion.div
              className="absolute inset-0 opacity-10"
              animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
              transition={{ duration: 20, repeat: Infinity }}
              style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                backgroundSize: '32px 32px'
              }}
            />

            {/* Floating elements */}
            <motion.div
              className="absolute top-10 right-10 w-20 h-20 bg-white/10 rounded-full blur-xl"
              animate={{ scale: [1, 1.2, 1], y: [0, -20, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
            />
            <motion.div
              className="absolute bottom-10 left-10 w-32 h-32 bg-cyan/20 rounded-full blur-xl"
              animate={{ scale: [1.2, 1, 1.2], y: [0, 20, 0] }}
              transition={{ duration: 6, repeat: Infinity }}
            />

            <div className="relative text-center max-w-3xl mx-auto">
              <motion.h2
                variants={fadeInUp}
                className="text-4xl sm:text-5xl md:text-6xl font-bold font-display text-primary-foreground mb-6"
              >
                Ready to Transform Your Business?
              </motion.h2>
              <motion.p
                variants={fadeInUp}
                className="text-xl text-primary-foreground/80 mb-12"
              >
                Join the future of autonomous business operations. Your AI employee is waiting.
              </motion.p>
              <motion.div variants={fadeInUp}>
                <Link href="/dashboard">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      size="lg"
                      className="group text-xl px-12 py-8 bg-background text-foreground hover:bg-background-2 transition-all shadow-2xl hover:shadow-white/30 relative overflow-hidden"
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        initial={{ x: '-100%' }}
                        whileHover={{ x: '100%' }}
                        transition={{ duration: 0.5 }}
                      />
                      <span className="relative z-10 flex items-center gap-3">
                        Launch Dashboard
                        <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                      </span>
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border-subtle bg-background-2/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            <Logo />
            <div className="flex items-center gap-8 text-sm text-muted">
              <Link href="#" className="hover:text-primary transition-colors">Documentation</Link>
              <Link href="#" className="hover:text-primary transition-colors">GitHub</Link>
              <Link href="#" className="hover:text-primary transition-colors">Support</Link>
              <Link href="#" className="hover:text-primary transition-colors">Privacy</Link>
            </div>
            <div className="text-sm text-muted">
              © 2026 AI Employee. All rights reserved.
            </div>
          </div>
        </div>
      </footer>

      {/* Custom shimmer animation */}
      <style jsx global>{`
        @keyframes shimmer {
          from { transform: translateX(-100%); }
          to { transform: translateX(100%); }
        }
      `}</style>
    </div>
  )
}
