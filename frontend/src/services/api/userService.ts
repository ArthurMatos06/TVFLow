import type { User } from '@/types'
import type { UpdateProfileInput } from '@/types/user'
import { apiClient } from './client'

export const userService = {
  async getProfile(): Promise<User> {
    const response = await apiClient.get<{ user: User }>('/api/auth/me')
    return response.data.user
  },

  async updateProfile(data: UpdateProfileInput): Promise<User> {
    const response = await apiClient.put<User>('/api/profile', data)
    return response.data
  },

  async uploadAvatar(file: File): Promise<User> {
    const formData = new FormData()
    formData.append('file', file)

    const response = await apiClient.post<User>('/api/profile/avatar', formData)
    return response.data
  },
}
