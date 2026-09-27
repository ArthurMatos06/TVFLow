import { useQuery } from '@tanstack/react-query'
import { tmdbService } from '@/services/tmdb'

export function useSimilarTVShows(id: number) {
  return useQuery({
    queryKey: ['tmdb', 'tv', id, 'similar'],
    queryFn: () => tmdbService.getSimilarTVShows(id),
    enabled: Boolean(id),
  })
}
