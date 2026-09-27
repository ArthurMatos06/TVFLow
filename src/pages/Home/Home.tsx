import { Fragment, type ReactNode } from 'react'
import type { UseQueryResult } from '@tanstack/react-query'
import { Carousel, ContentSection, Hero } from '@/components/home'
import { MovieCard } from '@/components/movie'
import { TvCard } from '@/components/tv'
import { EmptyState, ErrorState, Skeleton } from '@/components/ui'
import {
  useGenres,
  useLatestMovies,
  useMoviesByGenre,
  usePopularMovies,
  usePopularTVShows,
  useTopRatedMovies,
  useTrendingMovies,
} from '@/hooks'

const ACTION_GENRE_ID = 28
const COMEDY_GENRE_ID = 35
const HORROR_GENRE_ID = 27
const SCIFI_GENRE_ID = 878

interface MediaRowProps<T extends { id: number }> {
  title: string
  viewAllLink?: string
  query: UseQueryResult<T[]>
  renderItem: (item: T) => ReactNode
}

function MediaRow<T extends { id: number }>({
  title,
  viewAllLink,
  query,
  renderItem,
}: MediaRowProps<T>) {
  return (
    <ContentSection title={title} viewAllLink={viewAllLink}>
      {query.isLoading ? (
        <CardSkeletonRow />
      ) : query.isError ? (
        <ErrorState onRetry={() => void query.refetch()} />
      ) : !query.data || query.data.length === 0 ? (
        <EmptyState title="Nenhum conteúdo encontrado" description="Tente novamente mais tarde." />
      ) : (
        <Carousel>
          {query.data.map((item) => (
            <Fragment key={item.id}>{renderItem(item)}</Fragment>
          ))}
        </Carousel>
      )}
    </ContentSection>
  )
}

function CardSkeletonRow() {
  return (
    <div className="flex gap-4 overflow-hidden">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="w-40 shrink-0 sm:w-44">
          <Skeleton className="aspect-[2/3] w-full rounded-lg" />
          <Skeleton className="mt-2 h-4 w-3/4" />
          <Skeleton className="mt-1 h-3 w-1/2" />
        </div>
      ))}
    </div>
  )
}

export function Home() {
  const { data: genres } = useGenres()
  const popularMovies = usePopularMovies()
  const trendingMovies = useTrendingMovies()
  const topRatedMovies = useTopRatedMovies()
  const latestMovies = useLatestMovies()
  const popularTVShows = usePopularTVShows()
  const actionMovies = useMoviesByGenre(ACTION_GENRE_ID)
  const comedyMovies = useMoviesByGenre(COMEDY_GENRE_ID)
  const horrorMovies = useMoviesByGenre(HORROR_GENRE_ID)
  const scifiMovies = useMoviesByGenre(SCIFI_GENRE_ID)

  const heroMovie = popularMovies.data?.[0]

  return (
    <div className="flex flex-col gap-10 py-6 sm:gap-12 sm:py-8">
      <Hero movie={heroMovie} genres={genres} isLoading={popularMovies.isLoading} />

      <MediaRow
        title="Filmes populares"
        viewAllLink="/movies"
        query={popularMovies}
        renderItem={(movie) => <MovieCard movie={movie} genres={genres} />}
      />

      <MediaRow
        title="Séries populares"
        viewAllLink="/tv"
        query={popularTVShows}
        renderItem={(show) => <TvCard show={show} genres={genres} />}
      />

      <MediaRow
        title="Mais bem avaliados"
        query={topRatedMovies}
        renderItem={(movie) => <MovieCard movie={movie} genres={genres} />}
      />

      <MediaRow
        title="Lançamentos"
        query={latestMovies}
        renderItem={(movie) => <MovieCard movie={movie} genres={genres} />}
      />

      <MediaRow
        title="Tendências"
        query={trendingMovies}
        renderItem={(movie) => <MovieCard movie={movie} genres={genres} />}
      />

      <MediaRow
        title="Filmes de ação"
        query={actionMovies}
        renderItem={(movie) => <MovieCard movie={movie} genres={genres} />}
      />

      <MediaRow
        title="Comédia"
        query={comedyMovies}
        renderItem={(movie) => <MovieCard movie={movie} genres={genres} />}
      />

      <MediaRow
        title="Terror"
        query={horrorMovies}
        renderItem={(movie) => <MovieCard movie={movie} genres={genres} />}
      />

      <MediaRow
        title="Ficção científica"
        query={scifiMovies}
        renderItem={(movie) => <MovieCard movie={movie} genres={genres} />}
      />
    </div>
  )
}
