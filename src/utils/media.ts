import type { TMDBGenre } from '@/types'

export function getGenreNames(genreIds: number[], genres?: TMDBGenre[]): string[] {
  if (!genres) return []
  return genres.filter((genre) => genreIds.includes(genre.id)).map((genre) => genre.name)
}

export function formatYear(date: string): string {
  return date ? date.slice(0, 4) : ''
}

export function formatRating(voteAverage: number): string {
  return voteAverage.toFixed(1)
}

export function formatRuntime(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours === 0) return `${mins} min`
  return `${hours}h ${mins}min`
}

export function formatDate(date: string): string {
  if (!date) return ''
  return new Date(`${date}T00:00:00`).toLocaleDateString('pt-BR')
}
