import Link from "next/link";
import type { Story } from "@/data/stories";

interface StoryCardProps {
  story: Story;
}

/**
 * Story in list view (Story Time page). Soft card; optional image.
 * With `themeSlug`, links to `/themes/[themeSlug]` and shows a theme-pack hint.
 * Otherwise links to `/stories/[slug]`. Handles missing image gracefully.
 *
 * Spacing tokens:
 *   p-card-padding   → --card-padding (24px) card inner padding
 *   mb-sp-3          → --sp-3         (12px) image bottom margin
 *   mt-sp-2          → --sp-2         (8px)  description top margin
 *   min-h-tap-target → --tap-target   (44px) min tap height
 */
export function StoryCard({ story }: StoryCardProps) {
  const { slug, title, titleZh, description, descriptionZh, image, themeSlug } = story;

  const href = themeSlug ? `/themes/${themeSlug}` : `/stories/${slug}`;

  return (
    <Link
      href={href}
      className="block min-h-tap-target rounded-2xl border border-border-paper bg-paper-card/80 p-card-padding transition-[box-shadow,transform] hover:border-border-paper hover:shadow-md hover:shadow-wood/5 focus:outline-none focus:ring-2 focus:ring-moss/40 focus:ring-offset-2 focus:ring-offset-paper motion-reduce:hover:shadow-none motion-reduce:hover:translate-y-0 hover:-translate-y-0.5"
    >
      {image ? (
        <div className="relative mb-sp-3 aspect-[4/3] w-full overflow-hidden rounded-xl bg-border-paper">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt="" className="h-full w-full object-cover" />
        </div>
      ) : null}
      {themeSlug ? (
        <div className="mb-sp-2 flex flex-col gap-1">
          <span className="inline-flex w-fit items-center rounded-full border border-moss/30 bg-moss/10 px-sp-2 py-0.5 text-[11px] font-medium text-moss sm:text-xs">
            完整主題包
          </span>
          <p className="text-[11px] leading-snug text-wood-muted sm:text-xs">
            故事 · 採集 · 煮湯 · 延伸閱讀
          </p>
        </div>
      ) : null}
      {titleZh ? (
        <>
          <span className="font-medium text-wood">{titleZh}</span>
          <span className="mt-0.5 block text-sm font-normal text-wood-muted">{title}</span>
        </>
      ) : (
        <span className="font-medium text-wood">{title}</span>
      )}
      {descriptionZh ? (
        <p className="mt-sp-2 text-sm leading-snug text-wood-soft">{descriptionZh}</p>
      ) : null}
      {description ? (
        <p
          className={`text-sm text-wood-muted leading-snug ${descriptionZh ? "mt-sp-1" : "mt-sp-2"}`}
        >
          {description}
        </p>
      ) : null}
    </Link>
  );
}
