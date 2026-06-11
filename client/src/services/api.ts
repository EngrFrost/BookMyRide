import type {
  AppSettings,
  Booking,
  BookingStatus,
  User,
  Vehicle,
  VehicleCategory,
} from '../types'

/**
 * The single data contract for the whole app.
 *
 * Phases 0-3: implemented by `mockApi.ts` (in-memory fixtures + localStorage).
 * Phase 6: implemented by `httpApi.ts` against the real NestJS backend.
 * Pages and components must only ever import `api` from this module.
 */
export interface VehicleFilters {
  category?: VehicleCategory
  search?: string
}

export interface BookingFilters {
  status?: BookingStatus
  vehicleId?: string
  date?: string // ISO date
}

export interface CreateBookingInput {
  vehicleId: string
  startTime: string // ISO datetime; endTime derived (+12h)
}

export interface BookedWindow {
  startTime: string
  endTime: string
}

export interface AdminStats {
  todaysBookings: number
  upcomingBookings: number
  activeVehicles: number
  totalUsers: number
  bookingsPerDay: { date: string; count: number }[]
}

export interface Api {
  // Auth (mocked until Phase 6)
  signIn(provider: 'google' | 'facebook'): Promise<User>
  signOut(): Promise<void>
  getCurrentUser(): Promise<User | null>

  // Vehicles
  listVehicles(filters?: VehicleFilters): Promise<Vehicle[]>
  getVehicle(id: string): Promise<Vehicle>
  createVehicle(input: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>): Promise<Vehicle>
  updateVehicle(id: string, input: Partial<Omit<Vehicle, 'id'>>): Promise<Vehicle>
  deleteVehicle(id: string): Promise<void>

  // Bookings
  createBooking(input: CreateBookingInput): Promise<Booking>
  listMyBookings(): Promise<Booking[]>
  listAllBookings(filters?: BookingFilters): Promise<Booking[]>
  cancelBooking(id: string, reason?: string): Promise<Booking>
  markNoShow(id: string): Promise<Booking>
  getVehicleAvailability(vehicleId: string, from: string, to: string): Promise<BookedWindow[]>

  // Users (admin)
  listUsers(): Promise<User[]>
  updateUserRole(id: string, role: User['role']): Promise<User>
  setUserActive(id: string, isActive: boolean): Promise<User>

  // Settings
  getSettings(): Promise<AppSettings>
  updateSettings(input: Partial<AppSettings>): Promise<AppSettings>

  // Admin stats
  getAdminStats(): Promise<AdminStats>
}

import { mockApi } from './mockApi'

// Phase 6 will switch on import.meta.env.VITE_USE_MOCK
export const api: Api = mockApi
