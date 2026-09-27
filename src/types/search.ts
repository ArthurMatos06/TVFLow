import type { MediaType } from './common'

/** Tipo de mídia pesquisável: filme, série ou ambos (multi). */
export type SearchType = MediaType | 'multi'

/** Filtros da busca, persistidos nos parâmetros da URL. */
export interface SearchFilters {
  query: string
  type: SearchType
  genreId: number | null
  year: string
  sortBy: string
  page: number
}

/** Estado derivado da busca (filtros + termo com debounce). */
export interface SearchState {
  filters: SearchFilters
  debouncedQuery: string
  isDebouncing: boolean
}

/** Filtros usados pelos endpoints de discover do TMDB. */
export interface DiscoverFilters {
  genreId?: number | null
  year?: string
  sortBy?: string
}

/** Item normalizado exibido no grid de resultados. */
export interface SearchResultItem {
  id: number
  mediaType: MediaType
  title: string
  posterPath: string | null
  releaseDate: string
  voteAverage: number
  genreIds: number[]
}
