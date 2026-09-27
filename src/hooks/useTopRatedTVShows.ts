import { useQuery } from '@tanstack/react-query'
import { tmdbService } from '@/services/tmdb'

export function useTopRatedTVShows() {
  return useQuery({
    queryKey: ['tmdb', 'tv', 'top-rated'],
    queryFn: () => tmdbService.getTopRatedTVShows(),
  })
}
