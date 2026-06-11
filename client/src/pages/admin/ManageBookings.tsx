import { useCallback, useEffect, useMemo, useState } from 'react'
import { api } from '../../services/api'
import type { Booking, BookingStatus, Vehicle } from '../../types'
import { BOOKING_STATUS_LABELS } from '../../types'
import { CancelBookingModal } from '../../components/booking/CancelBookingModal'
import { Badge, Button, GlassCard, Input, Select, Skeleton, toast, bookingStatusTone } from '../../components/ui'
import { formatBookingWindow, formatDate } from '../../utils/dates'

export function ManageBookings() {
  const [bookings, setBookings] = useState<Booking[] | null>(null)
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'ALL'>('ALL')
  const [vehicleFilter, setVehicleFilter] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [cancelTarget, setCancelTarget] = useState<Booking | null>(null)

  const load = useCallback(async () => {
    const [all, vehs] = await Promise.all([
      api.listAllBookings({
        status: statusFilter === 'ALL' ? undefined : statusFilter,
        vehicleId: vehicleFilter || undefined,
        date: dateFilter || undefined,
      }),
      api.listVehicles(),
    ])
    setBookings(all)
    setVehicles(vehs)
  }, [statusFilter, vehicleFilter, dateFilter])

  useEffect(() => {
    void load()
  }, [load])

  const statusOptions = useMemo(
    () =>
      Object.entries(BOOKING_STATUS_LABELS).map(([value, label]) => ({
        value,
        label,
      })),
    [],
  )

  async function handleCancel(reason?: string) {
    if (!cancelTarget) return
    await api.cancelBooking(cancelTarget.id, reason)
    toast.success('Booking cancelled.')
    setCancelTarget(null)
    await load()
  }

  async function handleNoShow(booking: Booking) {
    if (!confirm(`Mark ${booking.vehicle?.name} booking as no-show?`)) return
    try {
      await api.markNoShow(booking.id)
      toast.success('Marked as no-show.')
      await load()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Action failed.')
    }
  }

  return (
    <div>
      <h1 className="text-headline-lg md:text-headline-xl">
        Booking <span className="text-primary">Management</span>
      </h1>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Select
          label="Status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as BookingStatus | 'ALL')}
          options={[{ value: 'ALL', label: 'All statuses' }, ...statusOptions]}
        />
        <Select
          label="Vehicle"
          value={vehicleFilter}
          onChange={(e) => setVehicleFilter(e.target.value)}
          placeholder="All vehicles"
          options={[
            { value: '', label: 'All vehicles' },
            ...vehicles.map((v) => ({ value: v.id, label: v.name })),
          ]}
        />
        <Input
          label="Date"
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        />
      </div>

      <GlassCard className="mt-8 overflow-hidden !p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-body-md">
            <thead className="border-b border-white/[0.08] bg-white/[0.03] text-label-md text-on-surface-variant">
              <tr>
                <th className="px-5 py-3 font-medium">Vehicle</th>
                <th className="px-5 py-3 font-medium">Customer</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Window</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {bookings === null
                ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      <td colSpan={6} className="px-5 py-4">
                        <Skeleton className="h-5 w-full" />
                      </td>
                    </tr>
                  ))
                : bookings.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-8 text-center text-on-surface-variant">
                        No bookings match your filters.
                      </td>
                    </tr>
                  ) : (
                    bookings.map((b) => (
                      <tr key={b.id} className="transition-colors hover:bg-white/[0.03]">
                        <td className="px-5 py-3">{b.vehicle?.name ?? '—'}</td>
                        <td className="px-5 py-3 text-on-surface-variant">{b.user?.displayName ?? '—'}</td>
                        <td className="px-5 py-3 text-on-surface-variant">{formatDate(b.startTime)}</td>
                        <td className="px-5 py-3 text-on-surface-variant">
                          {formatBookingWindow(b.startTime, b.endTime)}
                        </td>
                        <td className="px-5 py-3">
                          <Badge tone={bookingStatusTone[b.status]}>
                            {BOOKING_STATUS_LABELS[b.status]}
                          </Badge>
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex justify-end gap-2">
                            {b.status === 'CONFIRMED' && (
                              <>
                                <Button variant="outline" size="sm" onClick={() => setCancelTarget(b)}>
                                  Cancel
                                </Button>
                                <Button variant="secondary" size="sm" onClick={() => handleNoShow(b)}>
                                  No-show
                                </Button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
            </tbody>
          </table>
        </div>
      </GlassCard>

      <CancelBookingModal
        booking={cancelTarget}
        open={cancelTarget !== null}
        onClose={() => setCancelTarget(null)}
        onConfirm={handleCancel}
      />
    </div>
  )
}
