import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface ContentSectionProps {
  title: string
  viewAllLink?: string
  children: ReactNode
}

export function ContentSection({ title, viewAllLink, children }: ContentSectionProps) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-text sm:text-xl">{title}</h2>
        {viewAllLink && (
          <Link
            to={viewAllLink}
            className="shrink-0 text-sm font-medium text-text-muted transition-colors hover:text-text"
          >
            Ver todos
          </Link>
        )}
      </div>
      {children}
    </section>
  )
}
