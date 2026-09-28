import { useSearchParams } from 'react-router-dom'
import { useMemo, useCallback } from 'react'

interface TVFilters {
  genreId: string | null
  year: string | null
  sortBy: string
  page: number
}

export function useTVFilters() {
  const [searchParams, setSearchParams] = useSearchParams()

  const filters = useMemo<TVFilters>(() => {
    return {
      genreId: searchParams.get('genre') || null,
      year: searchParams.get('year') || null,
      sortBy: searchParams.get('sort') || 'popularity.desc',
      page: parseInt(searchParams.get('page') || '1'),
    }
  }, [searchParams])

  const setGenreId = useCallback((genreId: string | null) => {
    const params = new URLSearchParams(searchParams)
    if (genreId) {
      params.set('genre', genreId)
    } else {
      params.delete('genre')
    }
    params.set('page', '1')
    setSearchParams(params)
  }, [searchParams, setSearchParams])

  const setYear = useCallback((year: string | null) => {
    const params = new URLSearchParams(searchParams)
    if (year) {
      params.set('year', year)
    } else {
      params.delete('year')
    }
    params.set('page', '1')
    setSearchParams(params)
  }, [searchParams, setSearchParams])

  const setSortBy = useCallback((sortBy: string) => {
    const params = new URLSearchParams(searchParams)
    params.set('sort', sortBy)
    params.set('page', '1')
    setSearchParams(params)
  }, [searchParams, setSearchParams])

  const setPage = useCallback((page: number) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', String(page))
    setSearchParams(params)
  }, [searchParams, setSearchParams])

  const resetFilters = useCallback(() => {
    setSearchParams(new URLSearchParams())
  }, [setSearchParams])

  return {
    filters,
    setGenreId,
    setYear,
    setSortBy,
    setPage,
    resetFilters,
  }
}
