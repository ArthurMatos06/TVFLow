import { Button, EmptyState, FilmIcon } from '@/components/ui'

interface SearchEmptyProps {
  query: string
  hasFilters: boolean
  onResetFilters: () => void
}

export function SearchEmpty({ query, hasFilters, onResetFilters }: SearchEmptyProps) {
  if (!query && !hasFilters) {
    return (
      <EmptyState
        icon={<FilmIcon className="h-10 w-10" />}
        title="Encontre filmes e séries"
        description="Digite um termo na barra de pesquisa ou use os filtros para explorar o catálogo."
      />
    )
  }

  if (!query && hasFilters) {
    return (
      <EmptyState
        icon={<FilmIcon className="h-10 w-10" />}
        title="Nenhum resultado com os filtros atuais"
        description="Tente remover alguns filtros para ampliar a busca."
        action={
          <Button variant="outline" size="sm" onClick={onResetFilters}>
            Limpar filtros
          </Button>
        }
      />
    )
  }

  return (
    <EmptyState
      icon={<FilmIcon className="h-10 w-10" />}
      title={`Nenhum resultado para "${query}"`}
      description="Verifique a ortografia ou tente um termo diferente."
    />
  )
}
