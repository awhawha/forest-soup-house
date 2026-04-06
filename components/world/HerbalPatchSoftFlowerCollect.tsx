"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import type { Theme } from "@/data/themes";
import { loadProgress, markIngredientCollected } from "@/lib/themeProgress";

const INGREDIENT_SLUG = "soft-flower";

const OPTIONS = [
  { id: "A" as const, label: "像曬過太陽的棉被，軟軟暖暖的" },
  { id: "B" as const, label: "像雨後的泥土，濕濕涼涼的" },
  { id: "C" as const, label: "像糖果，甜甜黏黏的" },
];

const FINA_BY_CHOICE: Record<(typeof OPTIONS)[number]["id"], string> = {
  A: "對！就是這個！像奶奶家的棉被，讓人好安心。",
  B: "這朵也很特別，雨後的味道讓人想起很多事。",
  C: "哈哈，甜甜的也不錯！加進湯裡一定很有趣。",
};

interface HerbalPatchSoftFlowerCollectProps {
  theme: Theme;
}

export function HerbalPatchSoftFlowerCollect({ theme }: HerbalPatchSoftFlowerCollectProps) {
  const router = useRouter();
  const [alreadyCollected, setAlreadyCollected] = useState(false);
  const [choice, setChoice] = useState<(typeof OPTIONS)[number]["id"] | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const p = loadProgress(theme);
    if (p.ingredients[INGREDIENT_SLUG]?.collected) {
      setAlreadyCollected(true);
    }
  }, [theme]);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setChoice(null);
  }, []);

  useEffect(() => {
    if (!modalOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modalOpen, closeModal]);

  const handlePick = (id: (typeof OPTIONS)[number]["id"]) => {
    setChoice(id);
    setModalOpen(true);
  };

  const handleTakeBack = () => {
    markIngredientCollected(theme, INGREDIENT_SLUG);
    router.push(`/themes/${theme.slug}`);
  };

  if (alreadyCollected) {
    return (
      <div className="mb-sp-8 rounded-2xl border border-moss-soft/35 bg-moss-pale/40 px-sp-5 py-sp-5 sm:px-sp-6 sm:py-sp-6">
        <p className="text-sm leading-relaxed text-wood-muted">
          你已把「軟綿綿小花」帶回湯湯屋了。
        </p>
        <Link
          href={`/themes/${theme.slug}`}
          className="btn btn-primary btn-md mt-sp-4 inline-flex w-full justify-center sm:w-auto"
        >
          回到主題包 →
        </Link>
      </div>
    );
  }

  return (
    <>
      {!modalOpen ? (
        <div className="mb-sp-8 rounded-2xl border border-moss-soft/35 bg-moss-pale/40 px-sp-5 py-sp-5 sm:px-sp-6 sm:py-sp-6">
          <p className="text-sm font-medium text-moss">主題採集任務</p>
          <p className="mt-sp-2 text-base font-medium leading-snug text-wood">
            菲娜說：今天花園裡開了三朵花，哪一朵聞起來像軟綿綿小花的味道？
          </p>
          <ul className="mt-sp-4 grid gap-sp-3" role="list">
            {OPTIONS.map((opt) => (
              <li key={opt.id}>
                <button
                  type="button"
                  onClick={() => handlePick(opt.id)}
                  className="w-full rounded-2xl border border-border-paper bg-paper-card/90 p-sp-4 text-left text-sm leading-relaxed text-wood shadow-[var(--shadow-paper)] transition-[border-color,box-shadow,transform] hover:border-moss-soft/45 hover:shadow-md motion-reduce:hover:translate-y-0 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-moss/40 focus:ring-offset-2 focus:ring-offset-moss-pale"
                >
                  <span className="font-medium text-moss">{opt.id}.</span>{" "}
                  <span className="text-wood">{opt.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {modalOpen && choice ? (
        <div
          className="absolute inset-0 z-50 flex items-center justify-center bg-wood/45 px-sp-4 py-sp-10 backdrop-blur-[1px]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="collect-modal-title"
        >
          <div className="animate-modal-scale-in w-full max-w-sm rounded-2xl border border-border-paper bg-paper-card px-sp-6 py-sp-8 shadow-[var(--shadow-warm)]">
            <p className="text-center text-5xl leading-none" aria-hidden>
              ✿
            </p>
            <h2
              id="collect-modal-title"
              className="font-heading mt-sp-4 text-center text-xl font-medium text-wood"
            >
              你找到了！
            </h2>
            <p className="mt-sp-3 text-center text-2xl font-medium text-moss">軟綿綿小花</p>
            <p className="mt-sp-4 text-center text-sm leading-relaxed text-wood-muted">
              {FINA_BY_CHOICE[choice]}
            </p>
            <button
              type="button"
              onClick={handleTakeBack}
              className="btn btn-primary btn-md mt-sp-6 inline-flex w-full min-h-tap-target items-center justify-center"
            >
              帶回湯湯屋 →
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
