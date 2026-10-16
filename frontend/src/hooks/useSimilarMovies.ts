import { useQuery } from '@tanstack/react-query'
import { tmdbService } from '@/services/tmdb'

export function useSimilarMovies(id: number) {
  return useQuery({
    queryKey: ['tmdb', 'movie', id, 'similar'],
    queryFn: () => tmdbService.getSimilarMovies(id),
    enabled: Boolean(id),
  })
}
