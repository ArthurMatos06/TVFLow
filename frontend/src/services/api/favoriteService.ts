import type { Favorite, MediaType } from '@/types'
import { apiClient } from './client'

interface AddFavoriteInput {
  mediaId: number;
  mediaType: MediaType;
}

export const favoriteService = {
  async getFavorites(): Promise<Favorite[]> {
    const response = await apiClient.get<Favorite[]>('/api/favorites')
    return response.data
  },

  async addFavorite({ mediaId, mediaType }: AddFavoriteInput): Promise<Favorite> {
    const response = await apiClient.post<Favorite>('/api/favorites', {
      mediaId,
      mediaType: mediaType.toUpperCase(),
    })
    return response.data
  },

  async removeFavorite(mediaId: number): Promise<void> {
    await apiClient.delete(`/api/favorites/${mediaId}`)
  },

  async isFavorite(mediaId: number): Promise<boolean> {
    const response = await apiClient.get<{ isFavorite: boolean }>(`/api/favorites/${mediaId}`)
    return response.data.isFavorite
  },
}
