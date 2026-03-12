interface NarrationBlockProps {
  text: string;
  attribution?: string;
}

/**
 * Quote or in-world voice (story, character profile).
 * Editorial pull-quote style; not a card. Handles optional attribution.
 */
export function NarrationBlock({ text, attribution }: NarrationBlockProps) {
  return (
    <blockquote className="my-6 border-l-2 border-accent-pull pl-5 pr-2">
      <p className="text-lg italic text-wood leading-relaxed">{text}</p>
      {attribution ? (
        <cite className="mt-2 block text-sm not-italic text-wood-muted">
          {attribution}
        </cite>
      ) : null}
    </blockquote>
  );
}
