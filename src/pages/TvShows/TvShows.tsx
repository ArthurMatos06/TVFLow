import { SearchFilters } from '@/components/search'
import { EmptyState, ErrorState, Pagination, Skeleton } from '@/components/ui'
import { TvCard } from '@/components/tv'
import { useDiscoverTVShows, useGenres, useTVFilters } from '@/hooks'
import { TV_SORT_OPTIONS } from '@/utils/search'

export function TvShows() {
  const { filters, setGenreId, setYear, setSortBy, setPage, resetFilters } = useTVFilters()
  const { data: genresData } = useGenres()
  const { data, isLoading, isError, error, refetch } = useDiscoverTVShows({
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
        <h1 className="text-4xl font-bold text-text">Séries</h1>
        <p className="mt-2 text-text-muted">Explore nossa vasta coleção de séries</p>
      </div>

      <SearchFilters
        genreId={filters.genreId ? parseInt(filters.genreId) : null}
        year={filters.year ?? ''}
        sortBy={filters.sortBy}
        genres={genresData || []}
        sortOptions={TV_SORT_OPTIONS}
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
          title="Erro ao carregar séries"
          description={error?.message || 'Tente novamente'}
          onRetry={() => refetch()}
        />
      ) : data?.results.length === 0 ? (
        <EmptyState
          title="Nenhuma série encontrada"
          description="Tente ajustar seus filtros"
        />
      ) : (
        <>
          <div className="stagger-fade-in grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {data?.results.map((show, index) => (
              <div
                key={show.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <TvCard show={show} genres={genresData || []} />
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
