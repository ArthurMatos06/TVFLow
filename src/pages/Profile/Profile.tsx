import { useMemo } from "react";
import type { ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  EmptyState,
  FilmIcon,
  HeartIcon,
  MediaImage,
  Skeleton,
  StarIcon,
} from "@/components/ui";
import {
  useFavorites,
  useMovieDetails,
  useRatings,
  useTVShowDetails,
} from "@/hooks";
import { useAuth } from "@/hooks/useAuth";
import { getImageUrl } from "@/services/tmdb";
import type { Favorite, MediaType, Rating } from "@/types";
import { formatYear } from "@/utils/media";

export function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { favorites } = useFavorites();
  const { ratings } = useRatings();

  const stats = useMemo(() => {
    const movieRatings = ratings.filter(
      (rating) => rating.mediaType === "movie",
    );
    const tvRatings = ratings.filter((rating) => rating.mediaType === "tv");
    const averageScore =
      ratings.length > 0
        ? ratings.reduce((sum, rating) => sum + rating.score, 0) /
          ratings.length
        : 0;
    return {
      movieCount: movieRatings.length,
      tvCount: tvRatings.length,
      averageScore,
    };
  }, [ratings]);

  const recentRatings = useMemo(
    () =>
      [...ratings]
        .sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;

          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;

          return dateB - dateA;
        })
        .slice(0, 6),
    [ratings],
  );

  const recentFavorites = useMemo(
    () =>
      [...favorites]
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .slice(0, 6),
    [favorites],
  );

  if (!user) return null;

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <section className="flex flex-col gap-6 rounded-2xl border border-border bg-surface/60 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:gap-6">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-surface text-2xl font-bold text-text transition-transform duration-300 hover:scale-105 sm:h-24 sm:w-24">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="h-full w-full object-cover"
              />
            ) : (
              user.name.charAt(0).toUpperCase()
            )}
          </div>
          <div className="flex flex-col items-center gap-1 text-center sm:items-start sm:text-left">
            <h1 className="text-2xl font-bold text-text sm:text-3xl">
              {user.name}
            </h1>
            <p className="text-sm text-text-muted">@{user.username}</p>
            {user.bio && (
              <p className="mt-1 max-w-md text-sm leading-relaxed text-text-muted">
                {user.bio}
              </p>
            )}
            <p className="mt-1 text-xs text-text-muted">
              Membro desde{" "}
              {new Date(user.createdAt).toLocaleDateString("pt-BR")}
            </p>
          </div>
        </div>
        <div className="flex justify-center lg:justify-end flex-col gap-3">
          <Button variant="outline" onClick={() => navigate("/profile/edit")}>
            Editar perfil
          </Button>
          <Button variant="primary" onClick={() => logout()}>
            Sair do Perfil
          </Button>
        </div>
      </section>

      <section className="stagger-fade-in grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatsCard
          label="Filmes avaliados"
          value={stats.movieCount}
          icon={<FilmIcon className="h-4 w-4" />}
        />
        <StatsCard
          label="Séries avaliadas"
          value={stats.tvCount}
          icon={<TvIcon className="h-4 w-4" />}
        />
        <StatsCard
          label="Favoritos"
          value={favorites.length}
          icon={<HeartIcon className="h-4 w-4" />}
        />
        <StatsCard
          label="Avaliação média"
          value={stats.averageScore.toFixed(1)}
          icon={<StarIcon className="h-4 w-4" />}
        />
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-text sm:text-xl">
            Minhas avaliações
          </h2>

          {ratings.length > 6 && (
            <Link
              to="/ratings"
              className="shrink-0 text-sm font-medium text-primary transition-colors hover:text-primary/80"
            >
              Ver todas →
            </Link>
          )}
        </div>

        <RatedItemsGrid ratings={recentRatings} />
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-text sm:text-xl">
            Favoritos
          </h2>
          {favorites.length > 6 && (
            <Link
              to="/favorites"
              className="shrink-0 text-sm font-medium text-primary transition-colors hover:text-primary/80"
            >
              Ver todas →
            </Link>
          )}
        </div>

        <FavoritesGrid favorites={recentFavorites} />
      </section>
    </div>
  );
}

interface StatsCardProps {
  label: string;
  value: number | string;
  icon: ReactNode;
}

function StatsCard({ label, value, icon }: StatsCardProps) {
  return (
    <div className="animate-fade-in flex flex-col gap-2 rounded-xl border border-border bg-surface p-4 transition-all duration-200 hover:border-accent/40 hover:bg-surface-hover sm:p-5">
      <div className="flex items-center gap-2 text-text-muted">
        {icon}
        <span className="text-xs font-medium uppercase tracking-wide">
          {label}
        </span>
      </div>
      <span className="text-2xl font-bold text-text sm:text-3xl">{value}</span>
    </div>
  );
}

interface RatedItemsGridProps {
  ratings: Rating[];
}

function RatedItemsGrid({ ratings }: RatedItemsGridProps) {
  if (ratings.length === 0) {
    return (
      <EmptyState
        title="Nenhuma avaliação ainda"
        description="Avalie filmes e séries para vê-los aqui."
        icon={<StarIcon className="h-8 w-8" />}
      />
    );
  }

  return (
    <div className="stagger-fade-in grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {ratings.map((rating) => (
        <MediaItemCard
          key={`${rating.mediaType}-${rating.mediaId}`}
          mediaId={rating.mediaId}
          mediaType={rating.mediaType}
          badge={
            <span className="absolute right-2 top-2 flex items-center gap-1 rounded-md bg-background/80 px-1.5 py-0.5 text-xs font-semibold text-warning backdrop-blur">
              <StarIcon className="h-3 w-3" />
              {rating.score}/5
            </span>
          }
        />
      ))}
    </div>
  );
}

interface FavoritesGridProps {
  favorites: Favorite[];
}

function FavoritesGrid({ favorites }: FavoritesGridProps) {
  if (favorites.length === 0) {
    return (
      <EmptyState
        title="Nenhum favorito ainda"
        description="Favorite filmes e séries para vê-los aqui."
        icon={<HeartIcon className="h-8 w-8" />}
      />
    );
  }

  return (
    <div className="stagger-fade-in grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {favorites.map((favorite) => (
        <MediaItemCard
          key={favorite.id}
          mediaId={favorite.mediaId}
          mediaType={favorite.mediaType}
          badge={
            <span className="absolute right-2 top-2 flex items-center gap-1 rounded-md bg-background/80 px-1.5 py-0.5 text-xs font-semibold text-primary backdrop-blur">
              <HeartIcon className="h-3 w-3" filled />
            </span>
          }
        />
      ))}
    </div>
  );
}

interface MediaItemCardProps {
  mediaId: number;
  mediaType: MediaType;
  badge?: ReactNode;
}

function MediaItemCard({ mediaId, mediaType, badge }: MediaItemCardProps) {
  return mediaType === "movie" ? (
    <MovieItemCard mediaId={mediaId} badge={badge} />
  ) : (
    <TVItemCard mediaId={mediaId} badge={badge} />
  );
}

function MovieItemCard({
  mediaId,
  badge,
}: {
  mediaId: number;
  badge?: ReactNode;
}) {
  const { data: movie, isLoading, isError } = useMovieDetails(mediaId);

  if (isLoading) return <MediaItemSkeleton />;
  if (isError || !movie) return <MediaItemFallback />;

  return (
    <Link
      to={`/movie/${movie.id}`}
      className="group animate-fade-in flex flex-col"
    >
      <div className="relative">
        <MediaImage
          src={getImageUrl(movie.poster_path, "w342")}
          alt={movie.title}
          className="aspect-2/3 rounded-lg border border-border"
          imgClassName="transition-transform duration-300 group-hover:scale-105"
        />
        {badge}
      </div>
      <h3 className="mt-2 truncate text-sm font-medium text-text transition-colors group-hover:text-primary">
        {movie.title}
      </h3>
      <p className="mt-0.5 truncate text-xs text-text-muted">
        {formatYear(movie.release_date)}
      </p>
    </Link>
  );
}

function TVItemCard({
  mediaId,
  badge,
}: {
  mediaId: number;
  badge?: ReactNode;
}) {
  const { data: show, isLoading, isError } = useTVShowDetails(mediaId);

  if (isLoading) return <MediaItemSkeleton />;
  if (isError || !show) return <MediaItemFallback />;

  return (
    <Link to={`/tv/${show.id}`} className="group animate-fade-in flex flex-col">
      <div className="relative">
        <MediaImage
          src={getImageUrl(show.poster_path, "w342")}
          alt={show.name}
          className="aspect-2/3 rounded-lg border border-border"
          imgClassName="transition-transform duration-300 group-hover:scale-105"
        />
        {badge}
      </div>
      <h3 className="mt-2 truncate text-sm font-medium text-text transition-colors group-hover:text-primary">
        {show.name}
      </h3>
      <p className="mt-0.5 truncate text-xs text-text-muted">
        {formatYear(show.first_air_date)}
      </p>
    </Link>
  );
}

function MediaItemSkeleton() {
  return (
    <div className="flex flex-col">
      <Skeleton className="aspect-2/3 w-full rounded-lg" />
      <Skeleton className="mt-2 h-4 w-3/4" />
      <Skeleton className="mt-1 h-3 w-1/2" />
    </div>
  );
}

function MediaItemFallback() {
  return (
    <div className="flex aspect-2/3 items-center justify-center rounded-lg border border-border bg-surface">
      <FilmIcon className="h-8 w-8 text-text-muted" />
    </div>
  );
}

function TvIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="2" y="7" width="20" height="15" rx="2" />
      <path d="M17 2l-5 5-5-5" />
    </svg>
  );
}
