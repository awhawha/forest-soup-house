import { Button } from "@/components/Button";
import type { TodaysAdventure } from "@/data/todaysAdventures";

interface TodaysAdventureCardProps {
  adventure: TodaysAdventure;
}

/**
 * Today's Little Adventure — bilingual EN + 繁中; compact layout.
 */
export function TodaysAdventureCard({ adventure }: TodaysAdventureCardProps) {
  const {
    title,
    titleZh,
    prompt,
    promptZh,
    narrative,
    narrativeZh,
    characterName,
    characterNameZh,
    location,
    locationZh,
  } = adventure;

  const locationShort = location?.replace(/^the /i, "") ?? "";
  const trailBadge =
    locationShort && locationZh
      ? `${locationShort} · ${locationZh}`
      : locationShort || locationZh || "Forest path · 森林小徑";

  const metaEn =
    characterName && location
      ? `${characterName} · ${location.replace(/^the /i, "")}`
      : [characterName, location].filter(Boolean).join(" · ");
  const metaZh =
    characterNameZh && locationZh
      ? `${characterNameZh} · ${locationZh}`
      : [characterNameZh, locationZh].filter(Boolean).join(" · ");

  return (
    <article className="overflow-hidden rounded-2xl border border-border-card bg-paper-card shadow-[var(--shadow-paper)]">
      <div className="relative aspect-[2/1] w-full overflow-hidden bg-gradient-to-br from-moss-pale via-paper-card to-border-paper">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 80% 60% at 70% 40%, var(--moss-soft), transparent 55%)",
          }}
          aria-hidden
        />
        <div className="absolute bottom-3 left-3 flex max-w-[min(100%,16rem)] items-center gap-1.5 rounded-full bg-paper-card px-2.5 py-1.5 text-[11px] font-medium text-moss shadow-[var(--shadow-paper)] sm:text-xs">
          <span className="inline-flex size-3.5 shrink-0 text-moss" aria-hidden>
            <svg viewBox="0 0 24 24" fill="currentColor" className="size-full">
              <path d="M12 3 5 14h4v7h6v-7h4L12 3z" />
            </svg>
          </span>
          <span className="truncate leading-tight">{trailBadge}</span>
        </div>
      </div>

      <div className="flex flex-col gap-sp-4 px-sp-5 pb-sp-5 pt-sp-5">
        <p className="text-[10px] tracking-[0.08em] text-wood-muted uppercase sm:text-xs">
          Today in the Forest · 今日森林時刻
        </p>

        <div className="flex items-start justify-between gap-sp-3">
          <div className="min-w-0 flex-1">
            <h2 className="font-heading text-lg font-medium leading-snug text-wood sm:text-xl">
              <span className="block">{title}</span>
              {titleZh ? (
                <span className="mt-0.5 block text-base font-normal text-wood-muted sm:text-lg">
                  {titleZh}
                </span>
              ) : null}
            </h2>
          </div>
          <span className="shrink-0 text-lg leading-none text-accent-amber" aria-hidden>
            ✦
          </span>
        </div>

        {(metaEn || metaZh) ? (
          <div className="space-y-0.5 text-xs text-wood-muted">
            {metaEn ? <p>{metaEn}</p> : null}
            {metaZh ? <p className="text-wood-soft">{metaZh}</p> : null}
          </div>
        ) : null}

        <div className="space-y-sp-2">
          {narrative ? (
            <>
              <p className="text-sm italic leading-relaxed text-wood">{narrative}</p>
              {narrativeZh ? (
                <p className="text-xs leading-relaxed text-wood-muted">{narrativeZh}</p>
              ) : null}
            </>
          ) : null}
          <p className="text-sm leading-relaxed tracking-tight text-wood">{prompt}</p>
          {promptZh ? (
            <p className="text-xs leading-relaxed text-wood-muted">{promptZh}</p>
          ) : null}
        </div>

        <Button
          variant="outline"
          href={`/adventures/${adventure.slug}`}
          className="w-full justify-center text-sm"
        >
          Begin quest · 開始小冒險
        </Button>
      </div>
    </article>
  );
}
