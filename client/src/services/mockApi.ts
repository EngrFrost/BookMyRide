import type {
  AdminStats,
  Api,
  BookingFilters,
  BookedWindow,
  CreateBookingInput,
  VehicleFilters,
} from './api'
import type { AppSettings, Booking, User, Vehicle } from '../types'
import { mockUsers } from '../mocks/users'
import { mockVehicles } from '../mocks/vehicles'
import { mockBookings, mockSettings } from '../mocks/bookings'

const STORAGE_KEY = 'va-mock-state-v1'
const LATENCY_MS = 250

interface MockState {
  currentUserId: string | null
  users: User[]
  vehicles: Vehicle[]
  bookings: Booking[]
  settings: AppSettings
}

function defaultState(): MockState {
  return {
    currentUserId: null,
    users: structuredClone(mockUsers),
    vehicles: structuredClone(mockVehicles),
    bookings: structuredClone(mockBookings),
    settings: structuredClone(mockSettings),
  }
}

function loadState(): MockState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as MockState
  } catch {
    // corrupted state — fall through to defaults
  }
  return defaultState()
}

let state = loadState()

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), LATENCY_MS))
}

function fail(message: string): never {
  throw new Error(message)
}

export class ApiError extends Error {}

function requireUser(): User {
  const user = state.users.find((u) => u.id === state.currentUserId)
  if (!user) fail('Not signed in.')
  return user
}

function withRelations(booking: Booking): Booking {
  return {
    ...booking,
    vehicle: state.vehicles.find((v) => v.id === booking.vehicleId),
    user: state.users.find((u) => u.id === booking.userId),
  }
}

const HOUR_MS = 60 * 60 * 1000
const BOOKING_DURATION_MS = 12 * HOUR_MS

function overlaps(aStart: number, aEnd: number, bStart: number, bEnd: number): boolean {
  return aStart < bEnd && bStart < aEnd
}

/** Booking rule validation — mirrors what the NestJS backend will enforce in Phase 5. */
function validateBooking(input: CreateBookingInput, user: User): void {
  const { settings, bookings, vehicles } = state
  const vehicle = vehicles.find((v) => v.id === input.vehicleId) ?? fail('Vehicle not found.')
  if (vehicle.status !== 'AVAILABLE') fail(`${vehicle.name} is not available for booking.`)

  const start = new Date(input.startTime).getTime()
  if (Number.isNaN(start)) fail('Invalid start time.')
  const end = start + BOOKING_DURATION_MS
  const now = Date.now()

  if (start - now < settings.minHoursBeforeBooking * HOUR_MS) {
    fail(`Bookings must be made at least ${settings.minHoursBeforeBooking} hours in advance.`)
  }
  if (start - now > settings.maxAdvanceBookingDays * 24 * HOUR_MS) {
    fail(`Bookings can only be made up to ${settings.maxAdvanceBookingDays} days in advance.`)
  }

  const activeForUser = bookings.filter(
    (b) => b.userId === user.id && b.status === 'CONFIRMED' && new Date(b.endTime).getTime() > now,
  )
  if (activeForUser.length >= settings.maxActiveBookingsPerUser) {
    fail(`You can only have ${settings.maxActiveBookingsPerUser} active bookings at a time.`)
  }

  const conflict = bookings.find(
    (b) =>
      b.vehicleId === input.vehicleId &&
      b.status === 'CONFIRMED' &&
      overlaps(start, end, new Date(b.startTime).getTime(), new Date(b.endTime).getTime()),
  )
  if (conflict) fail('This vehicle is already booked for an overlapping time window.')
}

export const mockApi: Api = {
  // --- Auth (mock) -------------------------------------------------------
  // Demo mapping: Google signs in the customer fixture, Facebook the admin
  // fixture, so both roles are reachable without a real backend.
  async signIn(provider) {
    const user =
      provider === 'facebook'
        ? state.users.find((u) => u.role === 'ADMIN')!
        : state.users.find((u) => u.role === 'CUSTOMER' && u.isActive)!
    state.currentUserId = user.id
    persist()
    return delay(user)
  },

  async signOut() {
    state.currentUserId = null
    persist()
    return delay(undefined)
  },

  async getCurrentUser() {
    return delay(state.users.find((u) => u.id === state.currentUserId) ?? null)
  },

  // --- Vehicles ----------------------------------------------------------
  async listVehicles(filters?: VehicleFilters) {
    let result = [...state.vehicles]
    if (filters?.category) result = result.filter((v) => v.category === filters.category)
    if (filters?.search) {
      const q = filters.search.toLowerCase()
      result = result.filter(
        (v) => v.name.toLowerCase().includes(q) || v.description?.toLowerCase().includes(q),
      )
    }
    return delay(result)
  },

  async getVehicle(id) {
    return delay(state.vehicles.find((v) => v.id === id) ?? fail('Vehicle not found.'))
  },

  async createVehicle(input) {
    const now = new Date().toISOString()
    const vehicle: Vehicle = { ...input, id: `veh-${crypto.randomUUID()}`, createdAt: now, updatedAt: now }
    state.vehicles.push(vehicle)
    persist()
    return delay(vehicle)
  },

  async updateVehicle(id, input) {
    const vehicle = state.vehicles.find((v) => v.id === id) ?? fail('Vehicle not found.')
    Object.assign(vehicle, input, { updatedAt: new Date().toISOString() })
    persist()
    return delay({ ...vehicle })
  },

  async deleteVehicle(id) {
    state.vehicles = state.vehicles.filter((v) => v.id !== id)
    persist()
    return delay(undefined)
  },

  // --- Bookings ----------------------------------------------------------
  async createBooking(input) {
    const user = requireUser()
    validateBooking(input, user)
    const start = new Date(input.startTime)
    const end = new Date(start.getTime() + BOOKING_DURATION_MS)
    const bookingDate = new Date(start)
    bookingDate.setHours(0, 0, 0, 0)
    const now = new Date().toISOString()
    const booking: Booking = {
      id: `bkg-${crypto.randomUUID()}`,
      userId: user.id,
      vehicleId: input.vehicleId,
      bookingDate: bookingDate.toISOString(),
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      status: 'CONFIRMED',
      cancellationReason: null,
      cancelledBy: null,
      createdAt: now,
      updatedAt: now,
    }
    state.bookings.push(booking)
    persist()
    return delay(withRelations(booking))
  },

  async listMyBookings() {
    const user = requireUser()
    const result = state.bookings
      .filter((b) => b.userId === user.id)
      .sort((a, b) => b.startTime.localeCompare(a.startTime))
      .map(withRelations)
    return delay(result)
  },

  async listAllBookings(filters?: BookingFilters) {
    let result = [...state.bookings]
    if (filters?.status) result = result.filter((b) => b.status === filters.status)
    if (filters?.vehicleId) result = result.filter((b) => b.vehicleId === filters.vehicleId)
    if (filters?.date) {
      const day = new Date(filters.date).toDateString()
      result = result.filter((b) => new Date(b.startTime).toDateString() === day)
    }
    return delay(result.sort((a, b) => b.startTime.localeCompare(a.startTime)).map(withRelations))
  },

  async cancelBooking(id, reason) {
    const user = requireUser()
    const booking = state.bookings.find((b) => b.id === id) ?? fail('Booking not found.')
    if (booking.status !== 'CONFIRMED') fail('Only confirmed bookings can be cancelled.')

    const isAdmin = user.role === 'ADMIN'
    if (!isAdmin) {
      if (booking.userId !== user.id) fail('You can only cancel your own bookings.')
      const hoursUntilStart = (new Date(booking.startTime).getTime() - Date.now()) / HOUR_MS
      if (hoursUntilStart < state.settings.cancellationWindowHours) {
        fail(
          `Bookings can only be cancelled up to ${state.settings.cancellationWindowHours} hours before the start time.`,
        )
      }
    }

    booking.status = 'CANCELLED'
    booking.cancelledBy = isAdmin ? 'ADMIN' : 'CUSTOMER'
    booking.cancellationReason = reason ?? null
    booking.updatedAt = new Date().toISOString()
    persist()
    return delay(withRelations({ ...booking }))
  },

  async markNoShow(id) {
    const booking = state.bookings.find((b) => b.id === id) ?? fail('Booking not found.')
    booking.status = 'NO_SHOW'
    booking.updatedAt = new Date().toISOString()
    persist()
    return delay(withRelations({ ...booking }))
  },

  async getVehicleAvailability(vehicleId, from, to) {
    const fromMs = new Date(from).getTime()
    const toMs = new Date(to).getTime()
    const windows: BookedWindow[] = state.bookings
      .filter(
        (b) =>
          b.vehicleId === vehicleId &&
          b.status === 'CONFIRMED' &&
          overlaps(fromMs, toMs, new Date(b.startTime).getTime(), new Date(b.endTime).getTime()),
      )
      .map((b) => ({ startTime: b.startTime, endTime: b.endTime }))
    return delay(windows)
  },

  // --- Users (admin) -----------------------------------------------------
  async listUsers() {
    return delay([...state.users])
  },

  async updateUserRole(id, role) {
    const user = state.users.find((u) => u.id === id) ?? fail('User not found.')
    user.role = role
    user.updatedAt = new Date().toISOString()
    persist()
    return delay({ ...user })
  },

  async setUserActive(id, isActive) {
    const user = state.users.find((u) => u.id === id) ?? fail('User not found.')
    user.isActive = isActive
    user.updatedAt = new Date().toISOString()
    persist()
    return delay({ ...user })
  },

  // --- Settings ----------------------------------------------------------
  async getSettings() {
    return delay({ ...state.settings })
  },

  async updateSettings(input) {
    Object.assign(state.settings, input)
    persist()
    return delay({ ...state.settings })
  },

  // --- Admin stats -------------------------------------------------------
  async getAdminStats(): Promise<AdminStats> {
    const now = Date.now()
    const today = new Date().toDateString()
    const days: { date: string; count: number }[] = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const key = d.toDateString()
      days.push({
        date: d.toISOString().slice(0, 10),
        count: state.bookings.filter((b) => new Date(b.startTime).toDateString() === key).length,
      })
    }
    return delay({
      todaysBookings: state.bookings.filter((b) => new Date(b.startTime).toDateString() === today).length,
      upcomingBookings: state.bookings.filter(
        (b) => b.status === 'CONFIRMED' && new Date(b.startTime).getTime() > now,
      ).length,
      activeVehicles: state.vehicles.filter((v) => v.status === 'AVAILABLE').length,
      totalUsers: state.users.length,
      bookingsPerDay: days,
    })
  },
}

/** Dev helper: wipe persisted mock state (call from console: `window.__resetMockState()`). */
declare global {
  interface Window {
    __resetMockState?: () => void
  }
}
window.__resetMockState = () => {
  localStorage.removeItem(STORAGE_KEY)
  state = defaultState()
  location.reload()
}
