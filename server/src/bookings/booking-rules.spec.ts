import {
  overlaps,
  validateCreateBooking,
  validateCustomerCancellation,
  type BookingRuleSettings,
} from './booking-rules'

const settings: BookingRuleSettings = {
  maxAdvanceBookingDays: 7,
  maxActiveBookingsPerUser: 2,
  minHoursBeforeBooking: 24,
  cancellationWindowHours: 24,
}

const now = new Date('2026-06-11T12:00:00.000Z')

describe('overlaps', () => {
  it('detects partial overlap', () => {
    expect(overlaps(0, 10, 5, 15)).toBe(true)
  })

  it('detects cross-midnight overlap', () => {
    const evening = new Date('2026-06-12T14:00:00Z').getTime()
    const nextMorning = new Date('2026-06-13T02:00:00Z').getTime()
    const otherStart = new Date('2026-06-13T00:00:00Z').getTime()
    const otherEnd = new Date('2026-06-13T12:00:00Z').getTime()
    expect(overlaps(evening, nextMorning, otherStart, otherEnd)).toBe(true)
  })

  it('returns false for adjacent non-overlapping windows', () => {
    expect(overlaps(0, 10, 10, 20)).toBe(false)
  })
})

describe('validateCreateBooking', () => {
  const validStart = new Date('2026-06-13T06:00:00.000Z')

  it('accepts a valid booking', () => {
    expect(
      validateCreateBooking({
        startTime: validStart,
        now,
        settings,
        vehicleStatus: 'AVAILABLE',
        activeBookingCount: 0,
        existingWindows: [],
      }),
    ).toBeNull()
  })

  it('rejects unavailable vehicle', () => {
    expect(
      validateCreateBooking({
        startTime: validStart,
        now,
        settings,
        vehicleStatus: 'MAINTENANCE',
        activeBookingCount: 0,
        existingWindows: [],
      }),
    ).toBe('VEHICLE_NOT_AVAILABLE')
  })

  it('rejects same-day booking (min lead time)', () => {
    expect(
      validateCreateBooking({
        startTime: new Date('2026-06-11T18:00:00.000Z'),
        now,
        settings,
        vehicleStatus: 'AVAILABLE',
        activeBookingCount: 0,
        existingWindows: [],
      }),
    ).toBe('MIN_LEAD_TIME')
  })

  it('rejects booking beyond advance window', () => {
    expect(
      validateCreateBooking({
        startTime: new Date('2026-06-20T06:00:00.000Z'),
        now,
        settings,
        vehicleStatus: 'AVAILABLE',
        activeBookingCount: 0,
        existingWindows: [],
      }),
    ).toBe('MAX_ADVANCE_DAYS')
  })

  it('rejects when active booking cap reached', () => {
    expect(
      validateCreateBooking({
        startTime: validStart,
        now,
        settings,
        vehicleStatus: 'AVAILABLE',
        activeBookingCount: 2,
        existingWindows: [],
      }),
    ).toBe('ACTIVE_BOOKING_CAP')
  })

  it('rejects overlapping confirmed window', () => {
    const existingStart = new Date('2026-06-13T06:00:00.000Z')
    const existingEnd = new Date('2026-06-13T18:00:00.000Z')
    expect(
      validateCreateBooking({
        startTime: new Date('2026-06-13T10:00:00.000Z'),
        now,
        settings,
        vehicleStatus: 'AVAILABLE',
        activeBookingCount: 0,
        existingWindows: [{ startTime: existingStart, endTime: existingEnd }],
      }),
    ).toBe('OVERLAP')
  })
})

describe('validateCustomerCancellation', () => {
  it('allows cancel when outside window', () => {
    const start = new Date('2026-06-15T06:00:00.000Z')
    expect(
      validateCustomerCancellation({
        startTime: start,
        now,
        cancellationWindowHours: 24,
      }),
    ).toBe(true)
  })

  it('denies cancel within 24h of start', () => {
    const start = new Date('2026-06-12T06:00:00.000Z')
    expect(
      validateCustomerCancellation({
        startTime: start,
        now,
        cancellationWindowHours: 24,
      }),
    ).toBe(false)
  })
})
