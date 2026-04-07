"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { MagicStoryHouseClient } from "@/components/stories/MagicStoryHouseClient";
import {
  ThemeCollectionConfirmSheet,
  ThemeCollectionModal,
} from "@/components/themes/ThemeCollectionModal";
import { soupCards } from "@/data/soupCards";
import type { Theme, ThemeIngredient, ThemeParentNote } from "@/data/themes";
import { useMediaQuery } from "@/lib/useMediaQuery";
import {
  clearThemeProgress,
  getDefaultProgress,
  loadProgress,
  saveProgress,
  type ThemeProgress,
} from "@/lib/themeProgress";

interface ThemePageClientProps {
  theme: Theme;
  /** 主題列表中的下一則（最後一則為 null） */
  nextThemeSlug: string | null;
  nextThemeTitle: string | null;
}

function collectionTypeHint(type: ThemeIngredient["collection"]["type"]): string {
  switch (type) {
    case "choice":
      return "選一個答案";
    case "riddle":
      return "猜一個謎語";
    case "secret":
      return "說一個秘密";
    default:
      return "";
  }
}

function magicZhParagraphs(theme: Theme): string[] {
  if (theme.magicParagraphsZh?.length) return theme.magicParagraphsZh;
  return theme.storyContent
    .split(/\n\n+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function showMagicStoryHouse(theme: Theme): boolean {
  const zh = magicZhParagraphs(theme);
  const en = theme.magicParagraphsEn ?? [];
  return Boolean(
    theme.audioSrc &&
      (theme.magicImageSrc ?? theme.image) &&
      theme.magicSubtitleZh &&
      zh.length > 0 &&
      en.length > 0 &&
      en.length === zh.length,
  );
}

/** 給大人：淺色區塊，直接展開 */
function ParentNoteSection({ note }: { note: ThemeParentNote }) {
  return (
    <section
      aria-label="給大人的說明"
      className="rounded-2xl border border-border-paper/80 bg-moss-pale/25 px-sp-5 py-sp-5 sm:px-sp-6 sm:py-sp-6"
    >
      <p className="text-[11px] font-medium text-wood-muted sm:text-xs">
        <span className="tracking-wide">給大人 · </span>
        <span className="uppercase tracking-[0.12em]">FOR GROWN-UPS</span>
      </p>
      <div className="mt-sp-4 space-y-sp-4 text-sm leading-relaxed text-wood">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-wood-muted sm:text-xs">這個故事在探索</p>
          <p className="mt-sp-1.5">{note.theme}</p>
        </div>
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-wood-muted sm:text-xs">孩子會練習</p>
          <ul className="mt-sp-1.5 list-disc space-y-sp-1 pl-sp-5 marker:text-wood-muted">
            {note.skills.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-wood-muted sm:text-xs">可以這樣延伸</p>
          <p className="mt-sp-1.5">{note.talkingPoint}</p>
        </div>
      </div>
    </section>
  );
}

function riddleAnswerOk(input: string, keyword: string): boolean {
  const t = input.trim();
  if (!t) return false;
  if (t.includes(keyword)) return true;
  if (keyword === "麵包" && t.includes("面包")) return true;
  if (keyword === "面包" && t.includes("麵包")) return true;
  return false;
}

function CollectionPromptHeading({ text }: { text: string }) {
  return (
    <p className="flex gap-sp-2 border-b border-moss/15 py-sp-3 text-base font-medium leading-snug text-moss sm:text-[17px]">
      <span className="mt-0.5 shrink-0 select-none text-moss" aria-hidden>
        ✦
      </span>
      <span>{text}</span>
    </p>
  );
}

interface IngredientChallengePanelProps {
  ing: ThemeIngredient;
  onOpenModal: (finaResponse: string) => void;
  variant?: "inline" | "sheet";
  /** 手機抽屜：選擇題底部的關閉，或共用離開 */
  onDismissSheet?: () => void;
}

function IngredientChallengePanel({
  ing,
  onOpenModal,
  variant = "inline",
  onDismissSheet,
}: IngredientChallengePanelProps) {
  const [riddleInput, setRiddleInput] = useState("");
  const [riddleShowHint, setRiddleShowHint] = useState(false);
  const [secretText, setSecretText] = useState("");

  const c = ing.collection;
  const isSheet = variant === "sheet";

  useEffect(() => {
    setRiddleInput("");
    setRiddleShowHint(false);
    setSecretText("");
  }, [ing.slug]);

  const handleRiddleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (c.type !== "riddle" || !c.riddle) return;
    const { riddle } = c;
    if (riddleAnswerOk(riddleInput, riddle.answer)) {
      onOpenModal(riddle.finaResponse);
      return;
    }
    setRiddleShowHint(true);
  };

  const handleSecretSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (c.type !== "secret" || !c.secret) return;
    const t = secretText.trim();
    if (!t) return;
    onOpenModal(c.secret.finaResponse);
  };

  const sheetFooter = (children: ReactNode) => (
    <div className="mt-sp-4 shrink-0 border-t border-border-paper pt-sp-4">{children}</div>
  );

  const inner = (
    <>
      {c.type === "choice" && c.options ? (
        <>
          {!isSheet ? <CollectionPromptHeading text={c.prompt} /> : null}
          {isSheet ? (
            <div className="flex min-h-0 flex-1 flex-col gap-0">
              <ul
                className="min-h-0 flex-1 list-none space-y-sp-2 overflow-y-auto overscroll-contain"
                role="list"
              >
                {c.options.map((opt) => (
                  <li key={opt.text}>
                    <button
                      type="button"
                      onClick={() => onOpenModal(opt.finaResponse)}
                      className="w-full rounded-xl border border-border-paper bg-paper px-sp-3 py-sp-3 text-left text-sm leading-snug text-wood transition-[border-color,box-shadow] hover:border-moss-soft/45 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-moss/40 focus:ring-offset-2 focus:ring-offset-paper"
                    >
                      <span className="text-wood-muted">○</span> {opt.text}
                    </button>
                  </li>
                ))}
              </ul>
              {sheetFooter(
                <button
                  type="button"
                  onClick={onDismissSheet}
                  className="btn btn-outline btn-md inline-flex w-full min-h-tap-target items-center justify-center"
                >
                  先關閉
                </button>,
              )}
            </div>
          ) : (
            <ul className={`mt-sp-4 grid gap-sp-2`} role="list">
              {c.options.map((opt) => (
                <li key={opt.text}>
                  <button
                    type="button"
                    onClick={() => onOpenModal(opt.finaResponse)}
                    className="w-full rounded-xl border border-border-paper bg-paper px-sp-3 py-sp-3 text-left text-sm leading-snug text-wood transition-[border-color,box-shadow] hover:border-moss-soft/45 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-moss/40 focus:ring-offset-2 focus:ring-offset-paper"
                  >
                    <span className="text-wood-muted">○</span> {opt.text}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </>
      ) : null}

      {c.type === "riddle" && c.riddle ? (
        <>
          {!isSheet ? <CollectionPromptHeading text={c.prompt} /> : null}
          {isSheet ? (
            <form
              onSubmit={handleRiddleSubmit}
              className="flex min-h-0 flex-1 flex-col gap-0 overflow-hidden"
            >
              <div className="min-h-0 flex-1 space-y-sp-3 overflow-y-auto pb-sp-2">
                <p className="text-sm leading-relaxed text-wood">{c.riddle.question}</p>
                <label className="sr-only" htmlFor={`riddle-${ing.slug}`}>
                  謎語答案
                </label>
                <input
                  id={`riddle-${ing.slug}`}
                  type="text"
                  value={riddleInput}
                  onChange={(e) => setRiddleInput(e.target.value)}
                  className="w-full rounded-xl border border-border-paper bg-paper px-sp-3 py-sp-2 text-sm text-wood placeholder:text-wood-muted/70 focus:border-moss-soft/50 focus:outline-none focus:ring-2 focus:ring-moss/30"
                  placeholder="輸入你的答案⋯"
                  autoComplete="off"
                />
                {riddleShowHint ? (
                  <p className="text-sm text-moss" role="status">
                    {c.riddle.hint}
                  </p>
                ) : null}
              </div>
              {sheetFooter(
                <button
                  type="submit"
                  className="btn btn-primary btn-md inline-flex w-full min-h-tap-target items-center justify-center"
                >
                  猜猜看
                </button>,
              )}
            </form>
          ) : (
            <>
              <p className="mt-sp-4 text-sm leading-relaxed text-wood">{c.riddle.question}</p>
              <form onSubmit={handleRiddleSubmit} className="mt-sp-4 space-y-sp-3">
                <label className="sr-only" htmlFor={`riddle-${ing.slug}`}>
                  謎語答案
                </label>
                <input
                  id={`riddle-${ing.slug}`}
                  type="text"
                  value={riddleInput}
                  onChange={(e) => setRiddleInput(e.target.value)}
                  className="w-full rounded-xl border border-border-paper bg-paper px-sp-3 py-sp-2 text-sm text-wood placeholder:text-wood-muted/70 focus:border-moss-soft/50 focus:outline-none focus:ring-2 focus:ring-moss/30"
                  placeholder="輸入你的答案⋯"
                  autoComplete="off"
                />
                {riddleShowHint ? (
                  <p className="text-sm text-moss" role="status">
                    {c.riddle.hint}
                  </p>
                ) : null}
                <button
                  type="submit"
                  className="btn btn-primary btn-sm inline-flex min-h-tap-target items-center"
                >
                  猜猜看
                </button>
              </form>
            </>
          )}
        </>
      ) : null}

      {c.type === "secret" && c.secret ? (
        <>
          {!isSheet ? <CollectionPromptHeading text={c.prompt} /> : null}
          {isSheet ? (
            <form
              onSubmit={handleSecretSubmit}
              className="flex min-h-0 flex-1 flex-col overflow-hidden"
            >
              <div className="min-h-0 flex-1 overflow-y-auto pb-sp-2">
                <label className="sr-only" htmlFor={`secret-${ing.slug}`}>
                  {c.secret.placeholder}
                </label>
                <textarea
                  id={`secret-${ing.slug}`}
                  value={secretText}
                  onChange={(e) => setSecretText(e.target.value)}
                  rows={4}
                  placeholder={c.secret.placeholder}
                  className="w-full resize-y rounded-xl border border-border-paper bg-paper px-sp-3 py-sp-2 text-sm text-wood placeholder:text-wood-muted/70 focus:border-moss-soft/50 focus:outline-none focus:ring-2 focus:ring-moss/30"
                />
              </div>
              {sheetFooter(
                <button
                  type="submit"
                  disabled={!secretText.trim()}
                  className="btn btn-primary btn-md inline-flex w-full min-h-tap-target items-center justify-center disabled:pointer-events-none disabled:opacity-45"
                >
                  召喚材料
                </button>,
              )}
            </form>
          ) : (
            <form onSubmit={handleSecretSubmit} className="space-y-sp-3">
              <label className="sr-only" htmlFor={`secret-${ing.slug}`}>
                {c.secret.placeholder}
              </label>
              <textarea
                id={`secret-${ing.slug}`}
                value={secretText}
                onChange={(e) => setSecretText(e.target.value)}
                rows={3}
                placeholder={c.secret.placeholder}
                className="mt-sp-4 w-full resize-y rounded-xl border border-border-paper bg-paper px-sp-3 py-sp-2 text-sm text-wood placeholder:text-wood-muted/70 focus:border-moss-soft/50 focus:outline-none focus:ring-2 focus:ring-moss/30"
              />
              <button
                type="submit"
                disabled={!secretText.trim()}
                className="btn btn-primary btn-sm inline-flex min-h-tap-target items-center disabled:pointer-events-none disabled:opacity-45"
              >
                召喚材料
              </button>
            </form>
          )}
        </>
      ) : null}
    </>
  );

  if (isSheet) {
    return (
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-sp-1 pb-sp-1 pt-0">{inner}</div>
    );
  }

  return (
    <div className="rounded-2xl border border-border-paper bg-paper-card/90 p-sp-5 sm:p-sp-6">{inner}</div>
  );
}

interface MysteryIngredientCellProps {
  ing: ThemeIngredient;
  st: { collected: boolean; addedToPot: boolean };
  isChallengeActive: boolean;
  onMysteryClick: () => void;
  onAddToPot: () => void;
}

function MysteryIngredientCell({
  ing,
  st,
  isChallengeActive,
  onMysteryClick,
  onAddToPot,
}: MysteryIngredientCellProps) {
  if (!st.collected) {
    const typeHint = collectionTypeHint(ing.collection.type);
    return (
      <button
        type="button"
        onClick={onMysteryClick}
        className={`flex min-h-[11rem] w-full flex-col items-center justify-center rounded-2xl border px-sp-2 py-sp-3 text-center transition-[box-shadow,transform,border-color] motion-reduce:transition-none sm:min-h-[12rem] sm:px-sp-3 sm:py-sp-4 ${
          isChallengeActive
            ? "border-moss/45 bg-paper-section/55 shadow-[var(--shadow-paper)] ring-2 ring-moss/35"
            : "border-border-paper/50 bg-gradient-to-b from-paper-section/80 to-paper-section/50 shadow-sm backdrop-blur-[0.5px] hover:border-moss-soft/30 hover:shadow-md"
        } `}
        aria-pressed={isChallengeActive}
      >
        <span
          className="select-none font-heading text-5xl font-medium text-wood-muted/35 blur-[0.3px] sm:text-6xl"
          aria-hidden
        >
          ？
        </span>
        <p className="mt-sp-3 text-sm font-medium text-moss">{typeHint}</p>
        <span className="mt-sp-2 text-[11px] text-wood-muted/90 sm:text-xs">點擊開始</span>
      </button>
    );
  }

  if (!st.addedToPot) {
    return (
      <div className="animate-ingredient-reveal flex min-h-[8.5rem] w-full flex-col rounded-2xl border border-border-paper bg-paper-card p-sp-4 shadow-[var(--shadow-paper)] sm:min-h-[9.5rem]">
        <p className="animate-ingredient-text-reveal font-medium text-wood">{ing.name}</p>
        <p className="animate-ingredient-text-reveal mt-sp-2 flex-1 text-left text-xs leading-relaxed text-wood-muted sm:text-sm">
          {ing.description}
        </p>
        <button
          type="button"
          onClick={onAddToPot}
          className="btn btn-primary btn-sm mt-sp-3 inline-flex min-h-tap-target w-full items-center justify-center"
        >
          放進鍋裡
        </button>
        <p className="mt-sp-2 text-center text-[10px] text-wood-muted sm:text-xs">
          來自{" "}
          <Link
            href={`/world/${ing.locationSlug}`}
            className="text-moss underline-offset-2 hover:underline"
          >
            {ing.locationName}
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div
      className="relative flex min-h-[8.5rem] w-full flex-col items-center justify-center rounded-2xl border border-moss/15 bg-paper-section/75 px-sp-3 py-sp-4 opacity-90 ring-1 ring-border-paper/80 sm:min-h-[9.5rem]"
      aria-label={`${ing.name} 已放入鍋中`}
    >
      <span
        className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-moss/15 text-sm text-moss"
        aria-hidden
      >
        ✓
      </span>
      <p className="text-center font-medium text-wood">{ing.name}</p>
      <span className="mt-sp-2 text-sm font-medium text-moss">✓ 已放入</span>
    </div>
  );
}

function getSoupDisplayName(theme: Theme): string {
  return soupCards.find((s) => s.slug === theme.soupSlug)?.name ?? theme.title;
}

export function ThemePageClient({ theme, nextThemeSlug, nextThemeTitle }: ThemePageClientProps) {
  const soupDisplayName = useMemo(() => getSoupDisplayName(theme), [theme]);
  const [progress, setProgress] = useState<ThemeProgress>(() => getDefaultProgress(theme));
  const [activeIngredient, setActiveIngredient] = useState<string | null>(null);
  const [modal, setModal] = useState<{ slug: string; finaResponse: string } | null>(null);
  const [challengeSheetEntered, setChallengeSheetEntered] = useState(false);

  const isMdUp = useMediaQuery("(min-width: 768px)");

  useEffect(() => {
    setProgress(loadProgress(theme));
  }, [theme]);

  const commit = useCallback(
    (next: ThemeProgress) => {
      setProgress(next);
      saveProgress(theme, next);
    },
    [theme],
  );

  const addedCount = useMemo(() => {
    return theme.ingredients.filter((ing) => progress.ingredients[ing.slug]?.addedToPot).length;
  }, [theme.ingredients, progress.ingredients]);

  const allInPot = addedCount === theme.ingredients.length;

  const addToPot = (slug: string) => {
    const ing = progress.ingredients[slug];
    if (!ing?.collected || ing.addedToPot) return;
    commit({
      ...progress,
      ingredients: {
        ...progress.ingredients,
        [slug]: { ...ing, addedToPot: true },
      },
    });
  };

  const finishSoup = () => {
    commit({
      ...progress,
      soupComplete: true,
      badgeEarned: true,
    });
  };

  const confirmCollect = () => {
    if (!modal) return;
    const slug = modal.slug;
    const ing = progress.ingredients[slug];
    if (!ing) return;
    commit({
      ...progress,
      ingredients: {
        ...progress.ingredients,
        [slug]: { ...ing, collected: true },
      },
    });
    setModal(null);
    setActiveIngredient(null);
  };

  const dismissModal = () => {
    setModal(null);
  };

  const closeChallengeSheet = useCallback(() => {
    setActiveIngredient(null);
  }, []);

  const modalIngredientName =
    modal ? theme.ingredients.find((i) => i.slug === modal.slug)?.name ?? "" : "";

  const activeIng = activeIngredient
    ? theme.ingredients.find((i) => i.slug === activeIngredient)
    : undefined;
  const showChallengePanel = Boolean(
    activeIng &&
      activeIngredient &&
      !(progress.ingredients[activeIngredient]?.collected ?? false),
  );

  const showMobileChallengeSheet =
    Boolean(showChallengePanel && activeIng && isMdUp === false && !modal);

  useEffect(() => {
    if (!showMobileChallengeSheet) {
      setChallengeSheetEntered(false);
      return;
    }
    const id = requestAnimationFrame(() => setChallengeSheetEntered(true));
    return () => cancelAnimationFrame(id);
  }, [showMobileChallengeSheet]);

  useEffect(() => {
    if (!showMobileChallengeSheet) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeChallengeSheet();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showMobileChallengeSheet, closeChallengeSheet]);

  const handleMysteryClick = (slug: string) => {
    setActiveIngredient((prev) => (prev === slug ? null : slug));
  };

  const handleClearProgress = () => {
    if (!window.confirm("確定要清除這個主題的採集與煮湯紀錄嗎？將回到一開始的狀態。")) {
      return;
    }
    const fresh = clearThemeProgress(theme);
    commit(fresh);
    setActiveIngredient(null);
    setModal(null);
  };

  const magicZh = useMemo(() => magicZhParagraphs(theme), [theme]);
  const magicOn = useMemo(() => showMagicStoryHouse(theme), [theme]);

  return (
    <div className="relative min-h-screen bg-paper text-wood">
      <header className="mx-auto max-w-2xl px-page-px pb-sp-8 pt-hero-pt text-center sm:px-page-px-sm sm:pb-sp-10 sm:pt-hero-pt-sm">
        <h1 className="font-heading text-2xl font-semibold leading-tight text-wood sm:text-3xl md:text-4xl">
          {theme.title}
        </h1>
        <p className="mt-sp-4 text-base leading-relaxed text-wood-muted sm:text-lg">{theme.tagline}</p>
      </header>

      {magicOn && theme.audioSrc && theme.magicSubtitleZh && theme.magicParagraphsEn ? (
        <MagicStoryHouseClient
          imageSrc={(theme.magicImageSrc ?? theme.image)!}
          imageAlt={theme.magicImageAlt ?? ""}
          audioSrc={theme.audioSrc}
          subtitleZh={theme.magicSubtitleZh}
          paragraphsZh={magicZh}
          paragraphsEn={theme.magicParagraphsEn}
          playButtonLayout="bottom-bar"
        />
      ) : null}

      <div className="mx-auto max-w-2xl space-y-sp-12 px-page-px pb-sp-16 pt-sp-2 sm:px-page-px-sm sm:pb-sp-20">
        <section aria-label="採集與煮湯" className="pt-12">
          <div className="flex flex-col gap-sp-2 sm:flex-row sm:items-end sm:justify-between sm:gap-sp-4">
            <div className="min-w-0">
              <h2 className="font-heading text-lg font-medium text-moss sm:text-xl">
                煮出《{soupDisplayName}》需要這些材料
              </h2>
              <p className="mt-sp-3 max-w-xl text-sm leading-relaxed text-wood-muted">
                點擊每張神秘卡片，完成小挑戰，就能找到材料。
                <br />
                找齊了再放進鍋裡。
              </p>
            </div>
            <button
              type="button"
              onClick={handleClearProgress}
              className="self-start text-xs text-wood-muted underline decoration-border-paper underline-offset-2 transition-colors hover:text-moss sm:shrink-0"
            >
              清除紀錄
            </button>
          </div>

          <div className="mt-sp-6 grid grid-cols-1 gap-sp-3 sm:grid-cols-3 sm:gap-sp-4">
            {theme.ingredients.map((ing) => {
              const st = progress.ingredients[ing.slug] ?? { collected: false, addedToPot: false };
              const isChallengeActive = activeIngredient === ing.slug && !st.collected;
              return (
                <MysteryIngredientCell
                  key={ing.slug}
                  ing={ing}
                  st={st}
                  isChallengeActive={isChallengeActive}
                  onMysteryClick={() => handleMysteryClick(ing.slug)}
                  onAddToPot={() => addToPot(ing.slug)}
                />
              );
            })}
          </div>

          {showChallengePanel && activeIng && isMdUp === true ? (
            <>
              <div
                className="my-sp-8 h-px w-full bg-gradient-to-r from-transparent via-border-paper to-transparent"
                aria-hidden
              />
              <div className="space-y-sp-4">
                <IngredientChallengePanel
                  key={activeIng.slug}
                  ing={activeIng}
                  onOpenModal={(finaResponse) => setModal({ slug: activeIng.slug, finaResponse })}
                />
              </div>
            </>
          ) : null}

          <div className="mt-sp-10 flex flex-col items-center">
            <div className="relative w-full max-w-xs" aria-hidden>
              <svg
                viewBox="0 0 200 140"
                className="w-full text-moss/40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <ellipse cx="100" cy="118" rx="72" ry="12" fill="currentColor" opacity="0.25" />
                <path
                  d="M40 55c0-22 26-40 60-40s60 18 60 40v48c0 8-8 14-18 14H58c-10 0-18-6-18-14V55Z"
                  fill="currentColor"
                  opacity="0.12"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <ellipse cx="100" cy="55" rx="60" ry="18" fill="currentColor" opacity="0.18" />
                <path
                  d="M52 48c12-6 26-9 48-9s36 3 48 9"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  opacity="0.4"
                />
              </svg>
            </div>
            <p className="mt-sp-4 text-center text-sm text-wood-muted">
              {allInPot && !progress.soupComplete ? (
                <>
                  材料都到齊了，可以開始煮《{soupDisplayName}》了！
                </>
              ) : (
                <>
                  已放入 {addedCount} / {theme.ingredients.length} 個材料，再加油！
                </>
              )}
            </p>
            {allInPot && !progress.soupComplete ? (
              <button
                type="button"
                onClick={finishSoup}
                className="btn btn-primary btn-md mt-sp-6 inline-flex min-h-tap-target items-center justify-center"
              >
                完成這鍋湯！
              </button>
            ) : null}
          </div>

          {progress.soupComplete ? (
            <div
              className="animate-fade-in-up mt-sp-10 rounded-2xl border border-moss-soft/40 bg-moss-pale/50 px-sp-6 py-sp-8 text-center"
              role="status"
            >
              <p className="text-4xl" aria-hidden>
                ✦
              </p>
              <p className="mt-sp-3 font-heading text-lg font-medium text-moss sm:text-xl">
                你獲得了：{theme.badgeName}
              </p>
              <p className="mt-sp-2 text-sm text-wood-muted">湯在鍋裡輕輕冒泡，香味也留在你心裡了。</p>
            </div>
          ) : null}
        </section>

        <section className="space-y-sp-4" aria-label="實體體驗建議">
          <p className="text-sm leading-relaxed text-wood-muted">
            今天的材料找齊了嗎？還有兩件事可以一起做：
          </p>
          <div className="grid gap-sp-4 sm:grid-cols-2">
            <div className="flex flex-col rounded-2xl border border-border-paper bg-paper-card/80 p-card-padding">
              <p className="text-[11px] font-medium uppercase tracking-wide text-wood-muted">小冒險 · 出門去做</p>
              <p className="mt-sp-2 font-heading text-base font-semibold text-wood">{theme.adventure.title}</p>
              <p className="mt-sp-3 flex-1 text-sm leading-relaxed text-wood-muted">{theme.adventure.description}</p>
              <p className="mt-sp-4 text-[11px] leading-snug text-wood-muted/85 sm:text-xs">
                這個不影響煮湯，但會讓今天更有趣。
              </p>
            </div>
            <div className="flex flex-col rounded-2xl border border-border-paper bg-paper-card/80 p-card-padding">
              <p className="text-[11px] font-medium uppercase tracking-wide text-wood-muted">自然手作 · 動手做</p>
              <p className="mt-sp-2 font-heading text-base font-semibold text-wood">{theme.natureCraft.title}</p>
              <p className="mt-sp-3 flex-1 text-sm leading-relaxed text-wood-muted">{theme.natureCraft.description}</p>
              <p className="mt-sp-4 text-[11px] leading-snug text-wood-muted/85 sm:text-xs">
                這個不影響煮湯，但會讓今天更有趣。
              </p>
            </div>
          </div>
        </section>

        <ParentNoteSection note={theme.parentNote} />

        <section aria-labelledby="theme-books">
          <h2 id="theme-books" className="font-heading text-lg font-medium text-wood">
            還想繼續？這些書也許你會喜歡
          </h2>
          <ul className="mt-sp-6 space-y-sp-5 border-t border-border-paper pt-sp-6">
            {theme.books.map((book) => (
              <li key={book.title} className="text-sm leading-relaxed">
                <p className="font-medium text-wood">
                  {book.title}
                  <span className="font-normal text-wood-muted"> · {book.author}</span>
                </p>
                <p className="mt-sp-1 text-wood-muted">{book.reason}</p>
              </li>
            ))}
          </ul>
        </section>

        <nav
          className="flex flex-col gap-sp-4 border-t border-border-paper pt-sp-8 sm:flex-row sm:items-center sm:justify-between"
          aria-label="主題導覽"
        >
          <Link href="/stories" className="text-sm font-medium text-moss transition-colors hover:text-moss-hover">
            ← 回到故事時間
          </Link>
          {nextThemeSlug && nextThemeTitle ? (
            <Link
              href={`/themes/${nextThemeSlug}`}
              className="text-sm font-medium text-moss transition-colors hover:text-moss-hover sm:text-right"
            >
              → 下一個故事：{nextThemeTitle}
            </Link>
          ) : null}
        </nav>
      </div>

      {modal && isMdUp === true ? (
        <ThemeCollectionModal
          open
          ingredientName={modalIngredientName}
          finaResponse={modal.finaResponse}
          onConfirm={confirmCollect}
          onDismiss={dismissModal}
        />
      ) : null}

      <ThemeCollectionConfirmSheet
        open={Boolean(modal) && isMdUp === false}
        ingredientName={modalIngredientName}
        finaResponse={modal?.finaResponse ?? ""}
        onConfirm={confirmCollect}
        onDismiss={dismissModal}
      />

      {showMobileChallengeSheet && activeIng ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 bg-[rgba(0,0,0,0.3)] md:hidden"
            aria-label="關閉採集挑戰"
            onClick={closeChallengeSheet}
          />
          <div
            className={`fixed bottom-0 left-0 z-50 flex max-h-[70vh] w-full min-h-0 flex-col overflow-hidden bg-paper-card shadow-[var(--shadow-warm)] transition-transform duration-300 ease-out md:hidden ${
              challengeSheetEntered ? "translate-y-0" : "translate-y-full"
            }`}
            style={{ borderRadius: "16px 16px 0 0" }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="theme-challenge-sheet-title"
          >
            <div className="flex shrink-0 flex-col items-center px-sp-5 pt-3">
              <div className="mb-3 h-[3px] w-8 rounded-full bg-wood-muted/35" aria-hidden />
            </div>
            <div className="shrink-0 px-sp-5 pb-sp-3">
              <p id="theme-challenge-sheet-title" className="text-[12px] text-wood-muted">
                ✦ {activeIng.name} 的挑戰
              </p>
              <p className="pt-sp-2 text-base font-medium leading-snug text-moss">
                {activeIng.collection.prompt}
              </p>
            </div>
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-sp-5 pb-sp-6">
              <IngredientChallengePanel
                key={activeIng.slug}
                variant="sheet"
                ing={activeIng}
                onOpenModal={(finaResponse) => setModal({ slug: activeIng.slug, finaResponse })}
                onDismissSheet={closeChallengeSheet}
              />
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}

