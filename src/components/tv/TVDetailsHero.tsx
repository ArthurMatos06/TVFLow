import { useState } from 'react'
import { Button, GenreBadge, HeartIcon, MediaImage, StarIcon, StarRating } from '@/components/ui'
import { useFavorites, useRatings } from '@/hooks'
import { getImageUrl } from '@/services/tmdb'
import type { TVShowDetailsResponse } from '@/types'
import { formatRating, formatYear } from '@/utils/media'

interface TVDetailsHeroProps {
  show: TVShowDetailsResponse
}

export function TVDetailsHero({ show }: TVDetailsHeroProps) {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites()
  const { setRating, getRating } = useRatings()
  const isShowFavorite = isFavorite(show.id)
  const userRating = getRating(show.id) ?? 0
  const [backdropError, setBackdropError] = useState(false)

  const backdropUrl = getImageUrl(show.backdrop_path, 'w1280')
  const posterUrl = getImageUrl(show.poster_path, 'w342')
  const year = formatYear(show.first_air_date)

  const handleFavorite = () => {
    if (isShowFavorite) {
      removeFavorite(show.id,"tv")
    } else {
      addFavorite(show.id, 'tv')
    }
  }

  const handleRating = (rating: number) => {
    setRating(show.id, 'tv', rating)
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
            alt={show.name}
            className="aspect-2/3 rounded-xl border border-border shadow-lg"
          />
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-3 text-sm">
            {year && <span className="font-medium text-text-muted">{year}</span>}
            <span className="font-medium text-text-muted">
              {show.number_of_seasons} temporada{show.number_of_seasons !== 1 ? 's' : ''} ·{' '}
              {show.number_of_episodes} episódios
            </span>
            <span className="flex items-center gap-1 font-semibold text-warning">
              <StarIcon className="h-4 w-4" />
              {formatRating(show.vote_average)}
            </span>
            <span className="text-text-muted">
              ({show.vote_count.toLocaleString('pt-BR')} avaliações)
            </span>
          </div>
          <h1 className="text-3xl font-bold leading-tight text-text sm:text-4xl lg:text-5xl">
            {show.name}
          </h1>
          {show.original_name && show.original_name !== show.name && (
            <p className="text-sm text-text-muted">{show.original_name}</p>
          )}
          {show.tagline && <p className="text-base italic text-text-muted">{show.tagline}</p>}
          {show.genres.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {show.genres.map((genre) => (
                <GenreBadge key={genre.id} name={genre.name} />
              ))}
            </div>
          )}
          <p className="max-w-2xl text-sm leading-relaxed text-text-muted sm:text-base">
            {show.overview}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <Button
              size="lg"
              variant={isShowFavorite ? 'primary' : 'outline'}
              onClick={handleFavorite}
            >
              <HeartIcon className="h-4 w-4" filled={isShowFavorite} />
              {isShowFavorite ? 'Favoritado' : 'Favoritar'}
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
