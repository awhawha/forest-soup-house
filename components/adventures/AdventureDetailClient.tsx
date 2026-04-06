"use client";

import { useState } from "react";
import type { Adventure } from "@/data/adventures";
import { Button } from "@/components/Button";

interface AdventureDetailClientProps {
  adventure: Adventure;
}

export function AdventureDetailClient({ adventure }: AdventureDetailClientProps) {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="mx-auto max-w-2xl px-page-px pb-sp-16 pt-hero-pt sm:px-page-px-sm sm:pb-sp-20 sm:pt-hero-pt-sm">
      {/* 區塊一：任務說明 */}
      <section className="space-y-sp-6" aria-labelledby="adventure-title">
        <p className="text-center text-sm text-wood-muted sm:text-left">
          <span className="text-wood">{adventure.location}</span>
          <span className="mx-1 text-wood-muted/80">·</span>
          <span className="italic text-wood-soft">{adventure.locationEn}</span>
          <span className="mx-2 text-border-paper">|</span>
          <span className="text-wood">{adventure.character}</span>
          <span className="mx-1 text-wood-muted/80">·</span>
          <span className="italic text-wood-soft">{adventure.characterEn}</span>
        </p>

        <blockquote className="text-center text-sm italic leading-relaxed text-wood-soft sm:text-left">
          {adventure.finaQuote}
        </blockquote>

        <header className="space-y-sp-3 text-center sm:text-left">
          <h1
            id="adventure-title"
            className="font-heading text-2xl font-bold leading-tight text-wood sm:text-3xl md:text-4xl"
          >
            {adventure.title}
          </h1>
          <p className="text-base text-wood-muted">{adventure.titleEn}</p>
        </header>

        <div className="space-y-sp-3">
          <p className="text-base leading-relaxed text-wood">{adventure.description}</p>
          <p className="text-sm leading-relaxed text-wood-muted">{adventure.descriptionEn}</p>
        </div>

        <div
          className="rounded-2xl border border-border-paper bg-paper-section/90 px-sp-4 py-sp-5 sm:px-sp-6 sm:py-sp-6"
          role="region"
          aria-labelledby="parent-note-heading"
        >
          <h2
            id="parent-note-heading"
            className="text-sm font-semibold uppercase tracking-wide text-wood-soft"
          >
            給大人 · For grown-ups
          </h2>
          <p className="mt-sp-3 text-sm leading-relaxed text-wood sm:text-base">
            {adventure.parentNote}
          </p>
        </div>
      </section>

      {/* 區塊二：出發 */}
      <div className="relative my-sp-12 sm:my-sp-16" role="separator">
        <div className="divider max-w-none" />
        <p className="mx-auto mt-sp-8 max-w-md text-center text-base leading-relaxed text-wood-muted">
          準備好了嗎？去試試看，回來告訴我們。
        </p>
      </div>

      {/* 區塊三：回來留下什麼 */}
      <section className="space-y-sp-6" aria-labelledby="reflection-heading">
        <h2
          id="reflection-heading"
          className="text-center font-heading text-xl font-semibold text-wood sm:text-2xl"
        >
          你找到了什麼？
        </h2>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-sp-4">
            <label htmlFor="adventure-reflection" className="sr-only">
              今天的發現
            </label>
            <textarea
              id="adventure-reflection"
              name="reflection"
              rows={4}
              placeholder="今天的發現是⋯⋯"
              className="w-full resize-y rounded-xl border border-border-paper bg-paper-card px-sp-4 py-sp-3 text-base text-wood shadow-[var(--shadow-paper)] placeholder:text-wood-muted/70 focus:border-moss-soft focus:outline-none focus:ring-2 focus:ring-moss-soft/35"
            />
            <div className="flex justify-center sm:justify-start">
              <Button type="submit" variant="primary">
                告訴{adventure.character} →
              </Button>
            </div>
          </form>
        ) : (
          <div
            className="animate-fade-in-up space-y-sp-6 rounded-2xl border border-moss-soft/25 bg-moss-pale/35 px-sp-5 py-sp-6 text-center sm:px-sp-8 sm:text-left"
            role="status"
          >
            <div className="flex flex-col items-center gap-sp-4 sm:flex-row sm:items-start">
              <span
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-moss/15 text-moss"
                aria-hidden
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-8 w-8"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </span>
              <p className="text-lg leading-relaxed text-wood">{adventure.finaResponse}</p>
            </div>
          </div>
        )}
      </section>

      <nav className="mt-sp-12 border-t border-border-paper pt-sp-8" aria-label="Adventure navigation">
        <Button variant="ghost-moss" href="/adventures" className="inline-flex items-center gap-1">
          ← 回到所有冒險
        </Button>
      </nav>
    </div>
  );
}
