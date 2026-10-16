import { clsx } from 'clsx'

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  label?: string
}

const sizeClasses = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-2',
  lg: 'h-12 w-12 border-[3px]',
}

export function Loading({ size = 'md', className, label = 'Carregando...' }: LoadingProps) {
  return (
    <div
      className={clsx('flex flex-col items-center justify-center gap-3 py-10', className)}
      role="status"
      aria-live="polite"
    >
      <span
        className={clsx(
          'animate-spin-slow rounded-full border-accent border-t-transparent',
          sizeClasses[size],
        )}
        aria-hidden="true"
      />
      <span className="flex items-center gap-1.5 text-sm text-text-muted">
        {label}
        <span className="flex gap-0.5" aria-hidden="true">
          <span className="h-1 w-1 animate-pulse-dot rounded-full bg-text-muted" />
          <span
            className="h-1 w-1 animate-pulse-dot rounded-full bg-text-muted"
            style={{ animationDelay: '0.15s' }}
          />
          <span
            className="h-1 w-1 animate-pulse-dot rounded-full bg-text-muted"
            style={{ animationDelay: '0.3s' }}
          />
        </span>
      </span>
    </div>
  )
}
