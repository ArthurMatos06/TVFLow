import type { Rating } from '@/types'

const RATINGS_KEY = 'tvflow_ratings'

export function getStoredRatings(): Rating[] {
  try {
    const stored = localStorage.getItem(RATINGS_KEY)
    return stored ? (JSON.parse(stored) as Rating[]) : []
  } catch {
    return []
  }
}

export function setStoredRatings(ratings: Rating[]): void {
  try {
    localStorage.setItem(RATINGS_KEY, JSON.stringify(ratings))
  } catch (error) {
    console.error('Failed to save ratings:', error)
  }
}
