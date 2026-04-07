import Link from "next/link";

function firstDisplayChar(label: string): string {
  const t = label.trim();
  return t.length > 0 ? t[0]! : "?";
}

interface StoriesGridCardProps {
  href: string;
  image?: string;
  /** 主標題（14px，最多兩行） */
  title: string;
  /** 副標（12px，一行） */
  tagline: string;
  /** 主題包卡片顯示「完整主題包」 */
  showThemePackBadge?: boolean;
}

/**
 * YouTube / Spotify 風格：縮圖為主，下方精簡文字。無卡片外框與內距。
 */
export function StoriesGridCard({
  href,
  image,
  title,
  tagline,
  showThemePackBadge = false,
}: StoriesGridCardProps) {
  const initial = firstDisplayChar(title);

  return (
    <Link
      href={href}
      className="group block cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-moss/45 focus-visible:ring-offset-2 focus-visible:ring-offset-paper rounded-lg"
    >
      <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-moss-pale transition-transform duration-200 ease-out will-change-transform group-hover:scale-[1.02] motion-reduce:group-hover:scale-100">
        {image ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={image} alt="" className="h-full w-full object-cover" />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center bg-moss-pale"
            aria-hidden
          >
            <span className="select-none font-heading text-4xl font-semibold text-moss/50 sm:text-5xl">
              {initial}
            </span>
          </div>
        )}
      </div>

      <div className="mt-2 flex min-w-0 flex-col gap-1">
        {showThemePackBadge ? (
          <span className="inline-flex w-fit max-w-full items-center rounded-full border border-moss/30 bg-moss/10 px-1.5 py-px text-[10px] font-medium leading-tight text-moss">
            完整主題包
          </span>
        ) : null}
        <p className="line-clamp-2 text-[14px] font-medium leading-snug text-wood">{title}</p>
        <p className="line-clamp-1 text-xs text-wood-muted">{tagline}</p>
      </div>
    </Link>
  );
}
