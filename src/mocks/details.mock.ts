import type {
  MovieDetailsResponse,
  TMDBCreditsResponse,
  TMDBVideosResponse,
  TVSeason,
  TVShowDetailsResponse,
} from '@/types'
import { MOCK_GENRES } from './genres.mock'
import { MOCK_MOVIES } from './movies.mock'
import { MOCK_TV_SHOWS } from './tvshows.mock'

/**
 * Créditos e vídeos mockados usados como fallback nos detalhes
 * enquanto a API do TMDB não está configurada ou indisponível.
 */
export const MOCK_CREDITS: TMDBCreditsResponse = {
  id: 0,
  cast: [
    {
      id: 6193,
      name: 'Leonardo DiCaprio',
      character: 'Protagonista',
      profile_path: '/wo2hJpn04vbtmh0B9utCFdsQhxM.jpg',
      order: 0,
    },
    {
      id: 18918,
      name: 'Dwayne Johnson',
      character: 'Coadjuvante',
      profile_path: '/akXLm2y2W5M7Z8j7n2y2W5M7Z8j7.jpg',
      order: 1,
    },
    {
      id: 73421,
      name: 'Scarlett Johansson',
      character: 'Coadjuvante',
      profile_path: '/f3c1rwcOoeU0v6z5VgV2gV2gV2gV.jpg',
      order: 2,
    },
    {
      id: 3223,
      name: 'Robert Downey Jr.',
      character: 'Coadjuvante',
      profile_path: '/5qHNjhtjcd4uO8Uoj1E4q5Y3Z1m.jpg',
      order: 3,
    },
    {
      id: 500,
      name: 'Tom Cruise',
      character: 'Coadjuvante',
      profile_path: '/8qBvBsUbLErC0qVVfnp40Riq6y2.jpg',
      order: 4,
    },
    {
      id: 1245,
      name: 'Natalie Portman',
      character: 'Coadjuvante',
      profile_path: '/edPU5HxncLWa1YkgRPNkS02qEm6.jpg',
      order: 5,
    },
  ],
  crew: [
    {
      id: 525,
      name: 'Christopher Nolan',
      job: 'Director',
      department: 'Directing',
      profile_path: '/xuAIuYSffUkmwzFq9hNOCjgREtC.jpg',
      credit_id: 'mock-director',
    },
  ],
}

export const MOCK_VIDEOS: TMDBVideosResponse = {
  id: 0,
  results: [
    {
      id: 'mock-trailer',
      key: 'YoHD9XEInc0',
      site: 'YouTube',
      type: 'Trailer',
    },
  ],
}

function buildMockSeasons(showId: number, showName: string, firstAirDate: string, voteAverage: number): TVSeason[] {
  return Array.from({ length: 3 }, (_, index) => ({
    id: showId * 10 + index + 1,
    name: `Temporada ${index + 1}`,
    overview: `Episódios da temporada ${index + 1} de ${showName}.`,
    air_date: firstAirDate,
    episode_count: 10,
    poster_path: null,
    season_number: index + 1,
    vote_average: voteAverage,
  }))
}

export function buildMockMovieDetails(id: number): MovieDetailsResponse {
  const movie = MOCK_MOVIES.find((item) => item.id === id) ?? MOCK_MOVIES[0]
  return {
    ...movie,
    runtime: 148,
    tagline: '',
    status: 'Lançado',
    genres: MOCK_GENRES.filter((genre) => movie.genre_ids.includes(genre.id)),
    credits: MOCK_CREDITS,
    videos: MOCK_VIDEOS,
  }
}

export function buildMockTVShowDetails(id: number): TVShowDetailsResponse {
  const show = MOCK_TV_SHOWS.find((item) => item.id === id) ?? MOCK_TV_SHOWS[0]
  return {
    ...show,
    tagline: '',
    status: 'Em exibição',
    number_of_seasons: 3,
    number_of_episodes: 30,
    genres: MOCK_GENRES.filter((genre) => show.genre_ids.includes(genre.id)),
    seasons: buildMockSeasons(show.id, show.name, show.first_air_date, show.vote_average),
    credits: MOCK_CREDITS,
    videos: MOCK_VIDEOS,
  }
}
