/**
 * Visual breathing room between sections (e.g. story body).
 * Minimal: a soft rule. No heavy decoration so the layout stays calm and editorial.
 */
export function SectionDivider() {
  return (
    <div
      className="mx-auto my-8 h-px max-w-xl bg-border-paper"
      aria-hidden
    />
  );
}
