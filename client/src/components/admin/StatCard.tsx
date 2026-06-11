import type { ReactNode } from 'react'
import { GlassCard } from '../ui'
import { cn } from '../../utils/cn'

export interface StatCardProps {
  label: string
  value: string | number
  icon: ReactNode
  accent?: 'primary' | 'secondary' | 'success' | 'info'
  hint?: string
}

const accentGlow: Record<NonNullable<StatCardProps['accent']>, string> = {
  primary: 'bg-primary/10',
  secondary: 'bg-secondary/10',
  success: 'bg-success/10',
  info: 'bg-tertiary/10',
}

const accentIcon: Record<NonNullable<StatCardProps['accent']>, string> = {
  primary: 'bg-primary/20 text-primary border-primary/20',
  secondary: 'bg-secondary/20 text-secondary-light border-secondary/20',
  success: 'bg-success/20 text-success border-success/30',
  info: 'bg-tertiary/20 text-tertiary-light border-tertiary/30',
}

export function StatCard({ label, value, icon, accent = 'primary', hint }: StatCardProps) {
  return (
    <GlassCard className="relative overflow-hidden !p-5">
      <div className={cn('absolute -right-8 -top-8 h-32 w-32 rounded-full blur-2xl', accentGlow[accent])} />
      <div className="relative z-10 flex items-start justify-between">
        <div>
          <p className="text-label-md text-on-surface-variant">{label}</p>
          <p className="mt-1 text-headline-md font-bold">{value}</p>
          {hint && <p className="mt-2 text-label-sm text-on-surface-variant">{hint}</p>}
        </div>
        <div
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-md border',
            accentIcon[accent],
          )}
        >
          {icon}
        </div>
      </div>
    </GlassCard>
  )
}
