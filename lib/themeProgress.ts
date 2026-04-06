import type { Theme } from "@/data/themes";

export interface ThemeProgress {
  ingredients: Record<
    string,
    {
      collected: boolean;
      addedToPot: boolean;
    }
  >;
  soupComplete: boolean;
  badgeEarned: boolean;
}

export const THEME_PROGRESS_KEY = (slug: string) => `theme-progress-${slug}`;

export function getDefaultProgress(theme: Theme): ThemeProgress {
  const ingredients: ThemeProgress["ingredients"] = {};
  for (const ing of theme.ingredients) {
    ingredients[ing.slug] = { collected: false, addedToPot: false };
  }
  return {
    ingredients,
    soupComplete: false,
    badgeEarned: false,
  };
}

export function mergeProgress(theme: Theme, stored: Partial<ThemeProgress> | null): ThemeProgress {
  const def = getDefaultProgress(theme);
  if (!stored) return def;
  const mergedIngredients = { ...def.ingredients };
  for (const ing of theme.ingredients) {
    const s = stored.ingredients?.[ing.slug];
    mergedIngredients[ing.slug] = {
      collected: s?.collected ?? false,
      addedToPot: s?.addedToPot ?? false,
    };
  }
  return {
    ingredients: mergedIngredients,
    soupComplete: stored.soupComplete ?? false,
    badgeEarned: stored.badgeEarned ?? false,
  };
}

export function loadProgress(theme: Theme): ThemeProgress {
  if (typeof window === "undefined") return getDefaultProgress(theme);
  try {
    const raw = localStorage.getItem(THEME_PROGRESS_KEY(theme.slug));
    if (!raw) return getDefaultProgress(theme);
    const parsed = JSON.parse(raw) as Partial<ThemeProgress>;
    return mergeProgress(theme, parsed);
  } catch {
    return getDefaultProgress(theme);
  }
}

export function saveProgress(theme: Theme, progress: ThemeProgress): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(THEME_PROGRESS_KEY(theme.slug), JSON.stringify(progress));
}

/** 移除此主題在 localStorage 的進度（採集、煮湯、徽章）。 */
export function clearThemeProgress(theme: Theme): ThemeProgress {
  if (typeof window !== "undefined") {
    localStorage.removeItem(THEME_PROGRESS_KEY(theme.slug));
  }
  return getDefaultProgress(theme);
}

export function markIngredientCollected(theme: Theme, ingredientSlug: string): ThemeProgress {
  const progress = loadProgress(theme);
  if (progress.ingredients[ingredientSlug]) {
    progress.ingredients[ingredientSlug].collected = true;
  }
  saveProgress(theme, progress);
  return progress;
}
