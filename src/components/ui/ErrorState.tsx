import { Button } from './Button'

interface ErrorStateProps {
  title?: string
  description?: string
  onRetry?: () => void
}

export function ErrorState({
  title = 'Algo deu errado',
  description = 'Não foi possível carregar o conteúdo. Tente novamente.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="animate-slide-in-up flex flex-col items-center justify-center gap-3 rounded-lg border border-border bg-surface px-6 py-16 text-center">
      <h3 className="text-lg font-medium text-text">{title}</h3>
      <p className="max-w-sm text-sm text-text-muted">{description}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className="mt-2">
          Tentar novamente
        </Button>
      )}
    </div>
  )
}
