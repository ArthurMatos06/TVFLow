import { create } from 'zustand'
import type { MediaType, Rating } from '@/types'
import { getStoredRatings, setStoredRatings } from '@/utils/ratings'

const LOCAL_USER_ID = 'local-user'

interface RatingState {
  ratings: Rating[]
  setRating: (mediaId: number, mediaType: MediaType, score: number) => void
  getRating: (mediaId: number) => number | null
  getAllRatings: () => Rating[]
  removeRating: (mediaId: number) => void
  hydrate: () => void
  clear: () => void
}

export const useRatingStore = create<RatingState>((set, get) => ({
  ratings: getStoredRatings(),

  setRating: (mediaId, mediaType, score) => {
    const { ratings } = get()
    const existing = ratings.find((rating) => rating.mediaId === mediaId)

    let next: Rating[]
    if (existing) {
      next = ratings.map((rating) =>
        rating.mediaId === mediaId ? { ...rating, mediaType, score } : rating,
      )
    } else {
      const rating: Rating = {
        id: crypto.randomUUID(),
        userId: LOCAL_USER_ID,
        mediaId,
        mediaType,
        score,
        createdAt: new Date().toISOString(),
      }
      next = [...ratings, rating]
    }

    setStoredRatings(next)
    set({ ratings: next })
  },

  getRating: (mediaId) => {
    const rating = get().ratings.find((item) => item.mediaId === mediaId)
    return rating ? rating.score : null
  },

  getAllRatings: () => get().ratings,

  removeRating: (mediaId) => {
    const next = get().ratings.filter((rating) => rating.mediaId !== mediaId)
    setStoredRatings(next)
    set({ ratings: next })
  },

  hydrate: () => {
    set({ ratings: getStoredRatings() })
  },

  clear: () => {
    setStoredRatings([])
    set({ ratings: [] })
  },
}))
