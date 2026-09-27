import { useQuery } from '@tanstack/react-query'
import { tmdbService } from '@/services/tmdb'

export function useTVShowDetails(id: number) {
  return useQuery({
    queryKey: ['tmdb', 'tv', id, 'details'],
    queryFn: () => tmdbService.getTVShowDetails(id),
    enabled: Boolean(id),
  })
}
