import { Input, SearchIcon, XIcon } from '@/components/ui'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  autoFocus?: boolean
}

/**
 * Barra de busca controlada. O debounce do termo digitado é feito
 * pelo hook useSearchFilters, que sincroniza o valor com a URL.
 */
export function SearchBar({
  value,
  onChange,
  placeholder = 'Buscar filmes e séries...',
  autoFocus,
}: SearchBarProps) {
  return (
    <div className="relative">
      <SearchIcon className="pointer-events-none absolute left-3 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-text-muted" />
      <Input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        aria-label="Buscar filmes e séries"
        className="py-3 pl-10 pr-10 text-base"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Limpar busca"
          className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-md p-1 text-text-muted transition-colors hover:text-text"
        >
          <XIcon className="h-5 w-5" />
        </button>
      )}
    </div>
  )
}
