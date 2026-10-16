import { useQuery } from '@tanstack/react-query'
import { tmdbService } from '@/services/tmdb'
import { getQueryKey, isValidQuery } from '@/utils/search'

interface UseSearchMoviesParams {
  query: string
  page: number
}

export function useSearchMovies({ query, page }: UseSearchMoviesParams, enabled = true) {
  return useQuery({
    queryKey: ['tmdb', 'search', 'movie', getQueryKey({ query, page })],
    queryFn: () => tmdbService.searchMovies(query, page),
    enabled: enabled && isValidQuery(query),
  })
}
