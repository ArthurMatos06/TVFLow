import { create } from 'zustand'
import { authService } from '@/services/api/authService'
import type { User } from '@/types'
import type { LoginCredentials, RegisterData } from '@/types/auth'
import {
  clearAuthStorage,
  getStoredToken,
  getStoredUser,
  setStoredToken,
  setStoredUser,
} from '@/utils/auth'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isHydrated: boolean
  isLoading: boolean
  error: string | null
  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  hydrate: () => void
  clearError: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isHydrated: false,
  isLoading: false,
  error: null,

  login: async (credentials) => {
    set({ isLoading: true, error: null })
    try {
      const { user, token } = await authService.login(credentials)
      setStoredToken(token)
      setStoredUser(user)
      set({ user, token, isAuthenticated: true, isLoading: false })
    } catch (err) {
      set({
        isLoading: false,
        error: err instanceof Error ? err.message : 'Erro ao fazer login. Tente novamente.',
      })
    }
  },

  register: async (data) => {
    set({ isLoading: true, error: null })
    try {
      const { user, token } = await authService.register(data)
      setStoredToken(token)
      setStoredUser(user)
      set({ user, token, isAuthenticated: true, isLoading: false })
    } catch (err) {
      set({
        isLoading: false,
        error: err instanceof Error ? err.message : 'Erro ao criar conta. Tente novamente.',
      })
    }
  },

  logout: () => {
    clearAuthStorage()
    set({ user: null, token: null, isAuthenticated: false, error: null })
  },

  hydrate: () => {
    const token = getStoredToken()
    const user = getStoredUser()
    if (token && user) {
      set({ user, token, isAuthenticated: true })
    }
    set({ isHydrated: true })
  },

  clearError: () => set({ error: null }),
}))
