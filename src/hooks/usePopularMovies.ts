import { useQuery } from '@tanstack/react-query'
import { tmdbService } from '@/services/tmdb'

export function usePopularMovies() {
  return useQuery({
    queryKey: ['tmdb', 'movies', 'popular'],
    queryFn: () => {
      return tmdbService.getPopularMovies()
    },
  })
}
