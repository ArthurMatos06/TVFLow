import { clsx } from 'clsx'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={clsx('shimmer-skeleton rounded-md', className)}
      aria-hidden="true"
    />
  )
}
