import { memo, useCallback, useMemo, useState } from "react";
import { clsx } from "clsx";
import { Link } from "react-router-dom";
import { Button, EmptyState, MediaImage, Skeleton } from "@/components/ui";
import { useRatings, useMovieDetails, useTVShowDetails } from "@/hooks";
import { getImageUrl } from "@/services/tmdb";
import type { MediaType, Rating } from "@/types";
import { formatYear } from "@/utils/media";

type FilterType = "all" | MediaType;
type SortOrder = "recent" | "oldest";

const filterOptions: { value: FilterType; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "movie", label: "Filmes" },
  { value: "tv", label: "Séries" },
];

const sortOptions: { value: SortOrder; label: string }[] = [
  { value: "recent", label: "Recentes" },
  { value: "oldest", label: "Antigos" },
];

export function Ratings() {
  const { ratings } = useRatings();

  const [filter, setFilter] = useState<FilterType>("all");
  const [sort, setSort] = useState<SortOrder>("recent");

  const visibleRatings = useMemo(() => {
    const filtered =
      filter === "all"
        ? ratings
        : ratings.filter((rating) => rating.mediaType === filter);

    return [...filtered].sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;

      return sort === "recent" ? dateB - dateA : dateA - dateB;
    });
  }, [ratings, filter, sort]);

  const setFilterType = useCallback(
    (value: FilterType) => setFilter(value),
    [],
  );
  const setSortBy = useCallback((value: SortOrder) => setSort(value), []);

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-text sm:text-3xl">
          Minhas avaliações
        </h1>

        <p className="text-sm text-text-muted">
          Filmes e séries que você avaliou.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {filterOptions.map((option) => (
            <Button
              key={option.value}
              size="sm"
              variant={filter === option.value ? "primary" : "outline"}
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
              variant={sort === option.value ? "primary" : "outline"}
              onClick={() => setSortBy(option.value)}
              aria-pressed={sort === option.value}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      {visibleRatings.length === 0 ? (
        <EmptyState
          title="Nenhuma avaliação"
          description="Avalie filmes e séries para encontrá-los aqui."
          icon={<StarIcon className="h-8 w-8" />}
        />
      ) : (
        <div className="stagger-fade-in grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {visibleRatings.map((rating) => (
            <RatingCard
              key={`${rating.mediaType}-${rating.mediaId}`}
              rating={rating}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface RatingCardProps {
  rating: Rating;
}

const RatingCard = memo(function RatingCard({ rating }: RatingCardProps) {
  return rating.mediaType === "movie" ? (
    <MovieRatingCard rating={rating} />
  ) : (
    <TVRatingCard rating={rating} />
  );
});

function MovieRatingCard({ rating }: RatingCardProps) {
  const { data: movie, isLoading, isError } = useMovieDetails(rating.mediaId);

  if (isLoading) return <RatingCardSkeleton />;

  if (isError || !movie) {
    return <RatingCardFallback />;
  }

  return (
    <RatingCardShell rating={rating}>
      <Link to={`/movie/${movie.id}`} className="flex flex-col">
        <MediaImage
          src={getImageUrl(movie.poster_path, "w342")}
          alt={movie.title}
          className="aspect-2/3 rounded-lg border border-border"
          imgClassName="transition-transform duration-300 group-hover:scale-105"
        />

        <h3 className="mt-2 truncate text-sm font-medium text-text transition-colors group-hover:text-primary">
          {movie.title}
        </h3>

        <p className="mt-0.5 truncate text-xs text-text-muted">
          {formatYear(movie.release_date)}
        </p>
      </Link>
    </RatingCardShell>
  );
}

function TVRatingCard({ rating }: RatingCardProps) {
  const { data: show, isLoading, isError } = useTVShowDetails(rating.mediaId);

  if (isLoading) return <RatingCardSkeleton />;

  if (isError || !show) {
    return <RatingCardFallback />;
  }

  return (
    <RatingCardShell rating={rating}>
      <Link to={`/tv/${show.id}`} className="flex flex-col">
        <MediaImage
          src={getImageUrl(show.poster_path, "w342")}
          alt={show.name}
          className="aspect-2/3 rounded-lg border border-border"
          imgClassName="transition-transform duration-300 group-hover:scale-105"
        />

        <h3 className="mt-2 truncate text-sm font-medium text-text transition-colors group-hover:text-primary">
          {show.name}
        </h3>

        <p className="mt-0.5 truncate text-xs text-text-muted">
          {formatYear(show.first_air_date)}
        </p>
      </Link>
    </RatingCardShell>
  );
}

function RatingCardShell({
  children,
  rating,
}: {
  children: React.ReactNode;
  rating: Rating;
}) {
  return (
    <div className="group relative animate-fade-in">
      {children}

      <div className="pointer-events-none absolute right-2 top-2 flex items-center gap-1 rounded-lg bg-black/80 px-2 py-1 text-sm font-semibold text-white">
        <StarIcon className="h-4 w-4 text-yellow-400" />
        <span>{rating.score}/5</span>
      </div>
    </div>
  );
}

function RatingCardSkeleton() {
  return (
    <div className="flex animate-fade-in flex-col">
      <Skeleton className="aspect-2/3 w-full rounded-lg" />
      <Skeleton className="mt-2 h-4 w-3/4" />
      <Skeleton className="mt-1 h-3 w-1/2" />
    </div>
  );
}

function RatingCardFallback() {
  return (
    <div
      className={clsx(
        "flex aspect-2/3 items-center justify-center rounded-lg border border-border bg-surface",
      )}
    >
      <StarIcon className="h-6 w-6 text-text-muted" />
    </div>
  );
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 6.91-1.01L12 2Z" />
    </svg>
  );
}
