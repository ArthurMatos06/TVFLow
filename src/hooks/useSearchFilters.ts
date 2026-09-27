import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { SearchFilters, SearchState, SearchType } from '@/types/search'
import { buildParams, parseParams } from '@/utils/search'

const DEBOUNCE_MS = 400

interface UseSearchFiltersResult extends SearchState {
  /** Termo digitado no campo de busca (sem debounce). */
  query: string
  setQuery: (query: string) => void
  setType: (type: SearchType) => void
  setGenreId: (genreId: number | null) => void
  setYear: (year: string) => void
  setSortBy: (sortBy: string) => void
  setPage: (page: number) => void
  resetFilters: () => void
}

/**
 * Gerencia os filtros da busca com sincronização na URL e debounce
 * do termo digitado. A URL é a fonte de verdade: navegar (voltar/avançar)
 * atualiza os filtros automaticamente.
 */
export function useSearchFilters(): UseSearchFiltersResult {
  const [searchParams, setSearchParams] = useSearchParams()
  const filters = useMemo(() => parseParams(searchParams), [searchParams])

  const [query, setQuery] = useState(filters.query)
  const [debouncedQuery, setDebouncedQuery] = useState(filters.query)
  const isDebouncing = query !== debouncedQuery

  // Ajusta o estado local durante o render quando a URL muda
  // (ex.: voltar/avançar no navegador) — padrão recomendado pelo React.
  const [prevUrlQuery, setPrevUrlQuery] = useState(filters.query)
  if (prevUrlQuery !== filters.query) {
    setPrevUrlQuery(filters.query)
    setQuery(filters.query)
    setDebouncedQuery(filters.query)
  }

  // Debounce do termo digitado
  useEffect(() => {
    if (query === debouncedQuery) return
    const timer = setTimeout(() => setDebouncedQuery(query), DEBOUNCE_MS)
    return () => clearTimeout(timer)
  }, [query, debouncedQuery])

  // Persiste os filtros na URL (reseta a página quando o termo muda)
  useEffect(() => {
    const next: SearchFilters = { ...filters, query: debouncedQuery }
    if (debouncedQuery !== filters.query) next.page = 1
    const params = buildParams(next)
    if (params.toString() !== searchParams.toString()) {
      setSearchParams(params, { replace: true })
    }
  }, [debouncedQuery, filters, searchParams, setSearchParams])

  const setType = useCallback(
    (type: SearchType) => {
      setSearchParams((prev) => buildParams({ ...parseParams(prev), type, page: 1 }))
    },
    [setSearchParams],
  )

  const setGenreId = useCallback(
    (genreId: number | null) => {
      setSearchParams((prev) => buildParams({ ...parseParams(prev), genreId, page: 1 }))
    },
    [setSearchParams],
  )

  const setYear = useCallback(
    (year: string) => {
      setSearchParams((prev) => buildParams({ ...parseParams(prev), year, page: 1 }))
    },
    [setSearchParams],
  )

  const setSortBy = useCallback(
    (sortBy: string) => {
      setSearchParams((prev) => buildParams({ ...parseParams(prev), sortBy, page: 1 }))
    },
    [setSearchParams],
  )

  const setPage = useCallback(
    (page: number) => {
      setSearchParams((prev) => buildParams({ ...parseParams(prev), page }))
    },
    [setSearchParams],
  )

  const resetFilters = useCallback(() => {
    setSearchParams(new URLSearchParams(), { replace: true })
  }, [setSearchParams])

  return {
    filters,
    query,
    debouncedQuery,
    isDebouncing,
    setQuery,
    setType,
    setGenreId,
    setYear,
    setSortBy,
    setPage,
    resetFilters,
  }
}
