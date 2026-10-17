import type { User } from '@/types'
import type { AuthResponse, LoginCredentials, RegisterData } from '@/types/auth'
import { apiClient } from '@/services/api/client'

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post('/api/auth/login', credentials)
    return response.data
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post('/api/auth/register', data)
    return response.data
  },

  async me(): Promise<User> {
    const response = await apiClient.get('/api/auth/me')
    return response.data.user
  },
}
