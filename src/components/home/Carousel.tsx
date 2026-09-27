import { clsx } from 'clsx'
import { useRef, type ReactNode } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@/components/ui'

interface CarouselProps {
  children: ReactNode
  className?: string
}

export function Carousel({ children, className }: CarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null)

  const scrollByDirection = (direction: -1 | 1) => {
    const track = trackRef.current
    if (!track) return
    track.scrollBy({ left: direction * track.clientWidth * 0.8, behavior: 'smooth' })
  }

  const arrowClasses =
    'absolute top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/80 text-text opacity-0 backdrop-blur transition-opacity hover:bg-surface group-hover/carousel:opacity-100 md:flex'

  return (
    <div className="group/carousel relative">
      <button
        type="button"
        onClick={() => scrollByDirection(-1)}
        aria-label="Rolar para a esquerda"
        className={clsx(arrowClasses, '-left-3')}
      >
        <ChevronLeftIcon className="h-5 w-5" />
      </button>
      <div
        ref={trackRef}
        className={clsx('scrollbar-hide flex gap-4 overflow-x-auto scroll-smooth py-1', className)}
      >
        {children}
      </div>
      <button
        type="button"
        onClick={() => scrollByDirection(1)}
        aria-label="Rolar para a direita"
        className={clsx(arrowClasses, '-right-3')}
      >
        <ChevronRightIcon className="h-5 w-5" />
      </button>
    </div>
  )
}
