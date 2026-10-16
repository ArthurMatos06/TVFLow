export interface TMDBMovie {
  id: number
  title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
}

export interface SimilarMoviesResponse {
  page: number
  results: TMDBMovie[]
  total_pages: number
  total_results: number
}