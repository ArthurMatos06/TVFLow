import { Carousel } from '@/components/home'
import { TvCard } from '@/components/tv'
import { EmptyState, ErrorState, Skeleton } from '@/components/ui'
import type { TMDBGenre, TMDBTVShow } from '@/types'

interface SimilarTVShowsSectionProps {
  shows?: TMDBTVShow[]
  genres?: TMDBGenre[]
  isLoading?: boolean
  isError?: boolean
  onRetry?: () => void
}

export function SimilarTVShowsSection({
  shows,
  genres,
  isLoading = false,
  isError = false,
  onRetry,
}: SimilarTVShowsSectionProps) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-text sm:text-xl">Séries similares</h2>
      {isLoading ? (
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="w-40 shrink-0 sm:w-44">
              <Skeleton className="aspect-[2/3] w-full rounded-lg" />
              <Skeleton className="mt-2 h-4 w-3/4" />
              <Skeleton className="mt-1 h-3 w-1/2" />
            </div>
          ))}
        </div>
      ) : isError ? (
        <ErrorState onRetry={onRetry} />
      ) : !shows || shows.length === 0 ? (
        <EmptyState
          title="Nenhuma série similar encontrada"
          description="Tente novamente mais tarde."
        />
      ) : (
        <Carousel>
          {shows.map((show) => (
            <TvCard key={show.id} show={show} genres={genres} />
          ))}
        </Carousel>
      )}
    </section>
  )
}
