"use client";

import { useMemo, useState } from "react";
import { PageHero } from "@/components/PageHero";
import { SoupCard } from "@/components/cards/SoupCard";
import type { Soup } from "@/data/soups";

const CATEGORY_OPTIONS: { value: "all" | Soup["category"]; labelZh: string; labelEn: string }[] =
  [
    { value: "all", labelZh: "全部", labelEn: "All" },
    { value: "warmth", labelZh: "溫暖日常", labelEn: "warmth" },
    { value: "sensory", labelZh: "氣味感官", labelEn: "sensory" },
    { value: "magic", labelZh: "魔法", labelEn: "magic" },
    { value: "silly", labelZh: "搞笑臭臭", labelEn: "silly" },
    { value: "nature", labelZh: "自然森林", labelEn: "nature" },
    { value: "emotion", labelZh: "情緒故事", labelEn: "emotion" },
  ];

const CHARACTER_OPTIONS: { value: "all" | "fina" | "poffy" | "lilo"; label: string }[] = [
  { value: "all", label: "全部" },
  { value: "fina", label: "Fina 菲娜" },
  { value: "poffy", label: "Poffy 波飛" },
  { value: "lilo", label: "Lilo 里洛" },
];

function filterSoups(
  list: Soup[],
  category: "all" | Soup["category"],
  character: "all" | "fina" | "poffy" | "lilo",
  moodQuery: string,
): Soup[] {
  const moodNeedle = moodQuery.trim();
  return list.filter((soup) => {
    if (category !== "all" && soup.category !== category) return false;
    if (character !== "all") {
      if (soup.characterSlug !== character) return false;
    }
    if (moodNeedle && !soup.mood.includes(moodNeedle)) return false;
    return true;
  });
}

function hasActiveFilters(
  category: "all" | Soup["category"],
  character: "all" | "fina" | "poffy" | "lilo",
  moodQuery: string,
): boolean {
  return category !== "all" || character !== "all" || moodQuery.trim() !== "";
}

const togglePillClass = (selected: boolean) =>
  [
    "rounded-full border px-sp-3 py-sp-2 text-sm font-medium transition-[background,border-color,box-shadow,color]",
    selected
      ? "border-moss/50 bg-moss/15 text-moss shadow-sm ring-2 ring-moss/25"
      : "border-border-paper bg-paper-card text-wood hover:border-moss-soft/40 hover:bg-paper-section/80",
  ].join(" ");

interface SoupCardsClientProps {
  soups: Soup[];
}

export function SoupCardsClient({ soups }: SoupCardsClientProps) {
  const [category, setCategory] = useState<"all" | Soup["category"]>("all");
  const [character, setCharacter] = useState<"all" | "fina" | "poffy" | "lilo">("all");
  const [moodQuery, setMoodQuery] = useState("");

  const filtered = useMemo(
    () => filterSoups(soups, category, character, moodQuery),
    [soups, category, character, moodQuery],
  );

  const active = hasActiveFilters(category, character, moodQuery);

  const clearAll = () => {
    setCategory("all");
    setCharacter("all");
    setMoodQuery("");
  };

  return (
    <div className="min-h-screen bg-paper text-wood">
      <PageHero
        title="Soup Cards"
        titleZh="湯譜卡"
        subtitle="Soups of the forest. Each one is a small, gentle piece of the story world."
        subtitleZh="森林裡的湯；每一碗，都是故事世界裡一小片溫柔。"
      />

      <div className="mx-auto max-w-3xl px-4 pb-16 sm:px-6 sm:pb-20">
        <div className="mb-sp-8 space-y-sp-6 rounded-2xl border border-border-paper bg-paper-card/60 p-sp-5 shadow-[var(--shadow-paper)] sm:p-sp-6">
          <div className="flex flex-col gap-sp-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-medium text-wood">篩選湯譜</p>
            <button
              type="button"
              onClick={clearAll}
              className="self-start rounded-full border border-border-paper bg-paper px-sp-3 py-1.5 text-sm text-wood-muted transition-colors hover:border-moss-soft/35 hover:text-wood sm:self-auto"
            >
              清除全部
            </button>
          </div>

          <fieldset className="space-y-sp-2">
            <legend className="text-xs font-medium uppercase tracking-wide text-wood-muted">
              Filter by Category
            </legend>
            <div className="flex flex-wrap gap-sp-2">
              {CATEGORY_OPTIONS.map((opt) => {
                const selected =
                  opt.value === "all" ? category === "all" : category === opt.value;
                return (
                  <button
                    key={opt.value === "all" ? "all" : opt.value}
                    type="button"
                    onClick={() => setCategory(opt.value)}
                    className={togglePillClass(selected)}
                    aria-pressed={selected}
                  >
                    <span className="block sm:inline">{opt.labelZh}</span>
                    <span className="ml-1 text-xs text-wood-muted/90 sm:inline">({opt.labelEn})</span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <fieldset className="space-y-sp-2">
            <legend className="text-xs font-medium uppercase tracking-wide text-wood-muted">
              Filter by Character
            </legend>
            <div className="flex flex-wrap gap-sp-2">
              {CHARACTER_OPTIONS.map((opt) => {
                const selected =
                  opt.value === "all" ? character === "all" : character === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setCharacter(opt.value)}
                    className={togglePillClass(selected)}
                    aria-pressed={selected}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div className="space-y-sp-2">
            <label htmlFor="soup-mood-filter" className="text-xs font-medium uppercase tracking-wide text-wood-muted">
              Filter by Mood
            </label>
            <input
              id="soup-mood-filter"
              type="search"
              value={moodQuery}
              onChange={(e) => setMoodQuery(e.target.value)}
              placeholder="搜尋心情⋯⋯"
              autoComplete="off"
              className="w-full rounded-xl border border-border-paper bg-paper px-sp-4 py-sp-3 text-base text-wood shadow-inner placeholder:text-wood-muted/70 focus:border-moss-soft focus:outline-none focus:ring-2 focus:ring-moss-soft/30"
            />
          </div>

          {active ? (
            <p className="text-sm text-wood-muted" role="status">
              共 {filtered.length} 碗湯
            </p>
          ) : null}
        </div>

        {filtered.length === 0 ? (
          <p
            className="rounded-2xl border border-moss-soft/25 bg-moss-pale/40 px-sp-5 py-sp-6 text-center text-base leading-relaxed text-wood"
            role="status"
          >
            這個組合菲娜還沒煮過⋯⋯要不要換個材料試試？
          </p>
        ) : (
          <ul className="grid gap-6 sm:gap-8" aria-label="Soup cards">
            {filtered.map((soup) => (
              <li key={soup.slug}>
                <SoupCard soup={soup} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
