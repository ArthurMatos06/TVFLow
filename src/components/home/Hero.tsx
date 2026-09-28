import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, GenreBadge, HeartIcon, Skeleton, StarIcon } from '@/components/ui'
import { getImageUrl } from '@/services/tmdb'
import type { TMDBGenre, TMDBMovie } from '@/types'
import { formatRating, formatYear, getGenreNames } from '@/utils/media'

interface HeroProps {
  movie?: TMDBMovie
  genres?: TMDBGenre[]
  isLoading?: boolean
}

export function Hero({ movie, genres, isLoading = false }: HeroProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [backdropError, setBackdropError] = useState(false)

  if (isLoading) {
    return (
      <section className="relative overflow-hidden rounded-2xl border border-border bg-surface">
        <Skeleton className="h-[420px] w-full rounded-none lg:h-[520px]" />
      </section>
    )
  }

  if (!movie) return null

  const backdropUrl = getImageUrl(movie.backdrop_path, 'w1280')
  const year = formatYear(movie.release_date)
  const genreNames = getGenreNames(movie.genre_ids, genres)

  return (
    <section className="group relative overflow-hidden rounded-2xl border border-border">
      {backdropUrl && !backdropError && (
        <img
          src={backdropUrl}
          alt=""
          onError={() => setBackdropError(true)}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/20 transition-opacity duration-500" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="relative z-10 flex min-h-[420px] flex-col justify-end gap-4 p-6 sm:p-10 lg:min-h-[520px]">
        <div className="flex flex-wrap items-center gap-3 text-sm">
          {year && <span className="font-medium text-text-muted">{year}</span>}
          <span className="flex items-center gap-1 font-semibold text-warning">
            <StarIcon className="h-4 w-4" />
            {formatRating(movie.vote_average)}
          </span>
        </div>
        <h1 className="max-w-2xl text-3xl font-bold leading-tight text-text sm:text-4xl lg:text-5xl">
          {movie.title}
        </h1>
        {genreNames.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {genreNames.map((name) => (
              <GenreBadge key={name} name={name} />
            ))}
          </div>
        )}
        <p className="max-w-xl text-sm leading-relaxed text-text-muted sm:text-base">
          {movie.overview}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <Link to={`/movie/${movie.id}`}>
            <Button size="lg">Ver detalhes</Button>
          </Link>
          <Button
            size="lg"
            variant={isFavorite ? 'primary' : 'outline'}
            onClick={() => setIsFavorite((prev) => !prev)}
          >
            <HeartIcon className="h-4 w-4" filled={isFavorite} />
            {isFavorite ? 'Favoritado' : 'Favoritar'}
          </Button>
        </div>
      </div>
    </section>
  )
}
