import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../services/api'
import type { Booking } from '../types'
import { BookingCard, CancelBookingModal } from '../components/booking'
import { Button, GlassCard, Skeleton, Tabs, toast } from '../components/ui'

type Filter = 'ALL' | 'UPCOMING' | 'COMPLETED' | 'CANCELLED'

const filterTabs: { value: Filter; label: string }[] = [
  { value: 'ALL', label: 'All' },
  { value: 'UPCOMING', label: 'Upcoming' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' },
]

function matchesFilter(booking: Booking, filter: Filter, now: number): boolean {
  if (filter === 'ALL') return true
  if (filter === 'UPCOMING') {
    return booking.status === 'CONFIRMED' && new Date(booking.endTime).getTime() > now
  }
  if (filter === 'COMPLETED') {
    return booking.status === 'COMPLETED' || booking.status === 'NO_SHOW'
  }
  if (filter === 'CANCELLED') return booking.status === 'CANCELLED'
  return true
}

export function MyBookings() {
  const [bookings, setBookings] = useState<Booking[] | null>(null)
  const [filter, setFilter] = useState<Filter>('ALL')
  const [cancelTarget, setCancelTarget] = useState<Booking | null>(null)

  const load = useCallback(async () => {
    const data = await api.listMyBookings()
    setBookings(data)
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const now = Date.now()
  const filtered = useMemo(() => {
    if (!bookings) return null
    return bookings.filter((b) => matchesFilter(b, filter, now))
  }, [bookings, filter, now])

  const upcoming = useMemo(() => {
    if (!bookings) return []
    return bookings.filter(
      (b) => b.status === 'CONFIRMED' && new Date(b.endTime).getTime() > now,
    )
  }, [bookings, now])

  async function handleCancel(reason?: string) {
    if (!cancelTarget) return
    try {
      await api.cancelBooking(cancelTarget.id, reason)
      toast.success('Booking cancelled.')
      setCancelTarget(null)
      await load()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Could not cancel booking.')
      throw e
    }
  }

  function canCancelBooking(booking: Booking): boolean {
    if (booking.status !== 'CONFIRMED') return false
    const hoursUntil =
      (new Date(booking.startTime).getTime() - Date.now()) / (60 * 60 * 1000)
    return hoursUntil >= 24
  }

  return (
    <div className="mx-auto max-w-7xl px-margin-mobile py-12 lg:px-8">
      <h1 className="text-headline-lg md:text-headline-xl">
        My <span className="text-primary">Bookings</span>
      </h1>
      <p className="mt-2 text-body-md text-on-surface-variant">
        {bookings && upcoming.length > 0
          ? `${upcoming.length} upcoming reservation${upcoming.length === 1 ? '' : 's'}`
          : 'View and manage your reservations'}
      </p>

      <div className="mt-8">
        <Tabs tabs={filterTabs} value={filter} onChange={setFilter} />
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {filtered === null
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-5 w-2/3" />
              </div>
            ))
          : filtered.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                showRebook
                onCancel={canCancelBooking(booking) ? setCancelTarget : undefined}
              />
            ))}
      </div>

      {filtered !== null && filtered.length === 0 && (
        <GlassCard className="mt-8 p-12 text-center">
          <p className="text-headline-sm text-on-surface-variant">No bookings found</p>
          <p className="mt-2 text-body-md text-on-surface-variant">
            {filter === 'ALL'
              ? "You haven't made any reservations yet."
              : `No ${filter.toLowerCase()} bookings.`}
          </p>
          <Link to="/vehicles" className="mt-6 inline-block">
            <Button>Browse vehicles</Button>
          </Link>
        </GlassCard>
      )}

      <CancelBookingModal
        booking={cancelTarget}
        open={cancelTarget !== null}
        onClose={() => setCancelTarget(null)}
        onConfirm={handleCancel}
      />
    </div>
  )
}
