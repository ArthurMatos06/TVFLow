import { useAuthStore } from '@/store/authStore'

export function useAuth() {
  const user = useAuthStore((s) => s.user)
  const token = useAuthStore((s) => s.token)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const isHydrated = useAuthStore((s) => s.isHydrated)
  const isLoading = useAuthStore((s) => s.isLoading)
  const error = useAuthStore((s) => s.error)
  const login = useAuthStore((s) => s.login)
  const register = useAuthStore((s) => s.register)
  const logout = useAuthStore((s) => s.logout)
  const updateUser = useAuthStore((s) => s.updateUser)
  const hydrate = useAuthStore((s) => s.hydrate)
  const clearError = useAuthStore((s) => s.clearError)

  return {
    user,
    token,
    isAuthenticated,
    isHydrated,
    isLoading,
    error,
    login,
    register,
    logout,
    updateUser,
    hydrate,
    clearError,
  }
}
