import { useQuery } from '@tanstack/react-query'
import { tmdbService } from '@/services/tmdb'

export function useTrendingMovies() {
  return useQuery({
    queryKey: ['tmdb', 'movies', 'trending'],
    queryFn: () => tmdbService.getTrendingMovies(),
  })
}
