import Link from "next/link";
import type { Character } from "@/data/characters";
import { NarrationBlock } from "./NarrationBlock";

interface CharacterProfileProps {
  character: Character;
}

/**
 * Full character page content: name, optional image, optional bio, optional quote, optional links.
 * Editorial layout: flowing prose, not a card. Gracefully omits optional fields.
 */
export function CharacterProfile({ character }: CharacterProfileProps) {
  const { name, tagline, bio, quote, quoteAttribution, image, links } =
    character;

  return (
    <article className="mx-auto max-w-2xl px-4 py-6 sm:px-6 sm:py-8">
      {image ? (
        <div className="relative mb-6 aspect-square max-w-[200px] overflow-hidden rounded-2xl bg-paper-card sm:max-w-[240px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
      ) : null}

      <h1 className="font-heading text-2xl font-medium text-wood sm:text-3xl">
        {name}
      </h1>
      <p className="mt-1 text-wood-muted leading-relaxed">
        {tagline}
      </p>

      {bio ? (
        <div className="mt-6 space-y-4 text-[#2C2825] leading-relaxed">
          {bio.split(/\n\n+/).map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      ) : null}

      {quote ? (
        <div className="mt-6">
          <NarrationBlock
            text={quote}
            attribution={quoteAttribution}
          />
        </div>
      ) : null}

      {links && links.length > 0 ? (
        <ul className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          {links.map(({ label, href }) => (
            <li key={href}>
              <Link
                href={href}
                className="inline-flex min-h-[44px] items-center text-moss transition-colors hover:text-moss-dark focus:outline-none focus:ring-2 focus:ring-moss/40 focus:ring-offset-2 focus:ring-offset-paper"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}
