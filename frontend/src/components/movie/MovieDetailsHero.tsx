import { useState } from 'react'
import { Button, GenreBadge, HeartIcon, MediaImage, StarIcon, StarRating } from '@/components/ui'
import { useFavorites, useRatings } from '@/hooks'
import { getImageUrl } from '@/services/tmdb'
import type { Director, MovieDetailsResponse } from '@/types'
import { formatRating, formatRuntime, formatYear } from '@/utils/media'

interface MovieDetailsHeroProps {
  movie: MovieDetailsResponse
  director?: Director | null
}

export function MovieDetailsHero({ movie, director }: MovieDetailsHeroProps) {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites()
  const {   setRating, getRating } = useRatings()
  const isMovieFavorite = isFavorite(movie.id)
  const userRating = getRating(movie.id) ?? 0
  const [backdropError, setBackdropError] = useState(false)

  const backdropUrl = getImageUrl(movie.backdrop_path, 'w1280')
  const posterUrl = getImageUrl(movie.poster_path, 'w342')
  const year = formatYear(movie.release_date)
  const runtime = movie.runtime ? formatRuntime(movie.runtime) : null

  const handleFavorite = () => {
    if (isMovieFavorite) {
      removeFavorite(movie.id, 'movie')
    } else {
      addFavorite(movie.id, 'movie')
    }
  }

  const handleRating = (rating: number) => {
    setRating(movie.id, 'movie', rating)
  }

  return (
    <section className="relative overflow-hidden rounded-2xl border border-border">
      {backdropUrl && !backdropError && (
        <img
          src={backdropUrl}
          alt=""
          onError={() => setBackdropError(true)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
      <div className="relative z-10 flex flex-col gap-6 p-6 sm:p-10 lg:flex-row lg:items-end">
        <div className="hidden w-48 shrink-0 sm:block lg:w-56">
          <MediaImage
            src={posterUrl}
            alt={movie.title}
            className="aspect-2/3 rounded-xl border border-border shadow-lg"
          />
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-3 text-sm">
            {year && <span className="font-medium text-text-muted">{year}</span>}
            {runtime && <span className="font-medium text-text-muted">{runtime}</span>}
            <span className="flex items-center gap-1 font-semibold text-warning">
              <StarIcon className="h-4 w-4" />
              {formatRating(movie.vote_average)}
            </span>
            <span className="text-text-muted">
              ({movie.vote_count.toLocaleString('pt-BR')} avaliações)
            </span>
          </div>
          <h1 className="text-3xl font-bold leading-tight text-text sm:text-4xl lg:text-5xl">
            {movie.title}
          </h1>
          {movie.original_title && movie.original_title !== movie.title && (
            <p className="text-sm text-text-muted">{movie.original_title}</p>
          )}
          {movie.tagline && <p className="text-base italic text-text-muted">{movie.tagline}</p>}
          {movie.genres.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {movie.genres.map((genre) => (
                <GenreBadge key={genre.id} name={genre.name} />
              ))}
            </div>
          )}
          {director && (
            <p className="text-sm text-text-muted">
              <span className="font-medium text-text">Direção:</span> {director.name}
            </p>
          )}
          <p className="max-w-2xl text-sm leading-relaxed text-text-muted sm:text-base">
            {movie.overview}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <Button
              size="lg"
              variant={isMovieFavorite ? 'primary' : 'outline'}
              onClick={handleFavorite}
            >
              <HeartIcon className="h-4 w-4" filled={isMovieFavorite} />
              {isMovieFavorite ? 'Favoritado' : 'Favoritar'}
            </Button>
          </div>
          <div className="mt-2 rounded-xl border border-border bg-surface/60 p-4">
            <StarRating value={userRating} onChange={handleRating} label="Sua avaliação" />
          </div>
        </div>
      </div>
    </section>
  )
}
