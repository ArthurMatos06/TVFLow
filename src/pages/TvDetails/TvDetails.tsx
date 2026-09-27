import { useParams } from 'react-router-dom'
import { SeasonsAccordion, SimilarTVShowsSection, TVDetailsHero } from '@/components/tv'
import { CastGrid, ErrorState, Skeleton, TrailerEmbed } from '@/components/ui'
import { useGenres, useSimilarTVShows, useTVShowDetails } from '@/hooks'

export function TvDetails() {
  const { id } = useParams<{ id: string }>()
  const tvId = Number(id)

  const details = useTVShowDetails(tvId)
  const similar = useSimilarTVShows(tvId)
  const { data: genres } = useGenres()

  if (details.isLoading) {
    return <DetailsSkeleton />
  }

  if (details.isError) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <ErrorState onRetry={() => void details.refetch()} />
      </div>
    )
  }

  if (!details.data) return null

  const show = details.data
  const trailer = show.videos.results.find(
    (video) => video.site === 'YouTube' && video.type === 'Trailer',
  )

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <TVDetailsHero show={show} />

      {trailer && <TrailerEmbed videoKey={trailer.key} title={`Trailer de ${show.name}`} />}

      {show.credits.cast.length > 0 && (
        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-text sm:text-xl">Elenco</h2>
          <CastGrid cast={show.credits.cast} />
        </section>
      )}

      <SeasonsAccordion seasons={show.seasons} />

      <SimilarTVShowsSection
        shows={similar.data}
        genres={genres}
        isLoading={similar.isLoading}
        isError={similar.isError}
        onRetry={() => void similar.refetch()}
      />
    </div>
  )
}

function DetailsSkeleton() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <Skeleton className="h-[420px] w-full rounded-2xl lg:h-[520px]" />
      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="w-32 shrink-0 sm:w-36">
            <Skeleton className="aspect-[2/3] w-full rounded-lg" />
            <Skeleton className="mt-2 h-4 w-3/4" />
            <Skeleton className="mt-1 h-3 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  )
}
