import { create } from 'zustand'
import type { Favorite, MediaType } from '@/types'
import { getStoredFavorites, setStoredFavorites } from '@/utils/favorites'

const LOCAL_USER_ID = 'local-user'

interface FavoriteState {
  favorites: Favorite[]
  addFavorite: (mediaId: number, mediaType: MediaType) => void
  removeFavorite: (mediaId: number) => void
  isFavorite: (mediaId: number) => boolean
  getFavorites: () => Favorite[]
  hydrate: () => void
  clear: () => void
}

export const useFavoriteStore = create<FavoriteState>((set, get) => ({
  favorites: getStoredFavorites(),

  addFavorite: (mediaId, mediaType) => {
    const { favorites } = get()
    if (favorites.some((favorite) => favorite.mediaId === mediaId)) return

    const favorite: Favorite = {
      id: crypto.randomUUID(),
      userId: LOCAL_USER_ID,
      mediaId,
      mediaType,
      createdAt: new Date().toISOString(),
    }
    const next = [...favorites, favorite]
    setStoredFavorites(next)
    set({ favorites: next })
  },

  removeFavorite: (mediaId) => {
    const next = get().favorites.filter((favorite) => favorite.mediaId !== mediaId)
    setStoredFavorites(next)
    set({ favorites: next })
  },

  isFavorite: (mediaId) => get().favorites.some((favorite) => favorite.mediaId === mediaId),

  getFavorites: () => get().favorites,

  hydrate: () => {
    set({ favorites: getStoredFavorites() })
  },

  clear: () => {
    setStoredFavorites([])
    set({ favorites: [] })
  },
}))
