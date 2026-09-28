import { memo } from 'react'
import { Link } from 'react-router-dom'
import { MediaImage, StarIcon } from '@/components/ui'
import { getImageUrl } from '@/services/tmdb'
import type { TMDBGenre, TMDBTVShow } from '@/types'
import { formatRating, formatYear, getGenreNames } from '@/utils/media'

interface TvCardProps {
  show: TMDBTVShow
  genres?: TMDBGenre[]
}

function TvCardComponent({ show, genres }: TvCardProps) {
  const posterUrl = getImageUrl(show.poster_path, 'w342')
  const year = formatYear(show.first_air_date)
  const genreNames = getGenreNames(show.genre_ids, genres).slice(0, 2)

  return (
    <Link
      to={`/tv/${show.id}`}
      className="group animate-fade-in w-40 shrink-0 sm:w-44"
    >
      <div className="relative">
        <MediaImage
          src={posterUrl}
          alt={show.name}
          className="aspect-[2/3] rounded-lg border border-border transition-shadow duration-300 group-hover:shadow-lg"
          imgClassName="transition-transform duration-300 group-hover:scale-105"
        />
        <span className="absolute right-2 top-2 flex items-center gap-1 rounded-md bg-background/80 px-1.5 py-0.5 text-xs font-semibold text-warning backdrop-blur">
          <StarIcon className="h-3 w-3" />
          {formatRating(show.vote_average)}
        </span>
      </div>
      <div className="mt-2">
        <h3 className="truncate text-sm font-medium text-text transition-colors group-hover:text-primary">
          {show.name}
        </h3>
        <p className="mt-0.5 truncate text-xs text-text-muted">
          {[year, ...genreNames].filter(Boolean).join(' · ')}
        </p>
      </div>
    </Link>
  )
}

function areEqual(prev: TvCardProps, next: TvCardProps) {
  return prev.show.id === next.show.id && prev.genres === next.genres
}

export const TvCard = memo(TvCardComponent, areEqual)
