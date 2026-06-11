// Domain types mirroring the Prisma schema in SPECS.md.
// These are the contract between UI, mock API (Phases 0-3) and the real API (Phase 6).

export type Role = 'CUSTOMER' | 'ADMIN'

export type VehicleCategory = 'BIKE' | 'FOUR_SEATER' | 'SEVEN_SEATER'

export type VehicleStatus = 'AVAILABLE' | 'MAINTENANCE' | 'RETIRED'

export type BookingStatus = 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW'

export type CancelledBy = 'CUSTOMER' | 'ADMIN'

export interface User {
  id: string
  firebaseUid: string
  email: string
  displayName: string
  photoUrl?: string | null
  role: Role
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Vehicle {
  id: string
  name: string
  category: VehicleCategory
  description?: string | null
  imageUrl?: string | null
  status: VehicleStatus
  createdAt: string
  updatedAt: string
}

export interface Booking {
  id: string
  userId: string
  vehicleId: string
  bookingDate: string // ISO date of the booking's calendar date
  startTime: string // ISO datetime
  endTime: string // ISO datetime (startTime + 12h)
  status: BookingStatus
  cancellationReason?: string | null
  cancelledBy?: CancelledBy | null
  createdAt: string
  updatedAt: string
  // Denormalized for UI convenience (populated by API layer)
  vehicle?: Vehicle
  user?: User
}

export interface AppSettings {
  maxAdvanceBookingDays: number
  maxActiveBookingsPerUser: number
  minHoursBeforeBooking: number
  cancellationWindowHours: number
}

export const VEHICLE_CATEGORY_LABELS: Record<VehicleCategory, string> = {
  BIKE: 'Bike',
  FOUR_SEATER: '4-Seater',
  SEVEN_SEATER: '7-Seater',
}

export const VEHICLE_STATUS_LABELS: Record<VehicleStatus, string> = {
  AVAILABLE: 'Available',
  MAINTENANCE: 'Maintenance',
  RETIRED: 'Retired',
}

export const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
  CONFIRMED: 'Confirmed',
  CANCELLED: 'Cancelled',
  COMPLETED: 'Completed',
  NO_SHOW: 'No Show',
}
