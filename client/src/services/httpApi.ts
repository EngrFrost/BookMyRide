import type {
  Api,
  AdminStats,
  BookingFilters,
  CreateBookingInput,
} from './api'
import type { AppSettings, Booking, User, Vehicle } from '../types'
import { request } from './httpClient'
import {
  isFirebaseConfigured,
  signInWithProvider,
  signOutFirebase,
  getIdToken,
} from './firebase'
import { apiBaseUrl } from './config'

type SettingsRow = AppSettings & { id: string }

function toAppSettings(row: SettingsRow): AppSettings {
  return {
    maxAdvanceBookingDays: row.maxAdvanceBookingDays,
    maxActiveBookingsPerUser: row.maxActiveBookingsPerUser,
    minHoursBeforeBooking: row.minHoursBeforeBooking,
    cancellationWindowHours: row.cancellationWindowHours,
  }
}

function toUser(row: Record<string, unknown>): User {
  return row as unknown as User
}

function toBooking(row: Record<string, unknown>): Booking {
  return row as unknown as Booking
}

function toVehicle(row: Record<string, unknown>): Vehicle {
  return row as unknown as Vehicle
}

function queryString(params: Record<string, string | undefined>): string {
  const qs = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') qs.set(key, value)
  }
  const s = qs.toString()
  return s ? `?${s}` : ''
}

export const httpApi: Api = {
  async signIn(provider) {
    if (!isFirebaseConfigured()) {
      throw new Error('Firebase is not configured. Set VITE_FIREBASE_* env vars or use VITE_USE_MOCK=true.')
    }
    await signInWithProvider(provider)
    const user = await this.getCurrentUser()
    if (!user) throw new Error('Sign-in succeeded but user profile was not created.')
    return user
  },

  async signOut() {
    await signOutFirebase()
  },

  async getCurrentUser() {
    if (!isFirebaseConfigured()) return null
    const token = await getIdToken()
    if (!token) return null
    try {
      const row = await request<Record<string, unknown>>('/users/me')
      return toUser(row)
    } catch {
      return null
    }
  },

  async listVehicles(filters) {
    const qs = queryString({
      category: filters?.category,
      search: filters?.search,
    })
    const rows = await request<Record<string, unknown>[]>(`/vehicles${qs}`)
    return rows.map(toVehicle)
  },

  async getVehicle(id) {
    const row = await request<Record<string, unknown>>(`/vehicles/${id}`)
    return toVehicle(row)
  },

  async createVehicle(input) {
    const row = await request<Record<string, unknown>>('/vehicles', {
      method: 'POST',
      body: JSON.stringify(input),
      auth: true,
    })
    return toVehicle(row)
  },

  async updateVehicle(id, input) {
    const row = await request<Record<string, unknown>>(`/vehicles/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
      auth: true,
    })
    return toVehicle(row)
  },

  async deleteVehicle(id) {
    await request(`/vehicles/${id}`, { method: 'DELETE', auth: true })
  },

  async createBooking(input: CreateBookingInput) {
    const row = await request<Record<string, unknown>>('/bookings', {
      method: 'POST',
      body: JSON.stringify(input),
      auth: true,
    })
    return toBooking(row)
  },

  async listMyBookings() {
    const rows = await request<Record<string, unknown>[]>('/bookings/me', { auth: true })
    return rows.map(toBooking)
  },

  async listAllBookings(filters?: BookingFilters) {
    const qs = queryString({
      status: filters?.status,
      vehicleId: filters?.vehicleId,
      date: filters?.date,
    })
    const rows = await request<Record<string, unknown>[]>(`/bookings${qs}`, { auth: true })
    return rows.map(toBooking)
  },

  async cancelBooking(id, reason) {
    const row = await request<Record<string, unknown>>(`/bookings/${id}/cancel`, {
      method: 'PATCH',
      body: JSON.stringify({ reason }),
      auth: true,
    })
    return toBooking(row)
  },

  async markNoShow(id) {
    const row = await request<Record<string, unknown>>(`/bookings/${id}/no-show`, {
      method: 'PATCH',
      auth: true,
    })
    return toBooking(row)
  },

  async getVehicleAvailability(vehicleId, from, to) {
    const qs = queryString({ from, to })
    return request(`/vehicles/${vehicleId}/availability${qs}`)
  },

  async listUsers() {
    const rows = await request<Record<string, unknown>[]>('/users', { auth: true })
    return rows.map(toUser)
  },

  async updateUserRole(id, role) {
    const row = await request<Record<string, unknown>>(`/users/${id}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
      auth: true,
    })
    return toUser(row)
  },

  async setUserActive(id, isActive) {
    const row = await request<Record<string, unknown>>(`/users/${id}/active`, {
      method: 'PATCH',
      body: JSON.stringify({ isActive }),
      auth: true,
    })
    return toUser(row)
  },

  async getSettings() {
    const row = await request<SettingsRow>('/settings')
    return toAppSettings(row)
  },

  async updateSettings(input) {
    const row = await request<SettingsRow>('/settings', {
      method: 'PATCH',
      body: JSON.stringify(input),
      auth: true,
    })
    return toAppSettings(row)
  },

  async getAdminStats() {
    return request<AdminStats>('/admin/stats', { auth: true })
  },
}

/** Resolve relative upload paths against the API origin. */
export function resolveAssetUrl(url: string | null | undefined): string | undefined {
  if (!url) return undefined
  if (url.startsWith('http') || url.startsWith('//')) return url
  const base = apiBaseUrl()
  return base ? `${base}${url}` : url
}
