import { Button } from "@/components/Button";
import { NarrationBlock } from "./NarrationBlock";
import type { Character } from "@/data/characters";

interface CharacterProfileProps {
  character: Character;
}

/**
 * Full character page content: name, optional image, bio, quote, optional links.
 * Editorial layout: flowing prose, not a card. Gracefully omits optional fields.
 */
export function CharacterProfile({ character }: CharacterProfileProps) {
  const { name, tagline, bio, quote, quoteAttribution, image, links } = character;

  return (
    <article className="mx-auto max-w-2xl px-page-px py-page-py sm:px-page-px-sm sm:py-page-py-sm">
      {image ? (
        <div className="relative mb-sp-6 aspect-square max-w-[200px] overflow-hidden rounded-2xl bg-paper-card sm:max-w-[240px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt="" className="h-full w-full object-cover" />
        </div>
      ) : null}

      <h1 className="font-heading text-2xl font-medium text-wood sm:text-3xl">
        {name}
      </h1>
      <p className="mt-sp-1 text-wood-muted leading-relaxed">{tagline}</p>

      {bio ? (
        <div className="mt-sp-6 space-y-4 text-[#2C2825] leading-relaxed">
          {bio.split(/\n\n+/).map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      ) : null}

      {quote ? (
        <div className="mt-sp-6">
          <NarrationBlock text={quote} attribution={quoteAttribution} />
        </div>
      ) : null}

      {links && links.length > 0 ? (
        <ul className="mt-sp-8 flex flex-col gap-sp-3 sm:flex-row sm:flex-wrap">
          {links.map(({ label, href }) => (
            <li key={href}>
              <Button variant="ghost-moss" size="sm" href={href}>
                {label}
              </Button>
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}
