import { clsx } from 'clsx'
import type { TMDBGenre } from '@/types'
import type { SearchType } from '@/types/search'
import { MOVIE_SORT_OPTIONS, TV_SORT_OPTIONS } from '@/utils/search'

interface SearchFiltersProps {
  type: SearchType
  genreId: number | null
  year: string
  sortBy: string
  genres: TMDBGenre[]
  onTypeChange: (type: SearchType) => void
  onGenreChange: (genreId: number | null) => void
  onYearChange: (year: string) => void
  onSortChange: (sortBy: string) => void
}

const TYPE_OPTIONS: { value: SearchType; label: string }[] = [
  { value: 'multi', label: 'Todos' },
  { value: 'movie', label: 'Filmes' },
  { value: 'tv', label: 'Séries' },
]

const selectClasses =
  'rounded-md border border-border bg-surface px-3 py-2 text-sm text-text focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent'

export function SearchFilters({
  type,
  genreId,
  year,
  sortBy,
  genres,
  onTypeChange,
  onGenreChange,
  onYearChange,
  onSortChange,
}: SearchFiltersProps) {
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: currentYear - 1900 + 1 }, (_, index) => currentYear - index)
  const sortOptions = type === 'tv' ? TV_SORT_OPTIONS : MOVIE_SORT_OPTIONS

  return (
    <div className="flex flex-wrap items-center gap-3">
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
              type === option.value
                ? 'bg-primary text-white'
                : 'text-text-muted hover:text-text',
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      <select
        value={genreId ?? ''}
        onChange={(event) => onGenreChange(event.target.value ? Number(event.target.value) : null)}
        className={selectClasses}
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
        className={selectClasses}
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
        className={selectClasses}
        aria-label="Ordenar resultados"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
