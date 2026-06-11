import type {
  AppSettings,
  Booking,
  BookingStatus,
  User,
  Vehicle,
  VehicleCategory,
} from '../types'
import { isMockMode } from './config'
import { mockApi } from './mockApi'
import { httpApi } from './httpApi'

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
  signIn(provider: 'google' | 'facebook'): Promise<User>
  signOut(): Promise<void>
  getCurrentUser(): Promise<User | null>

  listVehicles(filters?: VehicleFilters): Promise<Vehicle[]>
  getVehicle(id: string): Promise<Vehicle>
  createVehicle(input: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>): Promise<Vehicle>
  updateVehicle(id: string, input: Partial<Omit<Vehicle, 'id'>>): Promise<Vehicle>
  deleteVehicle(id: string): Promise<void>

  createBooking(input: CreateBookingInput): Promise<Booking>
  listMyBookings(): Promise<Booking[]>
  listAllBookings(filters?: BookingFilters): Promise<Booking[]>
  cancelBooking(id: string, reason?: string): Promise<Booking>
  markNoShow(id: string): Promise<Booking>
  getVehicleAvailability(vehicleId: string, from: string, to: string): Promise<BookedWindow[]>

  listUsers(): Promise<User[]>
  updateUserRole(id: string, role: User['role']): Promise<User>
  setUserActive(id: string, isActive: boolean): Promise<User>

  getSettings(): Promise<AppSettings>
  updateSettings(input: Partial<AppSettings>): Promise<AppSettings>

  getAdminStats(): Promise<AdminStats>
}

export const api: Api = isMockMode() ? mockApi : httpApi
