import { useRatingStore } from '@/store/ratingStore'

export function useRatings() {
  const ratings = useRatingStore((s) => s.ratings)
  const setRating = useRatingStore((s) => s.setRating)
  const getRating = useRatingStore((s) => s.getRating)
  const getAllRatings = useRatingStore((s) => s.getAllRatings)
  const removeRating = useRatingStore((s) => s.removeRating)

  return { ratings, setRating, getRating, getAllRatings, removeRating }
}
