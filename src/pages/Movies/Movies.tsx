import { MovieCard } from '@/components/movie'
import { SearchFilters } from '@/components/search'
import { EmptyState, ErrorState, Pagination, Skeleton } from '@/components/ui'
import { useDiscoverMovies, useGenres, useMovieFilters } from '@/hooks'
import { MOVIE_SORT_OPTIONS } from '@/utils/search'

export function Movies() {
  const { filters, setGenreId, setYear, setSortBy, setPage, resetFilters } = useMovieFilters()
  const { data: genresData } = useGenres()
  const { data, isLoading, isError, error, refetch } = useDiscoverMovies({
    genreId: filters.genreId ? parseInt(filters.genreId) : null,
    year: filters.year ?? '',
    sortBy: filters.sortBy,
    page: filters.page,
  })

  const handleGenreChange = (genreId: number | null) => {
    setGenreId(genreId ? String(genreId) : null)
  }

  const handleYearChange = (year: string) => {
    setYear(year || null)
  }

  const handleSortChange = (sort: string) => {
    setSortBy(sort)
  }

  const handlePageChange = (page: number) => {
    setPage(page)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-text">Filmes</h1>
        <p className="mt-2 text-text-muted">Explore nossa vasta coleção de filmes</p>
      </div>

      <SearchFilters
        genreId={filters.genreId ? parseInt(filters.genreId) : null}
        year={filters.year ?? ''}
        sortBy={filters.sortBy}
        genres={genresData || []}
        sortOptions={MOVIE_SORT_OPTIONS}
        onGenreChange={handleGenreChange}
        onYearChange={handleYearChange}
        onSortChange={handleSortChange}
        onReset={resetFilters}
      />

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="aspect-2/3 rounded-lg" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState
          title="Erro ao carregar filmes"
          description={error?.message || 'Tente novamente'}
          onRetry={() => refetch()}
        />
      ) : data?.results.length === 0 ? (
        <EmptyState
          title="Nenhum filme encontrado"
          description="Tente ajustar seus filtros"
        />
      ) : (
        <>
          <div className="stagger-fade-in grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {data?.results.map((movie, index) => (
              <div
                key={movie.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <MovieCard movie={movie} genres={genresData || []} />
              </div>
            ))}
          </div>

          {data && data.total_pages > 1 && (
            <Pagination
              currentPage={filters.page}
              totalPages={Math.min(data.total_pages, 500)}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  )
}
