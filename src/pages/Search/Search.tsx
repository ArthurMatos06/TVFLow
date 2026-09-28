import { useCallback } from 'react'
import type { ReactNode } from 'react'
import { SearchBar, SearchEmpty, SearchFilters, SearchResults } from '@/components/search'
import { ErrorState, Pagination, Skeleton } from '@/components/ui'
import {
  useDiscoverMovies,
  useDiscoverTVShows,
  useGenres,
  useSearchFilters,
  useSearchMovies,
  useSearchMulti,
  useSearchTVShows,
} from '@/hooks'
import type { SearchType } from '@/types/search'
import { DEFAULT_SORT, isValidQuery, toSearchResultItem } from '@/utils/search'

export function Search() {
  const {
    filters,
    query,
    debouncedQuery,
    setQuery,
    setType,
    setGenreId,
    setYear,
    setSortBy,
    setPage,
    resetFilters,
  } = useSearchFilters()

  const { data: genres } = useGenres()

  const hasQuery = isValidQuery(debouncedQuery)
  const { type, genreId, year, sortBy, page } = filters

  const searchMovies = useSearchMovies(
    { query: debouncedQuery, page },
    hasQuery && type === 'movie',
  )
  const searchTVShows = useSearchTVShows(
    { query: debouncedQuery, page },
    hasQuery && type === 'tv',
  )
  const searchMulti = useSearchMulti(
    { query: debouncedQuery, page },
    hasQuery && type === 'multi',
  )
  const discoverMovies = useDiscoverMovies(
    { genreId, year, sortBy, page },
    !hasQuery && type === 'movie',
  )
  const discoverTVShows = useDiscoverTVShows(
    { genreId, year, sortBy, page },
    !hasQuery && type === 'tv',
  )

  const activeQuery = hasQuery
    ? type === 'movie'
      ? searchMovies
      : type === 'tv'
        ? searchTVShows
        : searchMulti
    : type === 'movie'
      ? discoverMovies
      : type === 'tv'
        ? discoverTVShows
        : null

  const hasFilters = Boolean(genreId || year || sortBy !== DEFAULT_SORT || type !== 'multi')

  const handleTypeChange = useCallback((nextType: SearchType) => setType(nextType), [setType])
  const handleGenreChange = useCallback(
    (nextGenreId: number | null) => setGenreId(nextGenreId),
    [setGenreId],
  )
  const handleYearChange = useCallback((nextYear: string) => setYear(nextYear), [setYear])
  const handleSortChange = useCallback((nextSortBy: string) => setSortBy(nextSortBy), [setSortBy])
  const handlePageChange = useCallback((nextPage: number) => setPage(nextPage), [setPage])

  const renderContent = (): ReactNode => {
    if (!activeQuery) {
      return (
        <SearchEmpty
          query={debouncedQuery}
          hasFilters={hasFilters}
          onResetFilters={resetFilters}
        />
      )
    }

    if (activeQuery.isLoading) {
      return <SearchResultsSkeleton />
    }

    if (activeQuery.isError) {
      return <ErrorState onRetry={() => void activeQuery.refetch()} />
    }

    const data = activeQuery.data
    if (!data || data.results.length === 0) {
      return (
        <SearchEmpty
          query={debouncedQuery}
          hasFilters={hasFilters}
          onResetFilters={resetFilters}
        />
      )
    }

    const items = data.results
      .filter(
        (result) =>
          !('media_type' in result) ||
          result.media_type === 'movie' ||
          result.media_type === 'tv',
      )
      .map(toSearchResultItem)

    return (
      <>
        <SearchResults items={items} genres={genres} totalResults={data.total_results} />
        <Pagination currentPage={data.page} totalPages={data.total_pages} onPageChange={handlePageChange} />
      </>
    )
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-text sm:text-3xl">Buscar</h1>
        <p className="text-sm text-text-muted">
          Encontre filmes e séries pelo nome, gênero ou ano.
        </p>
      </div>

      <SearchBar value={query} onChange={setQuery} />

      <SearchFilters
        type={type}
        genreId={genreId}
        year={year}
        sortBy={sortBy}
        genres={genres ?? []}
        onTypeChange={handleTypeChange}
        onGenreChange={handleGenreChange}
        onYearChange={handleYearChange}
        onSortChange={handleSortChange}
      />

      {renderContent()}
    </div>
  )
}

function SearchResultsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {Array.from({ length: 12 }).map((_, index) => (
        <div key={index} className="flex flex-col">
          <Skeleton className="aspect-[2/3] w-full rounded-lg" />
          <Skeleton className="mt-2 h-4 w-3/4" />
          <Skeleton className="mt-1 h-3 w-1/2" />
        </div>
      ))}
    </div>
  )
}
