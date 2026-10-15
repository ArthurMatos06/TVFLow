import type { MediaType, Rating } from '@/types'
import { apiClient } from './client'

interface SetRatingInput {
  mediaId: number;
  mediaType: MediaType;
  score: number;
}

export const ratingService = {
  async getRatings(mediaType?: MediaType): Promise<Rating[]> {
    const response = await apiClient.get<Rating[]>('/ratings', {
      params: mediaType ? { mediaType: mediaType.toUpperCase() } : undefined,
    })
    return response.data
  },

  async setRating({ mediaId, mediaType, score }: SetRatingInput): Promise<Rating> {
    const response = await apiClient.post<Rating>('/ratings', {
      mediaId,
      mediaType: mediaType.toUpperCase(),
      score,
    })
    return response.data
  },
}
