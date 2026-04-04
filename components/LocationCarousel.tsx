"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { LocationCard } from "@/components/cards/LocationCard";
import type { Location } from "@/data/locations";

/** Matches `gap-4` on the track — used for scroll step math. */
const GAP_PX = 16;

interface LocationCarouselProps {
  locations: Location[];
}

/**
 * Horizontal carousel: 3 cards on `lg+`, 2 on `md`, 1 on small screens.
 * Arrows sit beside the track; each click scrolls by one card width + gap.
 */
export function LocationCarousel({ locations }: LocationCarouselProps) {
  const listRef = useRef<HTMLUListElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const updateArrows = useCallback(() => {
    const el = listRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    const max = scrollWidth - clientWidth;
    setCanPrev(scrollLeft > 2);
    setCanNext(scrollLeft < max - 2);
  }, []);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    updateArrows();
    el.addEventListener("scroll", updateArrows, { passive: true });
    const ro = new ResizeObserver(updateArrows);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      ro.disconnect();
    };
  }, [updateArrows, locations.length]);

  const scrollByDir = (dir: -1 | 1) => {
    const root = listRef.current;
    if (!root) return;
    const first = root.querySelector("li");
    if (!first) return;
    const w = first.getBoundingClientRect().width + GAP_PX;
    root.scrollBy({ left: dir * w, behavior: "smooth" });
  };

  return (
    <div className="mx-auto flex max-w-6xl items-center justify-center gap-2 px-4 sm:gap-3 sm:px-6">
      <button
        type="button"
        onClick={() => scrollByDir(-1)}
        disabled={!canPrev}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--world-nav-btn-border)] bg-[var(--world-nav-btn-bg)] text-lg text-world-muted shadow-sm transition-opacity hover:bg-paper-card disabled:pointer-events-none disabled:opacity-30 sm:h-11 sm:w-11"
        aria-label="上一張地點卡片"
      >
        <span aria-hidden className="-mt-0.5 font-medium">
          ‹
        </span>
      </button>

      <ul
        ref={listRef}
        className="scrollbar-hide flex min-h-0 min-w-0 flex-1 items-stretch snap-x snap-mandatory gap-4 overflow-x-auto overflow-y-hidden scroll-smooth overscroll-x-contain"
        aria-label="森林地點卡片"
      >
        {locations.map((location) => (
          <li
            key={location.slug}
            className="flex min-h-0 w-full min-w-0 shrink-0 snap-start flex-[0_0_100%] flex-col md:flex-[0_0_calc((100%-1rem)/2)] lg:flex-[0_0_calc((100%-2rem)/3)]"
          >
            <LocationCard location={location} />
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() => scrollByDir(1)}
        disabled={!canNext}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--world-nav-btn-border)] bg-[var(--world-nav-btn-bg)] text-lg text-world-muted shadow-sm transition-opacity hover:bg-paper-card disabled:pointer-events-none disabled:opacity-30 sm:h-11 sm:w-11"
        aria-label="下一張地點卡片"
      >
        <span aria-hidden className="-mt-0.5 font-medium">
          ›
        </span>
      </button>
    </div>
  );
}
