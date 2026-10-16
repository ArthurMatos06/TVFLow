import { clsx } from 'clsx'
import { useState } from 'react'
import { StarIcon } from './icons'

interface StarRatingProps {
  value: number
  onChange?: (value: number) => void
  size?: 'sm' | 'md' | 'lg'
  label?: string
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
}

/**
 * Avaliação de 1 a 5 estrelas. Interativa quando `onChange` é fornecido;
 * caso contrário, renderiza apenas a exibição da nota.
 */
export function StarRating({ value, onChange, size = 'md', label }: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState(0)
  const displayValue = hoverValue || value

  return (
    <div className="flex flex-col gap-1">
      {label && <span className="text-sm font-medium text-text-muted">{label}</span>}
      <div
        className="flex items-center gap-1"
        role={onChange ? 'radiogroup' : undefined}
        aria-label={label}
      >
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = star <= displayValue
          const starElement = (
            <StarIcon
              className={clsx(
                sizeClasses[size],
                'transition-colors',
                filled ? 'text-warning' : 'text-border',
              )}
            />
          )

          if (!onChange) {
            return <span key={star}>{starElement}</span>
          }

          return (
            <button
              key={star}
              type="button"
              onClick={() => onChange(star)}
              onMouseEnter={() => setHoverValue(star)}
              onMouseLeave={() => setHoverValue(0)}
              aria-label={`${star} estrela${star > 1 ? 's' : ''}`}
              aria-checked={star === value}
              className="cursor-pointer transition-transform hover:scale-110"
            >
              {starElement}
            </button>
          )
        })}
        {onChange && (
          <span className="ml-2 text-sm font-medium text-text-muted">
            {displayValue || '—'}/5
          </span>
        )}
      </div>
    </div>
  )
}
