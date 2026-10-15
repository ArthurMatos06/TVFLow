import { clsx } from "clsx";
import { useCallback, useRef } from "react";
import type { KeyboardEvent, ReactNode } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/ui";

interface CarouselProps {
  children: ReactNode;
  className?: string;
  label?: string;
}

export function Carousel({
  children,
  className,
  label = "Carrossel de conteúdo",
}: CarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollByDirection = useCallback((direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({
      left: direction * track.clientWidth * 0.8,
      behavior: "smooth",
    });
  }, []);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    if (!track) return;

    switch (event.key) {
      case "ArrowLeft":
        event.preventDefault();
        scrollByDirection(-1);
        break;
      case "ArrowRight":
        event.preventDefault();
        scrollByDirection(1);
        break;
      case "Home":
        event.preventDefault();
        track.scrollTo({ left: 0, behavior: "smooth" });
        break;
      case "End":
        event.preventDefault();
        track.scrollTo({ left: track.scrollWidth, behavior: "smooth" });
        break;
      case "Enter":
      case " ":
        if (event.target === event.currentTarget) {
          event.preventDefault();
          const firstItem = track.querySelector<HTMLElement>("a[href], button");
          firstItem?.focus();
          firstItem?.click();
        }
        break;
    }
  };

  const arrowClasses =
    "absolute top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/80 text-text opacity-0 backdrop-blur transition-opacity hover:bg-surface group-hover/carousel:opacity-100 md:flex";

  return (
    <div className="group/carousel carousel-fade relative">
      <button
        type="button"
        onClick={() => scrollByDirection(-1)}
        aria-label="Rolar para a esquerda"
        className={clsx(arrowClasses, "-left-3")}
      >
        <ChevronLeftIcon className="h-5 w-5" />
      </button>
      <div
        ref={trackRef}
        role="region"
        aria-label={label}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className={clsx(
          "carousel-track scrollbar-hide flex gap-4 overflow-x-auto scroll-smooth py-1",
          className,
        )}
      >
        {children}
      </div>
      <button
        type="button"
        onClick={() => scrollByDirection(1)}
        aria-label="Rolar para a direita"
        className={clsx(arrowClasses, "-right-3")}
      >
        <ChevronRightIcon className="h-5 w-5" />
      </button>
    </div>
  );
}
