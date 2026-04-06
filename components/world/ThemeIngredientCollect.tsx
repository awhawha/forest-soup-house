"use client";

import { useRouter } from "next/navigation";
import { getThemeBySlug } from "@/data/themes";
import { markIngredientCollected } from "@/lib/themeProgress";
import { HerbalPatchSoftFlowerCollect } from "@/components/world/HerbalPatchSoftFlowerCollect";

interface ThemeIngredientCollectProps {
  locationSlug: string;
  themeSlug?: string;
  ingredientSlug?: string;
  /** 若地點尚未開放，不顯示採集區 */
  locationOpen: boolean;
}

export function ThemeIngredientCollect({
  locationSlug,
  themeSlug,
  ingredientSlug,
  locationOpen,
}: ThemeIngredientCollectProps) {
  const router = useRouter();

  if (!locationOpen || !themeSlug || !ingredientSlug) {
    return null;
  }

  const theme = getThemeBySlug(themeSlug);
  if (!theme) {
    return null;
  }

  const ingredient = theme.ingredients.find((i) => i.slug === ingredientSlug);
  if (!ingredient || ingredient.locationSlug !== locationSlug) {
    return (
      <div
        className="mb-sp-6 rounded-2xl border border-border-paper bg-paper-section/60 px-sp-4 py-sp-4 text-sm text-wood-muted"
        role="status"
      >
        這個材料要在別的地方採集喔。
      </div>
    );
  }

  if (
    locationSlug === "herbal-patch" &&
    themeSlug === "memory-soup" &&
    ingredientSlug === "soft-flower"
  ) {
    return <HerbalPatchSoftFlowerCollect theme={theme} />;
  }

  const handleFound = () => {
    markIngredientCollected(theme, ingredientSlug);
    router.push(`/themes/${themeSlug}`);
  };

  return (
    <div className="mb-sp-8 rounded-2xl border border-moss-soft/35 bg-moss-pale/40 px-sp-5 py-sp-5 sm:px-sp-6 sm:py-sp-6">
      <p className="text-sm font-medium text-moss">主題採集任務</p>
      <p className="mt-sp-2 text-base font-medium text-wood">
        菲娜說：幫我找{ingredient.name}！
      </p>
      <p className="mt-sp-3 text-sm leading-relaxed text-wood-muted">{ingredient.description}</p>
      <button
        type="button"
        onClick={handleFound}
        className="btn btn-primary btn-md mt-sp-5 inline-flex min-h-tap-target w-full items-center justify-center sm:w-auto"
      >
        我找到了！
      </button>
    </div>
  );
}
