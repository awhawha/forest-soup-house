import type { Mission } from "@/data/missions";

interface MissionCardProps {
  mission: Mission;
}

/**
 * One mission on the Little Adventures page. Soft card; no link.
 * Optional source (e.g. "From the Whisper Shed") shown as secondary text.
 *
 * Spacing tokens:
 *   p-card-padding  → --card-padding (24px) card inner padding
 *   mt-sp-2         → --sp-2         (8px)  prompt top margin
 *   mt-sp-3         → --sp-3         (12px) source top margin
 *   scroll-mt-sp-4  → --sp-4         (16px) scroll offset for #anchor nav
 */
export function MissionCard({ mission }: MissionCardProps) {
  const { id, title, prompt, source } = mission;

  return (
    <div
      id={id}
      className="rounded-2xl border border-border-paper bg-paper-card/80 p-card-padding scroll-mt-sp-4"
    >
      <h2 className="text-lg font-medium text-wood">{title}</h2>
      <p className="mt-sp-2 text-wood leading-relaxed">{prompt}</p>
      {source ? (
        <p className="mt-sp-3 text-sm text-wood-muted">{source}</p>
      ) : null}
    </div>
  );
}
