import { create } from 'zustand'
import type { User } from '../types'
import { api } from '../services/api'

interface AuthState {
  user: User | null
  /** True until the initial getCurrentUser() check resolves. */
  initializing: boolean
  signingIn: boolean
  signIn: (provider: 'google' | 'facebook') => Promise<User>
  signOut: () => Promise<void>
  init: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  initializing: true,
  signingIn: false,

  init: async () => {
    const user = await api.getCurrentUser()
    set({ user, initializing: false })
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
