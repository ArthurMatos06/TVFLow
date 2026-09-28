import type { Favorite } from '@/types'

const FAVORITES_KEY = 'tvflow_favorites'

export function getStoredFavorites(): Favorite[] {
  try {
    const stored = localStorage.getItem(FAVORITES_KEY)
    return stored ? (JSON.parse(stored) as Favorite[]) : []
  } catch {
    return []
  }
}

export function setStoredFavorites(favorites: Favorite[]): void {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
  } catch (error) {
    console.error('Failed to save favorites:', error)
  }
}
