interface GenreBadgeProps {
  name: string
}

export function GenreBadge({ name }: GenreBadgeProps) {
  return (
    <span className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-text-muted">
      {name}
    </span>
  )
}
