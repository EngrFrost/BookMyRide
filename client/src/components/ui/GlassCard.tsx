import type { HTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

export interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  elevated?: boolean
  hoverable?: boolean
}

export function GlassCard({ elevated, hoverable, className, ...rest }: GlassCardProps) {
  return (
    <div
      className={cn(
        elevated ? 'glass-elevated' : 'glass',
        hoverable &&
          'transition-all duration-300 hover:bg-white/[0.1] hover:border-white/[0.22] hover:-translate-y-0.5',
        className,
      )}
      {...rest}
    />
  )
}
