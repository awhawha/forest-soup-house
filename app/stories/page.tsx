import { PageHero } from "@/components/PageHero";
import { StoriesGridCard } from "@/components/cards/StoriesGridCard";
import { themes } from "@/data/themes";

const gridClass =
  "grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3 md:gap-x-4 lg:grid-cols-4 lg:gap-x-5";

export default function StoriesPage() {
  return (
    <div className="min-h-screen bg-paper text-wood">
      <PageHero
        title="Story Time"
        titleZh="故事時間"
        subtitle="Pick a story. Each one opens a full forest journey."
        subtitleZh="選一個故事開始，帶你進入完整的森林旅程。"
      />
      <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 sm:pb-20">
        <ul className={gridClass} aria-label="主題包">
          {themes.map((theme) => (
            <li key={theme.slug} className="min-w-0">
              <StoriesGridCard
                href={`/themes/${theme.slug}`}
                image={theme.image}
                title={theme.title}
                tagline={theme.tagline}
                showThemePackBadge
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
