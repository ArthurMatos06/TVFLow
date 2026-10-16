import { useQuery } from '@tanstack/react-query'
import { tmdbService } from '@/services/tmdb'

export function useMovieDetails(id: number) {
  return useQuery({
    queryKey: ['tmdb', 'movie', id, 'details'],
    queryFn: () => tmdbService.getMovieDetails(id),
    enabled: Boolean(id),
  })
}
