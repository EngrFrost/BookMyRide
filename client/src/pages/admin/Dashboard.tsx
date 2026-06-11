import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../services/api'
import type { AdminStats } from '../../services/api'
import type { Booking } from '../../types'
import { BOOKING_STATUS_LABELS } from '../../types'
import { BookingsChart } from '../../components/admin/BookingsChart'
import { StatCard } from '../../components/admin/StatCard'
import { Badge, GlassCard, Skeleton, bookingStatusTone } from '../../components/ui'
import { formatBookingWindow } from '../../utils/dates'

export function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [todayBookings, setTodayBookings] = useState<Booking[] | null>(null)

  useEffect(() => {
    void Promise.all([api.getAdminStats(), api.listAllBookings()]).then(([s, all]) => {
      setStats(s)
      const today = new Date().toDateString()
      setTodayBookings(
        all.filter((b) => new Date(b.startTime).toDateString() === today).slice(0, 8),
      )
    })
  }, [])

  const totalBookings = useMemo(() => {
    if (!stats) return 0
    return stats.bookingsPerDay.reduce((sum, d) => sum + d.count, 0)
  }, [stats])

  if (!stats) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-headline-lg md:text-headline-xl">
        Dashboard <span className="text-primary">Overview</span>
      </h1>

      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Today's bookings"
          value={stats.todaysBookings}
          accent="success"
          icon={<CalendarIcon />}
        />
        <StatCard
          label="Upcoming"
          value={stats.upcomingBookings}
          accent="secondary"
          icon={<UpcomingIcon />}
        />
        <StatCard
          label="Active vehicles"
          value={stats.activeVehicles}
          accent="primary"
          icon={<CarIcon />}
        />
        <StatCard
          label="Registered users"
          value={stats.totalUsers}
          accent="info"
          hint={`${totalBookings} bookings (7d)`}
          icon={<UsersIcon />}
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-12">
        <GlassCard className="overflow-hidden !p-0 lg:col-span-8">
          <div className="flex items-center justify-between border-b border-white/[0.08] px-5 py-4">
            <h3 className="text-headline-sm font-semibold">Today&apos;s bookings</h3>
            <Link
              to="/admin/bookings"
              className="text-label-md text-primary transition-colors hover:text-primary-light"
            >
              View all →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left text-body-md">
              <thead className="border-b border-white/[0.08] bg-white/[0.03] text-label-md text-on-surface-variant">
                <tr>
                  <th className="px-5 py-3 font-medium">Vehicle</th>
                  <th className="px-5 py-3 font-medium">Customer</th>
                  <th className="px-5 py-3 font-medium">Window</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {todayBookings === null ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-8">
                      <Skeleton className="h-6 w-full" />
                    </td>
                  </tr>
                ) : todayBookings.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-8 text-center text-on-surface-variant">
                      No bookings scheduled for today.
                    </td>
                  </tr>
                ) : (
                  todayBookings.map((b) => (
                    <tr key={b.id} className="transition-colors hover:bg-white/[0.03]">
                      <td className="px-5 py-3">{b.vehicle?.name ?? '—'}</td>
                      <td className="px-5 py-3 text-on-surface-variant">{b.user?.displayName ?? '—'}</td>
                      <td className="px-5 py-3 text-on-surface-variant">
                        {formatBookingWindow(b.startTime, b.endTime)}
                      </td>
                      <td className="px-5 py-3">
                        <Badge tone={bookingStatusTone[b.status]}>
                          {BOOKING_STATUS_LABELS[b.status]}
                        </Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </GlassCard>

        <div className="lg:col-span-4">
          <BookingsChart data={stats.bookingsPerDay} />
        </div>
      </div>
    </div>
  )
}

function CalendarIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  )
}

function UpcomingIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  )
}

function CarIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 17h14M5 17a2 2 0 1 1-4 0M19 17a2 2 0 1 0 4 0M3 12l2-5h14l2 5" strokeLinejoin="round" />
    </svg>
  )
}

function UsersIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="9" cy="7" r="4" />
      <path d="M3 21v-2a4 4 0 0 1 4-4h4M16 11a4 4 0 0 1 0 8M21 21v-2a4 4 0 0 0-3-3.85" />
    </svg>
  )
}
