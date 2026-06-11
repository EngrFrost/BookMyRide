import { create } from 'zustand'
import type { User } from '../types'
import { api } from '../services/api'
import { isMockMode } from '../services/config'
import { isFirebaseConfigured, subscribeToAuth } from '../services/firebase'

interface AuthState {
  user: User | null
  initializing: boolean
  signingIn: boolean
  signIn: (provider: 'google' | 'facebook') => Promise<User>
  signOut: () => Promise<void>
  init: () => Promise<void>
}

let authUnsubscribe: (() => void) | null = null

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  initializing: true,
  signingIn: false,

  init: async () => {
    if (isMockMode()) {
      const user = await api.getCurrentUser()
      set({ user, initializing: false })
      return
    }

    if (!isFirebaseConfigured()) {
      set({ initializing: false })
      return
    }

    authUnsubscribe?.()
    await new Promise<void>((resolve) => {
      let settled = false
      authUnsubscribe = subscribeToAuth(async () => {
        try {
          const user = await api.getCurrentUser()
          set({ user })
        } catch {
          set({ user: null })
        }
        if (!settled) {
          settled = true
          set({ initializing: false })
          resolve()
        }
      })
    })
  },

  signIn: async (provider) => {
    set({ signingIn: true })
    try {
      const user = await api.signIn(provider)
      set({ user })
      return user
    } finally {
      set({ signingIn: false })
    }
  },

  signOut: async () => {
    await api.signOut()
    set({ user: null })
  },
}))
