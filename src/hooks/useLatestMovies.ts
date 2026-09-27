import { useQuery } from '@tanstack/react-query'
import { tmdbService } from '@/services/tmdb'

export function useLatestMovies() {
  return useQuery({
    queryKey: ['tmdb', 'movies', 'latest'],
    queryFn: () => tmdbService.getLatestMovies(),
  })
}
