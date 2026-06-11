import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../../services/api'
import type { AppSettings, Vehicle } from '../../types'
import type { BookedWindow } from '../../services/api'
import { useAuthStore } from '../../store/auth'
import { Button, toast } from '../ui'
import { AvailabilityCalendar } from './AvailabilityCalendar'
import { BookingConfirmationModal } from './BookingConfirmationModal'
import { TimeSlotPicker } from './TimeSlotPicker'
import { addHours, buildStartDateTime } from '../../utils/dates'

export interface BookingPanelProps {
  vehicle: Vehicle
}

export function BookingPanel({ vehicle }: BookingPanelProps) {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)
  const [selectedHour, setSelectedHour] = useState<number | null>(null)
  const [bookedWindows, setBookedWindows] = useState<BookedWindow[]>([])
  const [settings, setSettings] = useState<AppSettings | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const loadAvailability = useCallback(async () => {
    const from = new Date(year, month, 1)
    const to = new Date(year, month + 1, 0, 23, 59, 59)
    const windows = await api.getVehicleAvailability(vehicle.id, from.toISOString(), to.toISOString())
    setBookedWindows(windows)
  }, [vehicle.id, year, month])

  useEffect(() => {
    api.getSettings().then(setSettings)
  }, [])

  useEffect(() => {
    if (!settings) return
    void loadAvailability()
  }, [loadAvailability, settings])

  function handleDaySelect(day: Date) {
    setSelectedDay(day)
    setSelectedHour(null)
  }

  function handleMonthChange(y: number, m: number) {
    setYear(y)
    setMonth(m)
    setSelectedDay(null)
    setSelectedHour(null)
  }

  const startTime =
    selectedDay && selectedHour !== null
      ? buildStartDateTime(selectedDay, selectedHour).toISOString()
      : null
  const endTime = startTime ? addHours(new Date(startTime), 12).toISOString() : null

  async function handleConfirm() {
    if (!startTime || !user) return
    setSubmitting(true)
    try {
      await api.createBooking({ vehicleId: vehicle.id, startTime })
      toast.success('Booking confirmed!')
      setConfirmOpen(false)
      setSelectedDay(null)
      setSelectedHour(null)
      await loadAvailability()
      navigate('/my-bookings')
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Could not create booking.')
    } finally {
      setSubmitting(false)
    }
  }

  function handleBookClick() {
    if (!user) {
      navigate('/login', { state: { from: `/vehicles/${vehicle.id}` } })
      return
    }
    if (!startTime) {
      toast.error('Select a date and start time first.')
      return
    }
    setConfirmOpen(true)
  }

  if (!settings) {
    return <div className="mt-8 h-64 animate-pulse rounded-md bg-white/[0.06]" />
  }

  return (
    <>
      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <AvailabilityCalendar
          year={year}
          month={month}
          selected={selectedDay}
          bookedWindows={bookedWindows}
          settings={settings}
          onSelect={handleDaySelect}
          onMonthChange={handleMonthChange}
        />
        <TimeSlotPicker
          selectedDay={selectedDay}
          selectedHour={selectedHour}
          bookedWindows={bookedWindows}
          settings={settings}
          onHourChange={setSelectedHour}
        />
      </div>

      <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
        {!user && (
          <p className="text-label-sm text-on-surface-variant">
            <Link to="/login" state={{ from: `/vehicles/${vehicle.id}` }} className="text-primary hover:text-primary-light">
              Sign in
            </Link>{' '}
            to complete your booking.
          </p>
        )}
        <Button
          size="lg"
          className="sm:ml-auto"
          onClick={handleBookClick}
          disabled={!startTime}
        >
          {user ? 'Confirm booking' : 'Sign in to book'}
        </Button>
      </div>

      {startTime && endTime && (
        <BookingConfirmationModal
          open={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          onConfirm={handleConfirm}
          loading={submitting}
          vehicle={vehicle}
          startTime={startTime}
          endTime={endTime}
        />
      )}
    </>
  )
}
