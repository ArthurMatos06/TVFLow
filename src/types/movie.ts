export interface Genre {
  id: number
  name: string
}

export interface Movie {
  id: number
  title: string
  originalTitle: string
  overview: string
  posterPath: string | null
  backdropPath: string | null
  releaseDate: string
  voteAverage: number
  voteCount: number
  genreIds: number[]
  runtime?: number
  genres?: Genre[]
}

export interface TVShow {
  id: number
  name: string
  originalName: string
  overview: string
  posterPath: string | null
  backdropPath: string | null
  firstAirDate: string
  voteAverage: number
  voteCount: number
  genreIds: number[]
  numberOfSeasons?: number
  numberOfEpisodes?: number
  genres?: Genre[]
}

export interface CastMember {
  id: number
  name: string
  character: string
  profilePath: string | null
}

export interface Video {
  id: string
  key: string
  site: string
  type: string
}

// --- Tipos de resposta da API TMDB (snake_case) ---

export interface TMDBMovie {
  id: number
  title: string
  original_title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
  vote_count: number
  genre_ids: number[]
  adult?: boolean
  popularity?: number
  video?: boolean
}

export interface TMDBTVShow {
  id: number
  name: string
  original_name: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  first_air_date: string
  vote_average: number
  vote_count: number
  genre_ids: number[]
  origin_country?: string[]
  popularity?: number
}

export interface TMDBGenre {
  id: number
  name: string
}

export interface TMDBMultiResult {
  id: number
  media_type: 'movie' | 'tv' | 'person'
  title?: string
  name?: string
  original_title?: string
  original_name?: string
  overview?: string
  poster_path: string | null
  backdrop_path: string | null
  release_date?: string
  first_air_date?: string
  vote_average?: number
  vote_count?: number
  genre_ids?: number[]
  popularity?: number
}

export interface TMDBPaginatedResponse<T> {
  page: number
  total_pages: number
  total_results: number
  results: T[]
}

export type TMDBMovieResponse = TMDBPaginatedResponse<TMDBMovie>
export type TMDBTVShowResponse = TMDBPaginatedResponse<TMDBTVShow>
export type TMDBMultiResponse = TMDBPaginatedResponse<TMDBMultiResult>
export type TMDBGenreListResponse = { genres: TMDBGenre[] }

export interface TMDBPerson {
  id: number
  name: string
  character?: string
  job?: string
  department?: string
  profile_path: string | null
  credit_id?: string
  order?: number
}

export interface TMDBCreditsResponse {
  id: number
  cast: TMDBPerson[]
  crew: TMDBPerson[]
}

export interface TMDBVideosResponse {
  id: number
  results: Video[]
}

export interface MovieDetailsResponse {
  id: number
  title: string
  original_title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
  vote_count: number
  runtime: number | null
  tagline: string
  status: string
  genres: TMDBGenre[]
  credits: TMDBCreditsResponse
  videos: TMDBVideosResponse
}

export interface TVSeason {
  id: number
  name: string
  overview: string
  air_date: string | null
  episode_count: number
  poster_path: string | null
  season_number: number
  vote_average: number
}

export interface TVShowDetailsResponse {
  id: number
  name: string
  original_name: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  first_air_date: string
  vote_average: number
  vote_count: number
  number_of_seasons: number
  number_of_episodes: number
  tagline: string
  status: string
  genres: TMDBGenre[]
  seasons: TVSeason[]
  credits: TMDBCreditsResponse
  videos: TMDBVideosResponse
}

export interface Director {
  id: number
  name: string
  job: string
  department: string
  profile_path: string | null
  credit_id: string
}

export type SimilarMediaResponse<T> = TMDBPaginatedResponse<T>
