import { Carousel } from '@/components/home'
import { MovieCard } from '@/components/movie'
import { EmptyState, ErrorState, Skeleton } from '@/components/ui'
import type { TMDBGenre, TMDBMovie } from '@/types'

interface SimilarMoviesSectionProps {
  movies?: TMDBMovie[]
  genres?: TMDBGenre[]
  isLoading?: boolean
  isError?: boolean
  onRetry?: () => void
}

export function SimilarMoviesSection({
  movies,
  genres,
  isLoading = false,
  isError = false,
  onRetry,
}: SimilarMoviesSectionProps) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-text sm:text-xl">Filmes similares</h2>
      {isLoading ? (
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="w-40 shrink-0 sm:w-44">
              <Skeleton className="aspect-2/3 w-full rounded-lg" />
              <Skeleton className="mt-2 h-4 w-3/4" />
              <Skeleton className="mt-1 h-3 w-1/2" />
            </div>
          ))}
        </div>
      ) : isError ? (
        <ErrorState onRetry={onRetry} />
      ) : !movies || movies.length === 0 ? (
        <EmptyState
          title="Nenhum filme similar encontrado"
          description="Tente novamente mais tarde."
        />
      ) : (
        <Carousel>
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} genres={genres} />
          ))}
        </Carousel>
      )}
    </section>
  )
}
