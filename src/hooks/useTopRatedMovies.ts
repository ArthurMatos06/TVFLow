import { useQuery } from '@tanstack/react-query'
import { tmdbService } from '@/services/tmdb'

export function useTopRatedMovies() {
  return useQuery({
    queryKey: ['tmdb', 'movies', 'top-rated'],
    queryFn: () => tmdbService.getTopRatedMovies(),
  })
}
