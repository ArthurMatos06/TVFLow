import { useQuery } from '@tanstack/react-query'
import { tmdbService } from '@/services/tmdb'

export function useMoviesByGenre(genreId: number) {
  return useQuery({
    queryKey: ['tmdb', 'movies', 'genre', genreId],
    queryFn: () => tmdbService.getMoviesByGenre(genreId),
  })
}
