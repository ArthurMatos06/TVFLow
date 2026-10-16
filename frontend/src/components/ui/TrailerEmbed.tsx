interface TrailerEmbedProps {
  videoKey: string | null
  title?: string
}

/**
 * Player de trailer do YouTube em iframe responsivo.
 * Retorna null quando não há chave de vídeo disponível.
 */
export function TrailerEmbed({ videoKey, title = 'Trailer' }: TrailerEmbedProps) {
  if (!videoKey) return null

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="aspect-video w-full">
        <iframe
          src={`https://www.youtube.com/embed/${videoKey}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="h-full w-full"
        />
      </div>
    </div>
  )
}
