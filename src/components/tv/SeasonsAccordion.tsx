import { clsx } from 'clsx'
import { useState } from 'react'
import { ChevronDownIcon, MediaImage } from '@/components/ui'
import { getImageUrl } from '@/services/tmdb'
import type { TVSeason } from '@/types'
import { formatDate, formatYear } from '@/utils/media'

interface SeasonsAccordionProps {
  seasons: TVSeason[]
}

export function SeasonsAccordion({ seasons }: SeasonsAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  if (seasons.length === 0) return null

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-text sm:text-xl">Temporadas</h2>
      <div className="flex flex-col gap-2">
        {seasons.map((season, index) => {
          const isOpen = openIndex === index
          return (
            <div key={season.id} className="overflow-hidden rounded-xl border border-border bg-surface">
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left transition-colors hover:bg-surface-hover"
              >
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="text-sm font-semibold text-text">{season.name}</span>
                  <span className="text-xs text-text-muted">
                    {season.episode_count} episódio{season.episode_count !== 1 ? 's' : ''}
                    {season.air_date ? ` · ${formatYear(season.air_date)}` : ''}
                  </span>
                </div>
                <ChevronDownIcon
                  className={clsx(
                    'h-5 w-5 shrink-0 text-text-muted transition-transform',
                    isOpen && 'rotate-180',
                  )}
                />
              </button>
              {isOpen && (
                <div className="flex flex-col gap-4 border-t border-border px-4 py-4 sm:flex-row">
                  <MediaImage
                    src={getImageUrl(season.poster_path, 'w185')}
                    alt={season.name}
                    className="h-40 w-28 shrink-0 rounded-lg border border-border"
                  />
                  <div className="flex flex-col gap-2">
                    <p className="text-sm leading-relaxed text-text-muted">
                      {season.overview || 'Sinopse não disponível para esta temporada.'}
                    </p>
                    {season.air_date && (
                      <p className="text-xs text-text-muted">Estreia: {formatDate(season.air_date)}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
