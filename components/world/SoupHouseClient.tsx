"use client";

import Link from "next/link";
import { useMemo } from "react";
import { dailyQuestions, finaActivities } from "@/data/soup-house";
import type { Theme } from "@/data/themes";

export function getDailySeed(): number {
  const now = new Date();
  return now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
}

export function pick<T>(arr: T[], seed: number, offset = 0): T {
  return arr[(seed + offset) % arr.length];
}

const JOURNEY_STEPS = ["故事", "採集材料", "煮湯", "帶回家做"] as const;

interface SoupHouseClientProps {
  theme: Theme;
}

export function SoupHouseClient({ theme }: SoupHouseClientProps) {
  const seed = useMemo(() => getDailySeed(), []);

  const finaLine = useMemo(() => pick(finaActivities, seed, 2), [seed]);
  const question = useMemo(() => pick(dailyQuestions, seed, 4), [seed]);

  const themeHref = `/themes/${theme.slug}`;

  return (
    <div className="-mt-[var(--site-header-offset)] min-h-screen bg-[#faf6ed] pt-[var(--site-header-offset)] text-wood">
      {/* ① Hero */}
      <header className="px-page-px pb-sp-10 pt-sp-10 text-center sm:px-page-px-sm sm:pb-sp-14 sm:pt-hero-pt-sm">
        <p className="font-heading text-2xl font-medium leading-snug text-wood sm:text-3xl md:text-4xl">
          湯正在慢慢變香
        </p>
        <p className="mt-sp-4 font-heading text-xl font-normal leading-snug text-wood-soft sm:text-2xl md:text-3xl">
          今天要煮什麼呢？
        </p>
      </header>

      <div className="mx-auto max-w-xl space-y-sp-12 px-page-px pb-sp-16 sm:px-page-px-sm sm:pb-sp-20">
        {/* ② 當前主題包 */}
        <section aria-label="今天的故事">
          <div className="relative overflow-hidden rounded-3xl border-2 border-moss/30 bg-gradient-to-b from-moss-pale/95 via-moss-pale/75 to-paper/90 px-sp-6 py-sp-10 shadow-[0_12px_40px_-12px_rgba(45,90,65,0.28)] sm:px-sp-8 sm:py-sp-12">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-white/40 to-transparent" aria-hidden />
            <p className="text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-moss/90 sm:text-xs">
              今天的故事
            </p>
            <h2 className="mt-sp-3 text-center font-heading text-2xl font-semibold leading-tight text-wood sm:text-3xl md:text-4xl">
              {theme.title}
            </h2>
            <p className="mx-auto mt-sp-4 max-w-md text-center text-base leading-relaxed text-wood-muted sm:text-lg">
              {theme.tagline}
            </p>

            <p className="mx-auto mt-sp-2 max-w-lg text-center text-sm text-wood/90">
              今天有一個故事在等你，從這裡開始。
            </p>

            <div
              className="mx-auto mt-sp-8 flex max-w-md flex-wrap items-center justify-center gap-x-1 gap-y-2 text-sm text-wood-muted"
              aria-label="旅程步驟"
            >
              {JOURNEY_STEPS.map((label, i) => (
                <span key={label} className="inline-flex items-center gap-x-1">
                  {i > 0 ? (
                    <span className="mx-1 text-moss/45" aria-hidden>
                      →
                    </span>
                  ) : null}
                  <span
                    className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-moss/50"
                    aria-hidden
                  />
                  <span>{label}</span>
                </span>
              ))}
            </div>

            <div className="mt-sp-10 flex justify-center">
              <Link
                href={themeHref}
                className="inline-flex min-h-[3.25rem] w-full max-w-md items-center justify-center rounded-2xl border-2 border-moss/40 bg-moss px-6 py-sp-4 text-center font-heading text-base font-semibold text-paper shadow-[0_8px_28px_-6px_rgba(45,90,65,0.45)] transition-[transform,box-shadow,background-color,border-color] hover:border-moss-hover hover:bg-moss-hover hover:shadow-[0_12px_32px_-8px_rgba(45,90,65,0.5)] focus:outline-none focus-visible:ring-2 focus-visible:ring-moss/50 focus-visible:ring-offset-2 focus-visible:ring-offset-moss-pale motion-reduce:transition-none sm:text-lg"
              >
                開始今天的旅程 →
              </Link>
            </div>
          </div>
        </section>

        {/* ③ Fina 今日小插曲 */}
        <section className="space-y-sp-4 text-center" aria-label="今日小插曲">
          <p className="text-sm leading-relaxed text-wood">{finaLine}</p>
          <div>
            <p className="text-sm font-medium text-wood">菲娜想問你的小問題</p>
            <p className="mt-sp-2 text-sm leading-relaxed text-wood-muted">{question}</p>
            <p className="mt-sp-2 text-xs text-wood-muted/90">跟身邊的人說說你的答案。</p>
          </div>
        </section>

        {/* ④ 輕引導 */}
        <section className="space-y-sp-3 text-sm leading-relaxed text-wood-soft">
          <p>
            還想到處走走？{" "}
            <Link href="/world" className="font-medium text-moss underline-offset-4 hover:text-moss-hover">
              去森林看看 →
            </Link>
          </p>
          <p>
            <Link href="/soup-cards" className="font-medium text-moss underline-offset-4 hover:text-moss-hover">
              想看看還有哪些湯 →
            </Link>
          </p>
        </section>

        <nav className="border-t border-border-paper/80 pt-sp-8 text-center" aria-label="離開湯湯屋">
          <Link href="/world" className="text-sm font-medium text-moss transition-colors hover:text-moss-hover">
            ← 回到森林
          </Link>
        </nav>
      </div>
    </div>
  );
}
