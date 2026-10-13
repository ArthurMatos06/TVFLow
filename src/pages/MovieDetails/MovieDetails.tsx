import { lazy, Suspense } from "react";
import { useParams } from "react-router-dom";
import { MovieDetailsHero, SimilarMoviesSection } from "@/components/movie";
import { CastGrid, ErrorState, Skeleton } from "@/components/ui";
import { useGenres, useMovieDetails, useSimilarMovies } from "@/hooks";
import type { Director, TMDBPerson } from "@/types";

const TrailerEmbed = lazy(() =>
  import("@/components/ui/TrailerEmbed").then((module) => ({
    default: module.TrailerEmbed,
  })),
);

function getDirector(crew: TMDBPerson[]): Director | null {
  const member = crew.find((person) => person.job === "Director");
  if (!member) return null;
  return {
    id: member.id,
    name: member.name,
    job: member.job ?? "Director",
    department: member.department ?? "Directing",
    profile_path: member.profile_path,
    credit_id: member.credit_id ?? "",
  };
}

export function MovieDetails() {
  const { id } = useParams<{ id: string }>();
  const movieId = Number(id);

  const details = useMovieDetails(movieId);
  const similar = useSimilarMovies(movieId);
  const { data: genres } = useGenres();

  if (details.isLoading) {
    return <DetailsSkeleton />;
  }

  if (details.isError) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <ErrorState onRetry={() => void details.refetch()} />
      </div>
    );
  }

  if (!details.data) return null;

  const movie = details.data;
  const director = getDirector(movie.credits.crew);
  const trailer = movie.videos.results.find(
    (video) => video.site === "YouTube" && video.type === "Trailer",
  );

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <MovieDetailsHero movie={movie} director={director} />

      {trailer && (
        <Suspense
          fallback={<Skeleton className="aspect-video w-full rounded-2xl" />}
        >
          <TrailerEmbed
            videoKey={trailer.key}
            title={`Trailer de ${movie.title}`}
          />
        </Suspense>
      )}

      {movie.credits.cast.length > 0 && (
        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-text sm:text-xl">Elenco</h2>
          <CastGrid cast={movie.credits.cast} />
        </section>
      )}

      <SimilarMoviesSection
        movies={similar.data}
        genres={genres}
        isLoading={similar.isLoading}
        isError={similar.isError}
        onRetry={() => void similar.refetch()}
      />
    </div>
  );
}

function DetailsSkeleton() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <Skeleton className="h-105 w-full rounded-2xl lg:h-130" />
      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="w-32 shrink-0 sm:w-36">
            <Skeleton className="aspect-2/3 w-full rounded-lg" />
            <Skeleton className="mt-2 h-4 w-3/4" />
            <Skeleton className="mt-1 h-3 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}
