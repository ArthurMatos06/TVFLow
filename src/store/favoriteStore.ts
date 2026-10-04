import { create } from 'zustand'
import type { Favorite, MediaType } from '@/types'
import {tmdbClient} from "@/services/tmdb";

interface FavoriteState {
  favorites: Favorite[]
  addFavorite: (mediaId: number, mediaType: MediaType) => Promise<void>
  removeFavorite: (mediaId: number, mediaType: MediaType) => Promise<void>
  isFavorite: (mediaId: number) => boolean
  getFavorites: () => Favorite[]
  hydrate: () => Promise<void>
  clear: () => void
}

export const useFavoriteStore = create<FavoriteState>((set, get) => ({
  favorites: [],

  addFavorite: async (mediaId, mediaType) => {
    const { favorites } = get()

    if (favorites.some((favorite) => favorite.mediaId === mediaId)) {
      return
    }

    const { data } = await tmdbClient.post<Favorite>('/favorites', {
      mediaId,
      mediaType: mediaType.toUpperCase(),
    })

    set({
      favorites: [...favorites, data],
    })
  },

  removeFavorite: async (mediaId, mediaType) => {
    await tmdbClient.delete(`/favorites/${mediaId}`, {
      params: {
        mediaType: mediaType.toUpperCase(),
      },
    })

    set((state) => ({
      favorites: state.favorites.filter(
          (favorite) => favorite.mediaId !== mediaId,
      ),
    }))
  },

  isFavorite: (mediaId) =>
      get().favorites.some(
          (favorite) => favorite.mediaId === mediaId,
      ),

  getFavorites: () => get().favorites,

  hydrate: async () => {
    const { data } = await tmdbClient.get<Favorite[]>('/favorites')

    set({
      favorites: data.map((favorite) => ({
        ...favorite,
        mediaType: favorite.mediaType.toLowerCase() as MediaType,
      })),
    })
  },

  clear: () => {
    set({
      favorites: [],
    })
  },
}))