import { useQuery } from '@tanstack/react-query'
import { tmdbService } from '@/services/tmdb'
import { getQueryKey, isValidQuery } from '@/utils/search'

interface UseSearchTVShowsParams {
  query: string
  page: number
}

export function useSearchTVShows({ query, page }: UseSearchTVShowsParams, enabled = true) {
  return useQuery({
    queryKey: ['tmdb', 'search', 'tv', getQueryKey({ query, page })],
    queryFn: () => tmdbService.searchTVShows(query, page),
    enabled: enabled && isValidQuery(query),
  })
}
