import { useQuery } from '@tanstack/react-query'
import { tmdbService } from '@/services/tmdb'
import { getQueryKey, isValidQuery } from '@/utils/search'

interface UseSearchMultiParams {
  query: string
  page: number
}

export function useSearchMulti({ query, page }: UseSearchMultiParams, enabled = true) {
  return useQuery({
    queryKey: ['tmdb', 'search', 'multi', getQueryKey({ query, page })],
    queryFn: () => tmdbService.searchMulti(query, page),
    enabled: enabled && isValidQuery(query),
  })
}
