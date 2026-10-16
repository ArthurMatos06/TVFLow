import { memo, useCallback, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { clsx } from 'clsx'
import { Link } from 'react-router-dom'
import { Button, EmptyState, HeartIcon, MediaImage, Modal, Skeleton } from '@/components/ui'
import { useFavorites, useMovieDetails, useTVShowDetails } from '@/hooks'
import { getImageUrl } from '@/services/tmdb'
import type { Favorite, MediaType } from '@/types'
import { formatYear } from '@/utils/media'

type FilterType = 'all' | MediaType
type SortOrder = 'recent' | 'oldest'

const filterOptions: { value: FilterType; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'movie', label: 'Filmes' },
  { value: 'tv', label: 'Séries' },
]

const sortOptions: { value: SortOrder; label: string }[] = [
  { value: 'recent', label: 'Recentes' },
  { value: 'oldest', label: 'Antigos' },
]

const REMOVAL_ANIMATION_MS = 300

export function Favorites() {
  const { favorites, removeFavorite } = useFavorites()
  const [filter, setFilter] = useState<FilterType>('all')
  const [sort, setSort] = useState<SortOrder>('recent')
  const [pendingRemoval, setPendingRemoval] = useState<Favorite | null>(null)
  const [removingId, setRemovingId] = useState<string | null>(null)

  const visibleFavorites = useMemo(() => {
    const filtered = filter === 'all' ? favorites : favorites.filter((f) => f.mediaType === filter)
    return [...filtered].sort((a, b) => {
      const diff = a.createdAt.localeCompare(b.createdAt)
      return sort === 'recent' ? -diff : diff
    })
  }, [favorites, filter, sort])

  const setFilterType = useCallback((value: FilterType) => setFilter(value), [])
  const setSortBy = useCallback((value: SortOrder) => setSort(value), [])
  const handleRemove = useCallback((favorite: Favorite) => setPendingRemoval(favorite), [])

  const handleConfirmRemove = useCallback(() => {
    if (!pendingRemoval) return
    setRemovingId(pendingRemoval.id)
    window.setTimeout(() => {
      removeFavorite(pendingRemoval.mediaId,pendingRemoval.mediaType)
      setPendingRemoval(null)
      setRemovingId(null)
    }, REMOVAL_ANIMATION_MS)
  }, [pendingRemoval, removeFavorite])

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-text sm:text-3xl">Favoritos</h1>
        <p className="text-sm text-text-muted">Filmes e séries que você salvou.</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {filterOptions.map((option) => (
            <Button
              key={option.value}
              size="sm"
              variant={filter === option.value ? 'primary' : 'outline'}
              onClick={() => setFilterType(option.value)}
              aria-pressed={filter === option.value}
            >
              {option.label}
            </Button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {sortOptions.map((option) => (
            <Button
              key={option.value}
              size="sm"
              variant={sort === option.value ? 'primary' : 'outline'}
              onClick={() => setSortBy(option.value)}
              aria-pressed={sort === option.value}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      {visibleFavorites.length === 0 ? (
        <EmptyState
          title="Nenhum favorito"
          description="Favorite filmes e séries para vê-los aqui."
          icon={<HeartIcon className="h-8 w-8 animate-bounce-soft" />}
        />
      ) : (
        <div className="stagger-fade-in grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {visibleFavorites.map((favorite) => (
            <FavoriteCard
              key={favorite.id}
              favorite={favorite}
              onRemove={handleRemove}
              removing={removingId === favorite.id}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={Boolean(pendingRemoval)}
        onClose={() => setPendingRemoval(null)}
        title="Remover favorito"
      >
        <p className="text-sm text-text-muted">
          Tem certeza que deseja remover este item dos seus favoritos?
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setPendingRemoval(null)}>
            Cancelar
          </Button>
          <Button onClick={handleConfirmRemove}>Remover</Button>
        </div>
      </Modal>
    </div>
  )
}

interface FavoriteCardProps {
  favorite: Favorite
  onRemove: (favorite: Favorite) => void
  removing?: boolean
}

const FavoriteCard = memo(
  function FavoriteCard({ favorite, onRemove, removing = false }: FavoriteCardProps) {
    const handleRemove = () => onRemove(favorite)
    return favorite.mediaType === 'movie'  ? (
      <FavoriteMovieCard favorite={favorite} onRemove={handleRemove} removing={removing} />
    ) : (
      <FavoriteTVCard favorite={favorite} onRemove={handleRemove} removing={removing} />
    )
  },
  (prev, next) =>
    prev.favorite.id === next.favorite.id &&
    prev.onRemove === next.onRemove &&
    prev.removing === next.removing,
)

interface FavoriteMediaCardProps {
  favorite: Favorite
  onRemove: () => void
  removing: boolean
}

function FavoriteMovieCard({ favorite, onRemove, removing }: FavoriteMediaCardProps) {
  const { data: movie, isLoading, isError } = useMovieDetails(favorite.mediaId)

  if (isLoading) return <FavoriteCardSkeleton removing={removing} />

  return (
    <FavoriteCardShell onRemove={onRemove} removing={removing}>
      {isError || !movie ? (
        <FavoriteCardFallback />
      ) : (
        <Link to={`/movie/${movie.id}`} className="flex flex-col">
          <div className="relative">
            <MediaImage
              src={getImageUrl(movie.poster_path, 'w342')}
              alt={movie.title}
              className="aspect-2/3 rounded-lg border border-border"
              imgClassName="transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <h3 className="mt-2 truncate text-sm font-medium text-text transition-colors group-hover:text-primary">
            {movie.title}
          </h3>
          <p className="mt-0.5 truncate text-xs text-text-muted">{formatYear(movie.release_date)}</p>
        </Link>
      )}
    </FavoriteCardShell>
  )
}

function FavoriteTVCard({ favorite, onRemove, removing }: FavoriteMediaCardProps) {
  const { data: show, isLoading, isError } = useTVShowDetails(favorite.mediaId)

  if (isLoading) return <FavoriteCardSkeleton removing={removing} />

  return (
    <FavoriteCardShell onRemove={onRemove} removing={removing}>
      {isError || !show ? (
        <FavoriteCardFallback />
      ) : (
        <Link to={`/tv/${show.id}`} className="flex flex-col">
          <div className="relative">
            <MediaImage
              src={getImageUrl(show.poster_path, 'w342')}
              alt={show.name}
              className="aspect-2/3 rounded-lg border border-border"
              imgClassName="transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <h3 className="mt-2 truncate text-sm font-medium text-text transition-colors group-hover:text-primary">
            {show.name}
          </h3>
          <p className="mt-0.5 truncate text-xs text-text-muted">{formatYear(show.first_air_date)}</p>
        </Link>
      )}
    </FavoriteCardShell>
  )
}

function FavoriteCardShell({
  children,
  onRemove,
  removing,
}: {
  children: ReactNode
  onRemove: () => void
  removing: boolean
}) {
  return (
    <div
      className={clsx('group relative animate-fade-in', removing && 'animate-fade-out')}
      style={removing ? { animationDelay: '0ms' } : undefined}
    >
      {children}
      <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/60 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100">
        <Button size="sm" variant="outline" onClick={onRemove}>
          Remover
        </Button>
      </div>
    </div>
  )
}

function FavoriteCardSkeleton({ removing }: { removing: boolean }) {
  return (
    <div
      className={clsx('flex flex-col animate-fade-in', removing && 'animate-fade-out')}
      style={removing ? { animationDelay: '0ms' } : undefined}
    >
      <Skeleton className="aspect-2/3 w-full rounded-lg" />
      <Skeleton className="mt-2 h-4 w-3/4" />
      <Skeleton className="mt-1 h-3 w-1/2" />
    </div>
  )
}

function FavoriteCardFallback() {
  return (
    <div className="flex aspect-2/3 items-center justify-center rounded-lg border border-border bg-surface">
      <HeartIcon className="h-6 w-6 text-text-muted" />
    </div>
  )
}
