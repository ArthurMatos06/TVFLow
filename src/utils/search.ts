import type { TMDBMovie, TMDBMultiResult, TMDBTVShow } from '@/types'
import type { SearchFilters, SearchResultItem, SearchType } from '@/types/search'

export const DEFAULT_SORT = 'popularity.desc'

export const MOVIE_SORT_OPTIONS = [
  { value: 'popularity.desc', label: 'Popularidade' },
  { value: 'vote_average.desc', label: 'Melhor avaliados' },
  { value: 'release_date.desc', label: 'Lançamento (mais recentes)' },
  { value: 'revenue.desc', label: 'Maior bilheteria' },
  { value: 'original_title.asc', label: 'Título (A-Z)' },
] as const

export const TV_SORT_OPTIONS = [
  { value: 'popularity.desc', label: 'Popularidade' },
  { value: 'vote_average.desc', label: 'Melhor avaliados' },
  { value: 'first_air_date.desc', label: 'Lançamento (mais recentes)' },
  { value: 'name.asc', label: 'Nome (A-Z)' },
] as const

const VALID_SORT_VALUES: Set<string> = new Set(
  [...MOVIE_SORT_OPTIONS, ...TV_SORT_OPTIONS].map((option) => option.value),
)

/** Verifica se o termo de busca é válido (não vazio). */
export function isValidQuery(query: string): boolean {
  return query.trim().length > 0
}

/** Converte os parâmetros da URL em filtros de busca normalizados. */
export function parseParams(searchParams: URLSearchParams): SearchFilters {
  const typeParam = searchParams.get('type')
  const genreParam = searchParams.get('genre')
  const yearParam = searchParams.get('year')
  const sortParam = searchParams.get('sort')
  const pageParam = searchParams.get('page')

  const type: SearchType =
    typeParam === 'movie' || typeParam === 'tv' || typeParam === 'multi' ? typeParam : 'multi'

  const genreId = genreParam && /^\d+$/.test(genreParam) ? Number(genreParam) : null
  const year = yearParam && /^\d{4}$/.test(yearParam) ? yearParam : ''
  const sortBy = sortParam && VALID_SORT_VALUES.has(sortParam) ? sortParam : DEFAULT_SORT
  const page = pageParam && /^\d+$/.test(pageParam) ? Math.max(1, Number(pageParam)) : 1

  return {
    query: searchParams.get('q') ?? '',
    type,
    genreId,
    year,
    sortBy,
    page,
  }
}

/** Converte filtros de busca em parâmetros de URL (omite valores padrão). */
export function buildParams(filters: Partial<SearchFilters>): URLSearchParams {
  const params = new URLSearchParams()

  if (filters.query?.trim()) params.set('q', filters.query.trim())
  if (filters.type && filters.type !== 'multi') params.set('type', filters.type)
  if (filters.genreId) params.set('genre', String(filters.genreId))
  if (filters.year) params.set('year', filters.year)
  if (filters.sortBy && filters.sortBy !== DEFAULT_SORT) params.set('sort', filters.sortBy)
  if (filters.page && filters.page > 1) params.set('page', String(filters.page))

  return params
}

/** Gera uma chave estável a partir dos filtros (usada nas query keys do React Query). */
export function getQueryKey(filters: Partial<SearchFilters>): string {
  return buildParams(filters).toString()
}

/** Normaliza um resultado do TMDB (filme, série ou multi) para exibição no grid. */
export function toSearchResultItem(
  item: TMDBMovie | TMDBTVShow | TMDBMultiResult,
): SearchResultItem {
  if ('media_type' in item) {
    const mediaType = item.media_type === 'tv' ? 'tv' : 'movie'
    return {
      id: item.id,
      mediaType,
      title: mediaType === 'tv' ? (item.name ?? '') : (item.title ?? ''),
      posterPath: item.poster_path,
      releaseDate: mediaType === 'tv' ? (item.first_air_date ?? '') : (item.release_date ?? ''),
      voteAverage: item.vote_average ?? 0,
      genreIds: item.genre_ids ?? [],
    }
  }

  if ('title' in item) {
    return {
      id: item.id,
      mediaType: 'movie',
      title: item.title,
      posterPath: item.poster_path,
      releaseDate: item.release_date,
      voteAverage: item.vote_average,
      genreIds: item.genre_ids,
    }
  }

  return {
    id: item.id,
    mediaType: 'tv',
    title: item.name,
    posterPath: item.poster_path,
    releaseDate: item.first_air_date,
    voteAverage: item.vote_average,
    genreIds: item.genre_ids,
  }
}
