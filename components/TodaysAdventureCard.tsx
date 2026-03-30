import type { Adventure } from "@/data/adventure";

interface TodaysAdventureCardProps {
  adventure: Adventure;
}

/**
 * Today's Little Adventure on the homepage. Full play prompt on card; no CTA.
 *
 * Spacing tokens:
 *   px-card-gap / py-card-gap → --card-gap  (16px) card padding mobile
 *   sm:px-sp-5                → --sp-5      (20px) card padding desktop
 *   space-y-sp-2              → --sp-2      (8px)  inner item spacing
 *   pt-sp-1                   → --sp-1      (4px)  prompt top padding
 */
export function TodaysAdventureCard({ adventure }: TodaysAdventureCardProps) {
  const { title, prompt, narrative, characterName, location } = adventure;

  return (
    <div className="flex flex-col rounded-xl border border-border-card bg-paper-card/80 px-card-gap py-card-gap sm:px-sp-5">
      <div className="space-y-sp-2">
        <p className="text-[10px] tracking-[0.1em] text-wood-muted uppercase sm:text-xs">
          Today in the Forest
        </p>
        <h2 className="font-heading text-base font-medium text-wood sm:text-lg">
          {title}
        </h2>
        {(characterName ?? location) ? (
          <p className="text-xs text-wood-muted">
            {[characterName, location].filter(Boolean).join(" · ")}
          </p>
        ) : null}
        {narrative ? (
          <p className="text-sm italic leading-relaxed text-wood">
            {narrative}
          </p>
        ) : null}
        <p className="pt-sp-1 text-sm leading-relaxed text-wood">
          {prompt}
        </p>
      </div>
    </div>
  );
}
