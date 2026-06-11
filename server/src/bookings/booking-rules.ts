import { BOOKING_DURATION_MS, HOUR_MS } from '../common/constants'

export interface BookingRuleSettings {
  maxAdvanceBookingDays: number
  maxActiveBookingsPerUser: number
  minHoursBeforeBooking: number
  cancellationWindowHours: number
}

export interface ExistingBookingWindow {
  startTime: Date
  endTime: Date
}

export function overlaps(
  aStart: number,
  aEnd: number,
  bStart: number,
  bEnd: number,
): boolean {
  return aStart < bEnd && bStart < aEnd
}

export function computeBookingEnd(startTime: Date): Date {
  return new Date(startTime.getTime() + BOOKING_DURATION_MS)
}

export function computeBookingDate(startTime: Date): Date {
  const d = new Date(startTime)
  d.setHours(0, 0, 0, 0)
  return d
}

export type BookingValidationError =
  | 'INVALID_START_TIME'
  | 'VEHICLE_NOT_AVAILABLE'
  | 'MIN_LEAD_TIME'
  | 'MAX_ADVANCE_DAYS'
  | 'ACTIVE_BOOKING_CAP'
  | 'OVERLAP'

export function validateCreateBooking(params: {
  startTime: Date
  now?: Date
  settings: BookingRuleSettings
  vehicleStatus: string
  activeBookingCount: number
  existingWindows: ExistingBookingWindow[]
}): BookingValidationError | null {
  const now = params.now ?? new Date()
  const startMs = params.startTime.getTime()
  if (Number.isNaN(startMs)) return 'INVALID_START_TIME'

  if (params.vehicleStatus !== 'AVAILABLE') return 'VEHICLE_NOT_AVAILABLE'

  const endMs = startMs + BOOKING_DURATION_MS

  if (startMs - now.getTime() < params.settings.minHoursBeforeBooking * HOUR_MS) {
    return 'MIN_LEAD_TIME'
  }
  if (startMs - now.getTime() > params.settings.maxAdvanceBookingDays * 24 * HOUR_MS) {
    return 'MAX_ADVANCE_DAYS'
  }
  if (params.activeBookingCount >= params.settings.maxActiveBookingsPerUser) {
    return 'ACTIVE_BOOKING_CAP'
  }

  const hasOverlap = params.existingWindows.some((b) =>
    overlaps(startMs, endMs, b.startTime.getTime(), b.endTime.getTime()),
  )
  if (hasOverlap) return 'OVERLAP'

  return null
}

export function validateCustomerCancellation(params: {
  startTime: Date
  now?: Date
  cancellationWindowHours: number
}): boolean {
  const now = params.now ?? new Date()
  const hoursUntilStart =
    (params.startTime.getTime() - now.getTime()) / HOUR_MS
  return hoursUntilStart >= params.cancellationWindowHours
}

export function bookingValidationMessage(code: BookingValidationError, settings: BookingRuleSettings): string {
  switch (code) {
    case 'INVALID_START_TIME':
      return 'Invalid start time.'
    case 'VEHICLE_NOT_AVAILABLE':
      return 'Vehicle is not available for booking.'
    case 'MIN_LEAD_TIME':
      return `Bookings must be made at least ${settings.minHoursBeforeBooking} hours in advance.`
    case 'MAX_ADVANCE_DAYS':
      return `Bookings can only be made up to ${settings.maxAdvanceBookingDays} days in advance.`
    case 'ACTIVE_BOOKING_CAP':
      return `You can only have ${settings.maxActiveBookingsPerUser} active bookings at a time.`
    case 'OVERLAP':
      return 'This vehicle is already booked for an overlapping time window.'
  }
}
