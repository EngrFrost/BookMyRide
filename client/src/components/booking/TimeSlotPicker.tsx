import { useMemo } from 'react'
import type { AppSettings } from '../../types'
import type { BookedWindow } from '../../services/api'
import { Select } from '../ui'
import {
  addHours,
  buildStartDateTime,
  formatBookingWindow,
  formatTime,
  getAvailableStartHours,
} from '../../utils/dates'

export interface TimeSlotPickerProps {
  selectedDay: Date | null
  selectedHour: number | null
  bookedWindows: BookedWindow[]
  settings: AppSettings
  onHourChange: (hour: number) => void
}

function hourLabel(hour: number): string {
  const d = new Date(2000, 0, 1, hour, 0)
  return d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit', hour12: true })
}

export function TimeSlotPicker({
  selectedDay,
  selectedHour,
  bookedWindows,
  settings,
  onHourChange,
}: TimeSlotPickerProps) {
  const availableHours = useMemo(() => {
    if (!selectedDay) return []
    return getAvailableStartHours(selectedDay, bookedWindows, settings)
  }, [selectedDay, bookedWindows, settings])

  const windowPreview = useMemo(() => {
    if (!selectedDay || selectedHour === null) return null
    const start = buildStartDateTime(selectedDay, selectedHour)
    const end = addHours(start, 12)
    return formatBookingWindow(start.toISOString(), end.toISOString())
  }, [selectedDay, selectedHour])

  if (!selectedDay) {
    return (
      <div className="glass flex h-full min-h-[200px] items-center justify-center p-6 text-center">
        <p className="text-body-md text-on-surface-variant">Select a date to choose your start time.</p>
      </div>
    )
  }

  if (availableHours.length === 0) {
    return (
      <div className="glass flex h-full min-h-[200px] items-center justify-center p-6 text-center">
        <p className="text-body-md text-on-surface-variant">
          No available time slots on this date. Try another day.
        </p>
      </div>
    )
  }

  return (
    <div className="glass space-y-5 p-5">
      <Select
        label="Select start time"
        value={selectedHour !== null ? String(selectedHour) : ''}
        onChange={(e) => onHourChange(Number(e.target.value))}
        placeholder="Pick a time"
        options={availableHours.map((h) => ({
          value: String(h),
          label: hourLabel(h),
        }))}
      />

      {selectedHour !== null && (
        <div className="rounded-md border border-primary/30 bg-primary/10 p-4">
          <h4 className="text-label-md font-semibold text-primary">Your booking window</h4>
          <p className="mt-2 text-headline-sm text-on-surface">{windowPreview}</p>
          <p className="mt-2 text-label-sm text-on-surface-variant">
            Vehicle pickup at {formatTime(buildStartDateTime(selectedDay, selectedHour).toISOString())}.
            Return expected {formatTime(addHours(buildStartDateTime(selectedDay, selectedHour), 12).toISOString())}.
            A 12-hour rental window applies.
          </p>
        </div>
      )}
    </div>
  )
}
