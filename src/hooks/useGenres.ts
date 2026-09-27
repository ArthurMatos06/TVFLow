import { useQuery } from '@tanstack/react-query'
import { tmdbService } from '@/services/tmdb'

export function useGenres() {
  return useQuery({
    queryKey: ['tmdb', 'genres'],
    queryFn: () => tmdbService.getGenres(),
  })
}
