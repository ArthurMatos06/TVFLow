import { memo } from 'react'
import { Link } from 'react-router-dom'
import { MediaImage, StarIcon } from '@/components/ui'
import { getImageUrl } from '@/services/tmdb'
import type { TMDBGenre, TMDBMovie } from '@/types'
import { formatRating, formatYear, getGenreNames } from '@/utils/media'

interface MovieCardProps {
  movie: TMDBMovie
  genres?: TMDBGenre[]
}

function MovieCardComponent({ movie, genres }: MovieCardProps) {
  const posterUrl = getImageUrl(movie.poster_path, 'w342')
  const year = formatYear(movie.release_date)
  const genreNames = getGenreNames(movie.genre_ids, genres).slice(0, 2)

  return (
    <Link
      to={`/movie/${movie.id}`}
      className="group animate-fade-in w-40 shrink-0 sm:w-44"
    >
      <div className="relative">
        <MediaImage
          src={posterUrl}
          alt={movie.title}
          className="aspect-2/3 rounded-lg border border-border transition-shadow duration-300 group-hover:shadow-lg"
          imgClassName="transition-transform duration-300 group-hover:scale-105"
        />
        <span className="absolute right-2 top-2 flex items-center gap-1 rounded-md bg-background/80 px-1.5 py-0.5 text-xs font-semibold text-warning backdrop-blur">
          <StarIcon className="h-3 w-3" />
          {formatRating(movie.vote_average)}
        </span>
      </div>
      <div className="mt-2">
        <h3 className="truncate text-sm font-medium text-text transition-colors group-hover:text-primary">
          {movie.title}
        </h3>
        <p className="mt-0.5 truncate text-xs text-text-muted">
          {[year, ...genreNames].filter(Boolean).join(' · ')}
        </p>
      </div>
    </Link>
  )
}

function areEqual(prev: MovieCardProps, next: MovieCardProps) {
  return prev.movie.id === next.movie.id && prev.genres === next.genres
}

export const MovieCard = memo(MovieCardComponent, areEqual)
