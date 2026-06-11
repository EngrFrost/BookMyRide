import { Link } from 'react-router-dom'
import type { Booking } from '../../types'
import { BOOKING_STATUS_LABELS } from '../../types'
import { Badge, Button, GlassCard, bookingStatusTone } from '../ui'
import { formatBookingWindow, formatDate } from '../../utils/dates'
import { cn } from '../../utils/cn'

export interface BookingCardProps {
  booking: Booking
  onCancel?: (booking: Booking) => void
  showRebook?: boolean
}

export function BookingCard({ booking, onCancel, showRebook }: BookingCardProps) {
  const vehicle = booking.vehicle
  const isPast = booking.status === 'COMPLETED' || booking.status === 'NO_SHOW'
  const isCancelled = booking.status === 'CANCELLED'
  const canCancel = booking.status === 'CONFIRMED' && onCancel

  return (
    <GlassCard
      hoverable={!isPast}
      className={cn(
        'flex h-full flex-col gap-4 !p-5',
        isPast && 'opacity-75',
        isCancelled && 'border-danger/30',
      )}
    >
      <div className="flex gap-4">
        <div className="h-24 w-32 shrink-0 overflow-hidden rounded-md bg-surface-high">
          {vehicle?.imageUrl ? (
            <img
              src={vehicle.imageUrl}
              alt={vehicle.name}
              className={cn('h-full w-full object-cover', isPast && 'grayscale-[30%]')}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-label-sm text-on-surface-variant">
              No photo
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="truncate text-headline-sm">{vehicle?.name ?? 'Unknown vehicle'}</h3>
            <Badge tone={bookingStatusTone[booking.status]} className="shrink-0">
              {BOOKING_STATUS_LABELS[booking.status]}
            </Badge>
          </div>
          <p className="mt-2 flex items-center gap-2 text-body-md text-on-surface-variant">
            <CalendarIcon />
            {formatDate(booking.startTime)}
          </p>
          <p className="mt-1 flex items-center gap-2 text-body-md text-on-surface-variant">
            <ClockIcon />
            {formatBookingWindow(booking.startTime, booking.endTime)}
          </p>
        </div>
      </div>

      {isCancelled && booking.cancellationReason && (
        <div className="rounded-md border border-white/[0.08] bg-white/[0.04] px-3 py-2">
          <p className="text-label-sm italic text-on-surface-variant">
            {booking.cancelledBy === 'ADMIN' ? 'Admin' : 'You'} cancelled: {booking.cancellationReason}
          </p>
        </div>
      )}

      {(canCancel || (showRebook && isCancelled && vehicle)) && (
        <div className="mt-auto flex justify-end border-t border-white/[0.08] pt-4">
          {canCancel && (
            <Button variant="outline" size="sm" className="border-danger text-danger hover:bg-danger/10" onClick={() => onCancel(booking)}>
              Cancel booking
            </Button>
          )}
          {showRebook && isCancelled && vehicle && (
            <Link to={`/vehicles/${vehicle.id}`}>
              <Button variant="secondary" size="sm">
                Rebook
              </Button>
            </Link>
          )}
        </div>
      )}
    </GlassCard>
  )
}

function CalendarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 opacity-70">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 opacity-70">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  )
}
