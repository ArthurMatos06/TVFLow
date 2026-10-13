  import { useFavoriteStore } from '@/store/favoriteStore'

  export function useFavorites() {
    const favorites = useFavoriteStore((s) => s.favorites)
    const addFavorite = useFavoriteStore((s) => s.addFavorite)
    const removeFavorite = useFavoriteStore((s) => s.removeFavorite)
    const isFavorite = useFavoriteStore((s) => s.isFavorite)
    const getFavorites = useFavoriteStore((s) => s.getFavorites)

    return { favorites, addFavorite, removeFavorite, isFavorite, getFavorites }
  }
