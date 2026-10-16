import { useQuery } from '@tanstack/react-query'
import { tmdbService } from '@/services/tmdb'

export function usePopularTVShows() {
  return useQuery({
    queryKey: ['tmdb', 'tv', 'popular'],
    queryFn: () => tmdbService.getPopularTVShows(),
  })
}
