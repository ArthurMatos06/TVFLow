import { clsx } from 'clsx'
import { useState } from 'react'
import { FilmIcon } from './icons'

interface MediaImageProps {
  src: string | null
  alt: string
  className?: string
  imgClassName?: string
}

/**
 * Imagem de mídia (poster/backdrop) com fallback visual
 * quando a URL é nula ou a imagem falha ao carregar.
 */
export function MediaImage({ src, alt, className, imgClassName }: MediaImageProps) {
  const [hasError, setHasError] = useState(false)
  const showImage = src !== null && !hasError

  return (
    <div className={clsx('relative overflow-hidden bg-surface', className)}>
      {showImage ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setHasError(true)}
          className={clsx('h-full w-full object-cover', imgClassName)}
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-3 text-center">
          <FilmIcon className="h-8 w-8 text-text-muted" />
          <span className="line-clamp-2 text-xs font-medium text-text-muted">{alt}</span>
        </div>
      )}
    </div>
  )
}
