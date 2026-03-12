import type { Mission } from "@/data/missions";

interface MissionCardProps {
  mission: Mission;
}

/**
 * One mission on the Little Adventures page. Soft card; no link.
 * Optional source (e.g. "From the Whisper Shed") shown as secondary text.
 */
export function MissionCard({ mission }: MissionCardProps) {
  const { id, title, prompt, source } = mission;

  return (
    <div
      id={id}
      className="rounded-2xl border border-border-paper bg-paper-card/80 p-5 scroll-mt-4"
    >
      <h2 className="text-lg font-medium text-wood">{title}</h2>
      <p className="mt-2 text-wood leading-relaxed">{prompt}</p>
      {source ? (
        <p className="mt-3 text-sm text-wood-muted">{source}</p>
      ) : null}
    </div>
  );
}
