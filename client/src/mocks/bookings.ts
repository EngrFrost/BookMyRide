import type { AppSettings, Booking } from '../types'

function isoAtHour(daysFromNow: number, hour: number): string {
  const d = new Date()
  d.setDate(d.getDate() + daysFromNow)
  d.setHours(hour, 0, 0, 0)
  return d.toISOString()
}

function dateOnly(daysFromNow: number): string {
  const d = new Date()
  d.setDate(d.getDate() + daysFromNow)
  d.setHours(0, 0, 0, 0)
  return d.toISOString()
}

const now = new Date().toISOString()

export const mockSettings: AppSettings = {
  maxAdvanceBookingDays: 7,
  maxActiveBookingsPerUser: 2,
  minHoursBeforeBooking: 24,
  cancellationWindowHours: 24,
}

export const mockBookings: Booking[] = [
  // Upcoming, owned by the demo customer
  {
    id: 'bkg-1',
    userId: 'user-customer-1',
    vehicleId: 'veh-vios-1',
    bookingDate: dateOnly(2),
    startTime: isoAtHour(2, 6),
    endTime: isoAtHour(2, 18),
    status: 'CONFIRMED',
    cancellationReason: null,
    cancelledBy: null,
    createdAt: now,
    updatedAt: now,
  },
  // Upcoming, other customer, spans midnight
  {
    id: 'bkg-2',
    userId: 'user-customer-2',
    vehicleId: 'veh-innova-1',
    bookingDate: dateOnly(3),
    startTime: isoAtHour(3, 14),
    endTime: isoAtHour(4, 2),
    status: 'CONFIRMED',
    cancellationReason: null,
    cancelledBy: null,
    createdAt: now,
    updatedAt: now,
  },
  // Past, completed
  {
    id: 'bkg-3',
    userId: 'user-customer-1',
    vehicleId: 'veh-nmax-1',
    bookingDate: dateOnly(-5),
    startTime: isoAtHour(-5, 8),
    endTime: isoAtHour(-5, 20),
    status: 'COMPLETED',
    cancellationReason: null,
    cancelledBy: null,
    createdAt: now,
    updatedAt: now,
  },
  // Cancelled by admin with reason
  {
    id: 'bkg-4',
    userId: 'user-customer-2',
    vehicleId: 'veh-avanza-1',
    bookingDate: dateOnly(-2),
    startTime: isoAtHour(-2, 10),
    endTime: isoAtHour(-2, 22),
    status: 'CANCELLED',
    cancellationReason: 'Vehicle required emergency maintenance.',
    cancelledBy: 'ADMIN',
    createdAt: now,
    updatedAt: now,
  },
  // Past no-show
  {
    id: 'bkg-5',
    userId: 'user-customer-3',
    vehicleId: 'veh-click-1',
    bookingDate: dateOnly(-7),
    startTime: isoAtHour(-7, 9),
    endTime: isoAtHour(-7, 21),
    status: 'NO_SHOW',
    cancellationReason: null,
    cancelledBy: null,
    createdAt: now,
    updatedAt: now,
  },
]
