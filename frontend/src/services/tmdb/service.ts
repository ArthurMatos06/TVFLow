import type {
  MovieDetailsResponse,
  TMDBGenre,
  TMDBGenreListResponse,
  TMDBMovie,
  TMDBMovieResponse,
  TMDBMultiResponse,
  TMDBTVShow,
  TMDBTVShowResponse,
  TVShowDetailsResponse,
} from '@/types'
import type { DiscoverFilters } from '@/types/search'
import { apiClient } from '@/services/api/client'

export const tmdbService = {
  async getPopularMovies(page = 1): Promise<TMDBMovie[]> {
    const { data } = await apiClient.get<TMDBMovieResponse>('/api/movies/popular', {
      params: { page },
    })
    return data.results
  },

  async getTrendingMovies(page = 1): Promise<TMDBMovie[]> {
    const { data } = await apiClient.get<TMDBMovieResponse>('/api/movies/trending', {
      params: { page },
    })
    return data.results
  },

  async getTopRatedMovies(page = 1): Promise<TMDBMovie[]> {
    const { data } = await apiClient.get<TMDBMovieResponse>('/api/movies/top-rated', {
      params: { page },
    })
    return data.results
  },

  async getLatestMovies(page = 1): Promise<TMDBMovie[]> {
    const { data } = await apiClient.get<TMDBMovieResponse>('/api/movies/upcoming', {
      params: { page },
    })
    return data.results
  },

  async getMoviesByGenre(genreId: number, page = 1): Promise<TMDBMovie[]> {
    const { data } = await apiClient.get<TMDBMovieResponse>('/api/movies/by-genre', {
      params: { with_genres: genreId, page },
    })
    return data.results
  },

  async getPopularTVShows(page = 1): Promise<TMDBTVShow[]> {
    const { data } = await apiClient.get<TMDBTVShowResponse>('/api/series/popular', {
      params: { page },
    })
    return data.results
  },

  async getGenres(): Promise<TMDBGenre[]> {
    const { data } = await apiClient.get<TMDBGenreListResponse>('/api/genre/movie/list')
    return data.genres
  },

  async searchMovies(query: string, page = 1): Promise<TMDBMovieResponse> {
    const { data } = await apiClient.get<TMDBMovieResponse>('/api/movies/search', {
      params: { query, page },
    })
    return data
  },

  async searchTVShows(query: string, page = 1): Promise<TMDBTVShowResponse> {
    const { data } = await apiClient.get<TMDBTVShowResponse>('/api/series/search', {
      params: { query, page },
    })
    return data
  },

  async searchMulti(query: string, page = 1): Promise<TMDBMultiResponse> {
    const { data } = await apiClient.get<TMDBMultiResponse>('/api/search/multi', {
      params: { query, page },
    })
    return data
  },

  async discoverMovies(filters: DiscoverFilters = {}, page = 1): Promise<TMDBMovieResponse> {
    const { data } = await apiClient.get<TMDBMovieResponse>('/api/movies/discover', {
      params: {
        with_genres: filters.genreId ?? undefined,
        primary_release_year: filters.year || undefined,
        sort_by: filters.sortBy || 'popularity.desc',
        page,
      },
    })
    return data
  },

  async discoverTVShows(filters: DiscoverFilters = {}, page = 1): Promise<TMDBTVShowResponse> {
    const { data } = await apiClient.get<TMDBTVShowResponse>('/api/series/discover', {
      params: {
        with_genres: filters.genreId ?? undefined,
        primary_release_year: filters.year || undefined,
        sort_by: filters.sortBy || 'popularity.desc',
        page,
      },
    })
    return data
  },

  async getMovieDetails(id: number): Promise<MovieDetailsResponse> {
    const { data } = await apiClient.get<MovieDetailsResponse>(`/api/movies/${id}`)
    return data
  },

  async getTVShowDetails(id: number): Promise<TVShowDetailsResponse> {
    const { data } = await apiClient.get<TVShowDetailsResponse>(`/api/series/${id}`)
    return data
  },

  async getSimilarMovies(id: number): Promise<TMDBMovie[]> {
    const { data } = await apiClient.get<TMDBMovie[]>(`/api/movies/${id}/similar`)
    return data
  },

  async getSimilarTVShows(id: number): Promise<TMDBTVShow[]> {
    const { data } = await apiClient.get<TMDBTVShow[]>(`/api/series/${id}/similar`)
    return data
  },
}
