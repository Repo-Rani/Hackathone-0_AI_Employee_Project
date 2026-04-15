export interface StatCardProps {
  title: string
  value: number
  format: 'currency' | 'number' | 'percentage' | 'ratio'
  icon: React.ElementType
  iconColor: 'primary' | 'success' | 'warning' | 'danger' | 'cyan'
  trend?: { value: number; direction: 'up' | 'down'; label: string }
  subtitle?: string
  urgent?: boolean
  href?: string
}
