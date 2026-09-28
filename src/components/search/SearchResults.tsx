import { Link } from 'react-router-dom'
import { MediaImage, StarIcon } from '@/components/ui'
import { getImageUrl } from '@/services/tmdb'
import type { TMDBGenre } from '@/types'
import type { SearchResultItem } from '@/types/search'
import { formatRating, formatYear, getGenreNames } from '@/utils/media'

interface SearchResultsProps {
  items: SearchResultItem[]
  genres?: TMDBGenre[]
  totalResults?: number
}

export function SearchResults({ items, genres, totalResults }: SearchResultsProps) {
  return (
    <div className="flex flex-col gap-4">
      {totalResults !== undefined && (
        <p className="text-sm text-text-muted">
          {totalResults} {totalResults === 1 ? 'resultado' : 'resultados'}
        </p>
      )}
      <div className="stagger-fade-in grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {items.map((item) => (
          <SearchResultCard key={`${item.mediaType}-${item.id}`} item={item} genres={genres} />
        ))}
      </div>
    </div>
  )
}

interface SearchResultCardProps {
  item: SearchResultItem
  genres?: TMDBGenre[]
}

function SearchResultCard({ item, genres }: SearchResultCardProps) {
  const posterUrl = getImageUrl(item.posterPath, 'w342')
  const year = formatYear(item.releaseDate)
  const genreNames = getGenreNames(item.genreIds, genres).slice(0, 2)
  const href = item.mediaType === 'movie' ? `/movie/${item.id}` : `/tv/${item.id}`

  return (
    <Link to={href} className="group animate-fade-in flex flex-col">
      <div className="relative">
        <MediaImage
          src={posterUrl}
          alt={item.title}
          className="aspect-[2/3] rounded-lg border border-border"
          imgClassName="transition-transform duration-300 group-hover:scale-105"
        />
        <span className="absolute right-2 top-2 flex items-center gap-1 rounded-md bg-background/80 px-1.5 py-0.5 text-xs font-semibold text-warning backdrop-blur">
          <StarIcon className="h-3 w-3" />
          {formatRating(item.voteAverage)}
        </span>
      </div>
      <div className="mt-2">
        <h3 className="truncate text-sm font-medium text-text transition-colors group-hover:text-primary">
          {item.title}
        </h3>
        <p className="mt-0.5 truncate text-xs text-text-muted">
          {[year, ...genreNames].filter(Boolean).join(' · ')}
        </p>
      </div>
    </Link>
  )
}
