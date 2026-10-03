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



function matchesQuery(text: string, query: string): boolean {
  return text.toLowerCase().includes(query.toLowerCase())
}

export   const tmdbService = {
    async getPopularMovies(page = 1): Promise<TMDBMovie[]> {
        const { data } = await tmdbClient.get<TMDBMovieResponse>(
            '/movies/popular',
            {
                params: { page },
            },
        )
        return data.results
    },

    async getTrendingMovies(page = 1): Promise<TMDBMovie[]> {
        const {data} = await tmdbClient.get<TMDBMovieResponse>('/movies/trending',
            {
                params: {page},
            },
        )
        return data.results

    },

  async getTopRatedMovies(page = 1): Promise<TMDBMovie[]> {
    const {data} = await tmdbClient.get<TMDBMovieResponse>('/movies/top-rated',
        {
            params: {page},
        },
    )
      return data.results

  },

    async getLatestMovies(page = 1): Promise<TMDBMovie[]> {
        const {data} = await tmdbClient.get<TMDBMovieResponse>('/movies/upcoming',
            {
                params: {page},
            },
        )
        return data.results

    },

  async getMoviesByGenre(genreId: number, page = 1): Promise<TMDBMovie[]> {
        const { data } = await tmdbClient.get<TMDBMovieResponse>('/movies/by-genre', {
          params: { with_genres: genreId, page },
        })
        return data.results
      },

    async getPopularTVShows(page = 1): Promise<TMDBTVShow[]> {
        const { data } = await tmdbClient.get<TMDBTVShowResponse>(
            '/series/popular',
            {
                params: { page },
            },
        )
        return data.results
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
        const { data } = await tmdbClient.get<TMDBMovieResponse>(
            '/movies/search',
            {
                params: { query, page },
            },
        )

        return data
    },

    async searchTVShows(query: string, page = 1): Promise<TMDBTVShowResponse> {
        const { data } = await tmdbClient.get<TMDBTVShowResponse>(
            '/series/search',
            {
                params: { query, page },
            },
        )

        return data
    },

    async searchMulti(
        query: string,
        page = 1,
    ): Promise<TMDBMultiResponse> {
        const { data } = await tmdbClient.get<TMDBMultiResponse>(
            '/search/multi',
            {
                params: { query, page },
            },
        )

        return data
    },

    async discoverMovies(
        filters: DiscoverFilters = {},
        page = 1,
    ): Promise<TMDBMovieResponse> {
        const { data } = await tmdbClient.get<TMDBMovieResponse>(
            '/movies/discover',
            {
                params: {
                    with_genres: filters.genreId ?? undefined,
                    primary_release_year: filters.year || undefined,
                    sort_by: filters.sortBy || 'popularity.desc',
                    page,
                },
            },
        )
        console.log("os parametros foram enviados",filters)
        return data
    },


    async discoverTVShows(
        filters: DiscoverFilters = {},
        page = 1,
    ): Promise<TMDBTVShowResponse> {
        const { data } = await tmdbClient.get<TMDBTVShowResponse>(
            '/series/discover',
            {
                params: {
                    with_genres: filters.genreId ?? undefined,
                    primary_release_year: filters.year || undefined,
                    sort_by: filters.sortBy || 'popularity.desc',
                    page,
                },
            },
        )
        console.log("os parametros foram enviados",filters)
        return data
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
