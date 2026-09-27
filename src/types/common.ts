export interface Paginated<T> {
  page: number
  totalPages: number
  totalResults: number
  results: T[]
}

export type MediaType = 'movie' | 'tv'

export interface SearchResult {
  id: number
  mediaType: MediaType
  title: string
  posterPath: string | null
  releaseDate?: string
  voteAverage: number
}

export interface ApiError {
  message: string
  status?: number
}
