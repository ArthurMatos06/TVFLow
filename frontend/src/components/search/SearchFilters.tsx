import { clsx } from 'clsx'
import { useState } from 'react'
import { Button, ChevronDownIcon } from '@/components/ui'
import type { TMDBGenre } from '@/types'
import type { SearchType } from '@/types/search'
import { DEFAULT_SORT, MOVIE_SORT_OPTIONS, TV_SORT_OPTIONS } from '@/utils/search'

interface SortOption {
  value: string
  label: string
}

interface SearchFiltersProps {
  type?: SearchType
  genreId: number | null
  year: string
  sortBy: string
  genres: TMDBGenre[]
  sortOptions?: readonly SortOption[]
  onTypeChange?: (type: SearchType) => void
  onGenreChange: (genreId: number | null) => void
  onYearChange: (year: string) => void
  onSortChange: (sortBy: string) => void
  onReset?: () => void
}

const TYPE_OPTIONS: { value: SearchType; label: string }[] = [
  { value: 'multi', label: 'Todos' },
  { value: 'movie', label: 'Filmes' },
  { value: 'tv', label: 'Séries' },
]

function selectClasses(isActive: boolean) {
  return clsx(
    'rounded-md border bg-surface px-3 py-2 text-sm text-text transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent',
    isActive ? 'border-accent/60' : 'border-border',
  )
}

export function SearchFilters({
  type,
  genreId,
  year,
  sortBy,
  genres,
  sortOptions,
  onTypeChange,
  onGenreChange,
  onYearChange,
  onSortChange,
  onReset,
}: SearchFiltersProps) {
  const [isOpen, setIsOpen] = useState(true)
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: currentYear - 1900 + 1 }, (_, index) => currentYear - index)
  const resolvedSortOptions =
    type !== undefined
      ? type === 'tv'
        ? TV_SORT_OPTIONS
        : MOVIE_SORT_OPTIONS
      : (sortOptions ?? MOVIE_SORT_OPTIONS)

  const hasActiveType = type !== undefined && type !== 'multi'
  const hasActiveGenre = genreId !== null
  const hasActiveYear = year !== ''
  const hasActiveSort = sortBy !== DEFAULT_SORT
  const activeFilterCount = [hasActiveType, hasActiveGenre, hasActiveYear, hasActiveSort].filter(
    Boolean,
  ).length

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        className="flex w-fit items-center gap-2 rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium text-text transition-colors hover:bg-surface-hover"
      >
        <span>Filtros</span>
        {activeFilterCount > 0 && (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-semibold text-white">
            {activeFilterCount}
          </span>
        )}
        <ChevronDownIcon
          className={clsx(
            'h-4 w-4 text-text-muted transition-transform duration-200',
            isOpen && 'rotate-180',
          )}
        />
      </button>

      <div
        inert={!isOpen}
        className={clsx(
          'grid transition-all duration-300 ease-out',
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
        )}
      >
        <div className="overflow-hidden">
          <div className="flex flex-wrap items-center gap-3">
            {onTypeChange && type !== undefined && (
              <div
                className="flex rounded-md border border-border bg-surface p-0.5"
                role="group"
                aria-label="Tipo de conteúdo"
              >
                {TYPE_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => onTypeChange(option.value)}
                    aria-pressed={type === option.value}
                    className={clsx(
                      'rounded px-3 py-1.5 text-sm font-medium transition-colors',
                      type === option.value ? 'bg-primary text-white' : 'text-text-muted hover:text-text',
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}

            <select
              value={genreId ?? ''}
              onChange={(event) => onGenreChange(event.target.value ? Number(event.target.value) : null)}
              className={selectClasses(hasActiveGenre)}
              aria-label="Filtrar por gênero"
            >
              <option value="">Todos os gêneros</option>
              {genres.map((genre) => (
                <option key={genre.id} value={genre.id}>
                  {genre.name}
                </option>
              ))}
            </select>

            <select
              value={year}
              onChange={(event) => onYearChange(event.target.value)}
              className={selectClasses(hasActiveYear)}
              aria-label="Filtrar por ano"
            >
              <option value="">Todos os anos</option>
              {years.map((optionYear) => (
                <option key={optionYear} value={optionYear}>
                  {optionYear}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(event) => onSortChange(event.target.value)}
              className={selectClasses(hasActiveSort)}
              aria-label="Ordenar resultados"
            >
              {resolvedSortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {onReset && activeFilterCount > 0 && (
              <Button variant="outline" size="sm" onClick={onReset}>
                Limpar filtros
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
