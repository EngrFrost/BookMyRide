import type { BookedWindow } from '../services/api'
import type { AppSettings } from '../types'

const HOUR_MS = 60 * 60 * 1000
const BOOKING_DURATION_MS = 12 * HOUR_MS

export function overlaps(aStart: number, aEnd: number, bStart: number, bEnd: number): boolean {
  return aStart < bEnd && bStart < aEnd
}

export function startOfDay(date: Date): Date {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

export function endOfDay(date: Date): Date {
  const d = new Date(date)
  d.setHours(23, 59, 59, 999)
  return d
}

export function isSameDay(a: Date, b: Date): boolean {
  return a.toDateString() === b.toDateString()
}

export function addHours(date: Date, hours: number): Date {
  return new Date(date.getTime() + hours * HOUR_MS)
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

/** e.g. "6:00 AM – 6:00 PM" or "2:00 PM – 2:00 AM (+1 day)" */
export function formatBookingWindow(startIso: string, endIso: string): string {
  const start = new Date(startIso)
  const end = new Date(endIso)
  const nextDay = !isSameDay(start, end)
  const endLabel = nextDay ? `${formatTime(endIso)} (+1 day)` : formatTime(endIso)
  return `${formatTime(startIso)} – ${endLabel}`
}

export function buildStartDateTime(day: Date, hour: number): Date {
  const d = startOfDay(day)
  d.setHours(hour, 0, 0, 0)
  return d
}

export type DayStatus = 'disabled' | 'full' | 'partial' | 'free'

export function getAvailableStartHours(
  day: Date,
  bookedWindows: BookedWindow[],
  settings: AppSettings,
  now = new Date(),
): number[] {
  const hours: number[] = []
  for (let hour = 0; hour < 24; hour++) {
    const start = buildStartDateTime(day, hour)
    const startMs = start.getTime()
    const endMs = startMs + BOOKING_DURATION_MS

    if (startMs - now.getTime() < settings.minHoursBeforeBooking * HOUR_MS) continue
    if (startMs - now.getTime() > settings.maxAdvanceBookingDays * 24 * HOUR_MS) continue

    const conflict = bookedWindows.some((w) =>
      overlaps(startMs, endMs, new Date(w.startTime).getTime(), new Date(w.endTime).getTime()),
    )
    if (!conflict) hours.push(hour)
  }
  return hours
}

export function getDayStatus(
  day: Date,
  bookedWindows: BookedWindow[],
  settings: AppSettings,
  now = new Date(),
): DayStatus {
  const dayStart = startOfDay(day).getTime()
  const dayEnd = endOfDay(day).getTime()
  const earliest = now.getTime() + settings.minHoursBeforeBooking * HOUR_MS
  const latest = now.getTime() + settings.maxAdvanceBookingDays * 24 * HOUR_MS

  if (dayEnd < earliest || dayStart > latest) return 'disabled'

  const available = getAvailableStartHours(day, bookedWindows, settings, now)
  if (available.length === 0) return 'full'

  const hasBookingOnDay = bookedWindows.some((w) => {
    const wStart = new Date(w.startTime).getTime()
    const wEnd = new Date(w.endTime).getTime()
    return overlaps(dayStart, dayEnd + 1, wStart, wEnd)
  })

  return hasBookingOnDay ? 'partial' : 'free'
}

export function getCalendarDays(year: number, month: number): (Date | null)[] {
  const first = new Date(year, month, 1)
  const last = new Date(year, month + 1, 0)
  // Monday-first grid
  const startPad = (first.getDay() + 6) % 7
  const days: (Date | null)[] = Array.from({ length: startPad }, () => null)
  for (let d = 1; d <= last.getDate(); d++) {
    days.push(new Date(year, month, d))
  }
  while (days.length % 7 !== 0) days.push(null)
  return days
}

export function monthLabel(year: number, month: number): string {
  return new Date(year, month, 1).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
}
