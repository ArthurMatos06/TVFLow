import { useQuery } from '@tanstack/react-query'
import { tmdbService } from '@/services/tmdb'
import { getQueryKey } from '@/utils/search'

interface UseDiscoverMoviesParams {
  genreId: number | null
  year: string
  sortBy: string
  page: number
}

export function useDiscoverMovies(
  { genreId, year, sortBy, page }: UseDiscoverMoviesParams,
  enabled = true,
) {
  return useQuery({
    queryKey: ['tmdb', 'discover', 'movie', getQueryKey({ genreId, year, sortBy, page })],
    queryFn: () => tmdbService.discoverMovies({ genreId, year, sortBy }, page),
    enabled,
  })
}
