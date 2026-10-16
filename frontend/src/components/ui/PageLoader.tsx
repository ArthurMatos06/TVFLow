import { Loading } from './Loading'
import { Skeleton } from './Skeleton'

/**
 * Fallback de Suspense para páginas carregadas via React.lazy.
 * Exibe um spinner acompanhado de skeletons de cards, compatível
 * com o layout (MainLayout e AuthLayout).
 */
export function PageLoader() {
  return (
    <div
      className="flex flex-col items-center gap-8"
      role="status"
      aria-live="polite"
      aria-label="Carregando página"
    >
      <Loading size="lg" label="Carregando página..." className="py-0" />
      <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {Array.from({ length: 10 }).map((_, index) => (
          <div key={index} className="flex flex-col">
            <Skeleton className="aspect-2/3 w-full rounded-lg" />
            <Skeleton className="mt-2 h-4 w-3/4" />
            <Skeleton className="mt-1 h-3 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  )
}
