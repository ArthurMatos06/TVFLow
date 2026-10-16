import { useQuery } from '@tanstack/react-query'
import { tmdbService } from '@/services/tmdb'
import { getQueryKey } from '@/utils/search'

interface UseDiscoverTVShowsParams {
  genreId: number | null
  year: string
  sortBy: string
  page: number
}

export function useDiscoverTVShows(
  { genreId, year, sortBy, page }: UseDiscoverTVShowsParams,
  enabled = true,
) {
  return useQuery({
    queryKey: ['tmdb', 'discover', 'tv', getQueryKey({ genreId, year, sortBy, page })],
    queryFn: () => tmdbService.discoverTVShows({ genreId, year, sortBy }, page),
    enabled,
  })
}
