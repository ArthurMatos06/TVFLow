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
    <div className={clsx('flex flex-col items-center justify-center gap-3 py-10', className)}>
      <span
        className={clsx(
          'animate-spin rounded-full border-accent border-t-transparent',
          sizeClasses[size],
        )}
        role="status"
        aria-label={label}
      />
      <span className="text-sm text-text-muted">{label}</span>
    </div>
  )
}
