"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { soups } from "@/data/soups";
import {
  dailyQuestions,
  finaActivities,
  poffyQuotes,
} from "@/data/soup-house";
import type { Soup } from "@/data/soups";

function getDailySeed(): number {
  const now = new Date();
  return now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
}

function pick<T>(arr: T[], seed: number, offset = 0): T {
  return arr[(seed + offset) % arr.length];
}

function getTodaysSoup(seed: number): Soup {
  return pick(soups, seed, 0);
}

export function SoupHouseClient() {
  const seed = useMemo(() => getDailySeed(), []);

  const todaysSoup = useMemo(() => getTodaysSoup(seed), [seed]);
  const poffyLine = useMemo(() => pick(poffyQuotes, seed, 1), [seed]);
  const finaLine = useMemo(() => pick(finaActivities, seed, 2), [seed]);
  const question = useMemo(() => pick(dailyQuestions, seed, 4), [seed]);

  const ingredientList = useMemo(() => {
    const raw = todaysSoup.ingredients ?? [];
    if (raw.length === 0) {
      return ["一點點好奇", "一點點時間", "一點點勇氣"];
    }
    return raw.slice(0, 3);
  }, [todaysSoup]);

  const [selectedTags, setSelectedTags] = useState<Set<number>>(() => new Set());
  const [poppingIndex, setPoppingIndex] = useState<number | null>(null);

  const toggleIngredient = (index: number) => {
    setPoppingIndex(index);
    setSelectedTags((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
    window.setTimeout(() => {
      setPoppingIndex((p) => (p === index ? null : p));
    }, 460);
  };

  return (
    <div className="-mt-[var(--site-header-offset)] min-h-screen bg-[#faf6ed] pt-[var(--site-header-offset)] text-wood">
      {/* ① Hero */}
      <header className="px-page-px pb-sp-12 pt-sp-10 text-center sm:px-page-px-sm sm:pb-sp-16 sm:pt-hero-pt-sm">
        <p className="font-heading text-2xl font-medium leading-snug text-wood sm:text-3xl md:text-4xl">
          湯正在慢慢變香
        </p>
        <p className="mt-sp-4 font-heading text-xl font-normal leading-snug text-wood-soft sm:text-2xl md:text-3xl">
          今天要煮什麼呢？
        </p>
      </header>

      <div className="mx-auto max-w-xl space-y-sp-12 px-page-px pb-sp-16 sm:px-page-px-sm sm:pb-sp-20">
        {/* ② 今日的湯 */}
        <section className="rounded-3xl border border-border-paper/80 bg-paper-card/70 px-sp-5 py-sp-8 shadow-[var(--shadow-paper)] sm:px-sp-8 sm:py-sp-10">
          <p className="text-center text-xs font-medium uppercase tracking-[0.2em] text-wood-muted">
            今日的湯
          </p>
          <h2 className="mt-sp-4 text-center font-heading text-2xl font-semibold text-wood sm:text-3xl">
            {todaysSoup.name}
          </h2>
          <p className="mt-sp-2 text-center text-sm text-wood-muted">{todaysSoup.mood}</p>

          <div className="mt-sp-8 flex flex-wrap justify-center gap-sp-2">
            {ingredientList.map((ingredient, index) => {
              const isSelected = selectedTags.has(index);
              const isPopping = poppingIndex === index;
              return (
                <button
                  key={`${ingredient}-${index}`}
                  type="button"
                  onClick={() => toggleIngredient(index)}
                  className={[
                    "rounded-full border px-sp-4 py-2 text-sm transition-[background,border-color,box-shadow,color]",
                    isSelected
                      ? "border-moss/45 bg-moss-pale/90 text-wood shadow-[0_0_14px_hsl(120_35%_45%/0.22)]"
                      : "border-border-paper bg-paper text-wood hover:border-moss-soft/40",
                    isPopping ? "soup-house-tag-pop" : "",
                  ].join(" ")}
                >
                  {ingredient}
                </button>
              );
            })}
          </div>

          <p className="mt-sp-8 text-center text-sm leading-relaxed text-wood-soft">
            今天的湯需要這些材料。你還會加什麼？
          </p>
        </section>

        {/* ③ 角色插話 */}
        <section className="space-y-sp-5" aria-label="Friends">
          <div className="rounded-2xl border border-border-paper/70 bg-paper-card/50 px-sp-4 py-sp-5 sm:px-sp-5 sm:py-sp-6">
            <p className="text-xs font-medium text-wood-muted">
              <span className="mr-1.5" aria-hidden>
                🫧
              </span>
              Poffy 波飛
            </p>
            <p className="mt-sp-2 text-sm leading-relaxed text-wood">{poffyLine}</p>
          </div>
          <div className="rounded-2xl border border-border-paper/70 bg-paper-card/50 px-sp-4 py-sp-5 sm:px-sp-5 sm:py-sp-6">
            <p className="text-xs font-medium text-wood-muted">
              <span className="mr-1.5" aria-hidden>
                🦊
              </span>
              Fina 菲娜
            </p>
            <p className="mt-sp-2 text-sm leading-relaxed text-wood">{finaLine}</p>
          </div>
        </section>

        {/* ④ 今日小問題 */}
        <section className="text-center">
          <h3 className="font-heading text-lg font-medium text-wood sm:text-xl">菲娜想問你</h3>
          <p className="mt-sp-4 text-base leading-relaxed text-wood">{question}</p>
          <p className="mt-sp-3 text-xs text-wood-muted">跟身邊的人說說你的答案。</p>
        </section>

        {/* ⑤ 輕引導 */}
        <section className="space-y-sp-4 text-center text-sm leading-relaxed text-wood-soft">
          <p>
            如果你還想找更多材料，可以去 →{" "}
            <Link href="/world" className="text-moss underline-offset-4 hover:text-moss-hover">
              森林走走
            </Link>
          </p>
          <p>
            想看看還有哪些湯 →{" "}
            <Link href="/soup-cards" className="text-moss underline-offset-4 hover:text-moss-hover">
              湯譜卡
            </Link>
          </p>
          <p>
            想聽一個故事 →{" "}
            <Link href="/stories" className="text-moss underline-offset-4 hover:text-moss-hover">
              故事時間
            </Link>
          </p>
        </section>

        {/* ⑥ 收尾 */}
        <p className="text-center text-xs text-wood-muted/90">湯還在慢慢變暖⋯</p>

        <nav className="border-t border-border-paper/80 pt-sp-8 text-center" aria-label="離開湯湯屋">
          <Link
            href="/world"
            className="text-sm text-moss transition-colors hover:text-moss-hover"
          >
            ← 回到森林
          </Link>
        </nav>
      </div>
    </div>
  );
}
