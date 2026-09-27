import { useQuery } from '@tanstack/react-query'
import { tmdbService } from '@/services/tmdb'

export function useTrendingTVShows() {
  return useQuery({
    queryKey: ['tmdb', 'tv', 'trending'],
    queryFn: () => tmdbService.getTrendingTVShows(),
  })
}
