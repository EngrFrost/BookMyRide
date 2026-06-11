import type { HTMLAttributes } from 'react'
import { cn } from '../../utils/cn'
import type { BookingStatus, VehicleStatus } from '../../types'

type Tone = 'primary' | 'success' | 'warning' | 'danger' | 'neutral' | 'info'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone
}

// Low-opacity fill of the status color with saturated text, pill-shaped (design system §Chips/Status)
const toneClasses: Record<Tone, string> = {
  primary: 'bg-primary/15 text-primary-light border-primary/30',
  success: 'bg-success/10 text-success border-success/30',
  warning: 'bg-warning/10 text-warning border-warning/30',
  danger: 'bg-danger/10 text-danger border-danger/30',
  neutral: 'bg-white/[0.08] text-on-surface-variant border-white/[0.14]',
  info: 'bg-tertiary/10 text-tertiary-light border-tertiary/30',
}

export function Badge({ tone = 'neutral', className, ...rest }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-label-sm font-medium',
        toneClasses[tone],
        className,
      )}
      {...rest}
    />
  )
}

export const vehicleStatusTone: Record<VehicleStatus, Tone> = {
  AVAILABLE: 'success',
  MAINTENANCE: 'warning',
  RETIRED: 'neutral',
}

export const bookingStatusTone: Record<BookingStatus, Tone> = {
  CONFIRMED: 'success',
  CANCELLED: 'danger',
  COMPLETED: 'info',
  NO_SHOW: 'warning',
}
