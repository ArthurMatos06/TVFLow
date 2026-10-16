import { Carousel } from '@/components/home'
import { getImageUrl } from '@/services/tmdb'
import type { TMDBPerson } from '@/types'
import { MediaImage } from './MediaImage'

interface CastGridProps {
  cast: TMDBPerson[]
}

/**
 * Carrossel com o elenco (foto, nome e personagem).
 * Retorna null quando não há elenco disponível.
 */
export function CastGrid({ cast }: CastGridProps) {
  if (cast.length === 0) return null

  return (
    <Carousel label="Elenco">
      {cast.map((person) => (
        <div key={person.id} className="w-32 shrink-0 sm:w-36">
          <MediaImage
            src={getImageUrl(person.profile_path, 'w185')}
            alt={person.name}
            className="aspect-2/3 rounded-lg border border-border"
          />
          <h3 className="mt-2 truncate text-sm font-medium text-text">{person.name}</h3>
          <p className="truncate text-xs text-text-muted">{person.character}</p>
        </div>
      ))}
    </Carousel>
  )
}
