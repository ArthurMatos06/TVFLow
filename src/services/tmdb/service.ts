import { MOCK_GENRES } from '@/mocks/genres.mock'
import { MOCK_MOVIES } from '@/mocks/movies.mock'
import { MOCK_TV_SHOWS } from '@/mocks/tvshows.mock'
import { buildMockMovieDetails, buildMockTVShowDetails } from '@/mocks/details.mock'
import type {
  MovieDetailsResponse,
  SimilarMediaResponse,
  TMDBGenre,
  TMDBGenreListResponse,
  TMDBMovie,
  TMDBMovieResponse,
  TMDBMultiResponse,
  TMDBMultiResult,
  TMDBTVShow,
  TMDBTVShowResponse,
  TVShowDetailsResponse,
} from '@/types'
import type { DiscoverFilters } from '@/types/search'
import { tmdbClient } from './client'

const HAS_API_KEY = Boolean(import.meta.env.VITE_TMDB_API_KEY)

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

/**
 * Fallback inteligente: sem chave de API configurada, retorna os mocks
 * diretamente (sem rede). Com chave, tenta a API e, em caso de falha,
 * cai para os mocks para manter a interface utilizável.
 */
async function fetchWithFallback<T>(request: () => Promise<T>, fallback: () => T): Promise<T> {
  if (!HAS_API_KEY) {
    await delay(400)
    return fallback()
  }

  try {
    return await request()
  } catch (error) {
    console.warn('[tmdb] Falha na requisição, usando dados mockados.', error)
    await delay(400)
    return fallback()
  }
}

function sortMockMovies(movies: TMDBMovie[], sortBy?: string): TMDBMovie[] {
  const sorted = [...movies]
  switch (sortBy) {
    case 'vote_average.desc':
      return sorted.sort((a, b) => b.vote_average - a.vote_average)
    case 'release_date.desc':
      return sorted.sort((a, b) => b.release_date.localeCompare(a.release_date))
    case 'original_title.asc':
      return sorted.sort((a, b) => a.title.localeCompare(b.title))
    default:
      return sorted.sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0))
  }
}

function sortMockTVShows(shows: TMDBTVShow[], sortBy?: string): TMDBTVShow[] {
  const sorted = [...shows]
  switch (sortBy) {
    case 'vote_average.desc':
      return sorted.sort((a, b) => b.vote_average - a.vote_average)
    case 'first_air_date.desc':
      return sorted.sort((a, b) => b.first_air_date.localeCompare(a.first_air_date))
    case 'name.asc':
      return sorted.sort((a, b) => a.name.localeCompare(b.name))
    default:
      return sorted.sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0))
  }
}

function matchesQuery(text: string, query: string): boolean {
  return text.toLowerCase().includes(query.toLowerCase())
}

export const tmdbService = {
  async getPopularMovies(page = 1): Promise<TMDBMovie[]> {
    return fetchWithFallback(
      async () => {
        const { data } = await tmdbClient.get<TMDBMovieResponse>('/movie/popular', {
          params: { page },
        })
        return data.results
      },
      () => MOCK_MOVIES,
    )
  },

  async getTrendingMovies(): Promise<TMDBMovie[]> {
    return fetchWithFallback(
      async () => {
        const { data } = await tmdbClient.get<TMDBMovieResponse>('/trending/movie/day')
        return data.results
      },
      () => MOCK_MOVIES,
    )
  },

  async getTopRatedMovies(page = 1): Promise<TMDBMovie[]> {
    return fetchWithFallback(
      async () => {
        const { data } = await tmdbClient.get<TMDBMovieResponse>('/movie/top_rated', {
          params: { page },
        })
        return data.results
      },
      () => MOCK_MOVIES,
    )
  },

  async getLatestMovies(page = 1): Promise<TMDBMovie[]> {
    return fetchWithFallback(
      async () => {
        const { data } = await tmdbClient.get<TMDBMovieResponse>('/movie/now_playing', {
          params: { page },
        })
        return data.results
      },
      () => MOCK_MOVIES,
    )
  },

  async getMoviesByGenre(genreId: number, page = 1): Promise<TMDBMovie[]> {
    return fetchWithFallback(
      async () => {
        const { data } = await tmdbClient.get<TMDBMovieResponse>('/discover/movie', {
          params: { with_genres: genreId, page },
        })
        return data.results
      },
      () => MOCK_MOVIES.filter((movie) => movie.genre_ids.includes(genreId)),
    )
  },

  async getPopularTVShows(page = 1): Promise<TMDBTVShow[]> {
    return fetchWithFallback(
      async () => {
        const { data } = await tmdbClient.get<TMDBTVShowResponse>('/tv/popular', {
          params: { page },
        })
        return data.results
      },
      () => MOCK_TV_SHOWS,
    )
  },

  async getTrendingTVShows(): Promise<TMDBTVShow[]> {
    return fetchWithFallback(
      async () => {
        const { data } = await tmdbClient.get<TMDBTVShowResponse>('/trending/tv/day')
        return data.results
      },
      () => MOCK_TV_SHOWS,
    )
  },

  async getTopRatedTVShows(page = 1): Promise<TMDBTVShow[]> {
    return fetchWithFallback(
      async () => {
        const { data } = await tmdbClient.get<TMDBTVShowResponse>('/tv/top_rated', {
          params: { page },
        })
        return data.results
      },
      () => MOCK_TV_SHOWS,
    )
  },

  async getGenres(): Promise<TMDBGenre[]> {
    return fetchWithFallback(
      async () => {
        const { data } = await tmdbClient.get<TMDBGenreListResponse>('/genre/movie/list')
        return data.genres
      },
      () => MOCK_GENRES,
    )
  },

  async searchMovies(query: string, page = 1): Promise<TMDBMovieResponse> {
    return fetchWithFallback(
      async () => {
        const { data } = await tmdbClient.get<TMDBMovieResponse>('/search/movie', {
          params: { query, page },
        })
        return data
      },
      () => {
        const results = MOCK_MOVIES.filter((movie) =>
          matchesQuery(`${movie.title} ${movie.overview}`, query),
        )
        return { page, total_pages: 1, total_results: results.length, results }
      },
    )
  },

  async searchTVShows(query: string, page = 1): Promise<TMDBTVShowResponse> {
    return fetchWithFallback(
      async () => {
        const { data } = await tmdbClient.get<TMDBTVShowResponse>('/search/tv', {
          params: { query, page },
        })
        return data
      },
      () => {
        const results = MOCK_TV_SHOWS.filter((show) =>
          matchesQuery(`${show.name} ${show.overview}`, query),
        )
        return { page, total_pages: 1, total_results: results.length, results }
      },
    )
  },

  async searchMulti(query: string, page = 1): Promise<TMDBMultiResponse> {
    return fetchWithFallback(
      async () => {
        const { data } = await tmdbClient.get<TMDBMultiResponse>('/search/multi', {
          params: { query, page },
        })
        return data
      },
      () => {
        const movieResults: TMDBMultiResult[] = MOCK_MOVIES.filter((movie) =>
          matchesQuery(`${movie.title} ${movie.overview}`, query),
        ).map((movie) => ({ ...movie, media_type: 'movie' }))
        const tvResults: TMDBMultiResult[] = MOCK_TV_SHOWS.filter((show) =>
          matchesQuery(`${show.name} ${show.overview}`, query),
        ).map((show) => ({ ...show, media_type: 'tv' }))
        const results = [...movieResults, ...tvResults]
        return { page, total_pages: 1, total_results: results.length, results }
      },
    )
  },

  async discoverMovies(filters: DiscoverFilters = {}, page = 1): Promise<TMDBMovieResponse> {
    return fetchWithFallback(
      async () => {
        const { data } = await tmdbClient.get<TMDBMovieResponse>('/discover/movie', {
          params: {
            with_genres: filters.genreId ?? undefined,
            primary_release_year: filters.year || undefined,
            sort_by: filters.sortBy || 'popularity.desc',
            page,
          },
        })
        return data
      },
      () => {
        const { genreId, year } = filters
        let results = MOCK_MOVIES
        if (genreId) {
          results = results.filter((movie) => movie.genre_ids.includes(genreId))
        }
        if (year) {
          results = results.filter((movie) => movie.release_date.startsWith(year))
        }
        results = sortMockMovies(results, filters.sortBy)
        return { page, total_pages: 1, total_results: results.length, results }
      },
    )
  },

  async discoverTVShows(filters: DiscoverFilters = {}, page = 1): Promise<TMDBTVShowResponse> {
    return fetchWithFallback(
      async () => {
        const { data } = await tmdbClient.get<TMDBTVShowResponse>('/discover/tv', {
          params: {
            with_genres: filters.genreId ?? undefined,
            first_air_date_year: filters.year || undefined,
            sort_by: filters.sortBy || 'popularity.desc',
            page,
          },
        })
        return data
      },
      () => {
        const { genreId, year } = filters
        let results = MOCK_TV_SHOWS
        if (genreId) {
          results = results.filter((show) => show.genre_ids.includes(genreId))
        }
        if (year) {
          results = results.filter((show) => show.first_air_date.startsWith(year))
        }
        results = sortMockTVShows(results, filters.sortBy)
        return { page, total_pages: 1, total_results: results.length, results }
      },
    )
  },

  async getMovieDetails(id: number): Promise<MovieDetailsResponse> {
    return fetchWithFallback(
      async () => {
        const { data } = await tmdbClient.get<MovieDetailsResponse>(`/movie/${id}`, {
          params: { append_to_response: 'credits,videos' },
        })
        return data
      },
      () => buildMockMovieDetails(id),
    )
  },

  async getTVShowDetails(id: number): Promise<TVShowDetailsResponse> {
    return fetchWithFallback(
      async () => {
        const { data } = await tmdbClient.get<TVShowDetailsResponse>(`/tv/${id}`, {
          params: { append_to_response: 'credits,videos' },
        })
        return data
      },
      () => buildMockTVShowDetails(id),
    )
  },

  async getSimilarMovies(id: number): Promise<TMDBMovie[]> {
    return fetchWithFallback(
      async () => {
        const { data } = await tmdbClient.get<SimilarMediaResponse<TMDBMovie>>(`/movie/${id}/similar`)
        return data.results
      },
      () => MOCK_MOVIES.filter((movie) => movie.id !== id),
    )
  },

  async getSimilarTVShows(id: number): Promise<TMDBTVShow[]> {
    return fetchWithFallback(
      async () => {
        const { data } = await tmdbClient.get<SimilarMediaResponse<TMDBTVShow>>(`/tv/${id}/similar`)
        return data.results
      },
      () => MOCK_TV_SHOWS.filter((show) => show.id !== id),
    )
  },
}
