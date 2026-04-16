import { Button } from "@/components/Button";
import { NarrationBlock } from "./NarrationBlock";
import type { Character } from "@/data/characters";

interface CharacterProfileProps {
  character: Character;
}

export function CharacterProfile({ character }: CharacterProfileProps) {
  const { name, nameZh, tagline, taglineZh, bio, bioZh, quote, quoteZh, quoteAttribution, image, links } = character;

  return (
    <article className="mx-auto max-w-2xl px-page-px py-page-py sm:px-page-px-sm sm:py-page-py-sm">
      
      {/* Name */}
      <h1 className="font-heading text-2xl font-medium text-wood sm:text-3xl">
        {name}
        {nameZh && (
          <span className="ml-3 text-xl font-normal text-wood-muted">{nameZh}</span>
        )}
      </h1>

      {/* Tagline */}
      <p className="mt-sp-1 leading-relaxed text-wood-muted">{tagline}</p>
      {taglineZh && (
        <p className="mt-0.5 text-sm leading-relaxed text-wood-soft">{taglineZh}</p>
      )}

      {/* Bio */}
      {(bio || bioZh) && (
        <div className="mt-sp-6 space-y-4 leading-relaxed text-wood">
          {bio?.split(/\n\n+/).map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
          {bioZh && (
            <p className="text-sm leading-relaxed text-wood-muted">{bioZh}</p>
          )}
        </div>
      )}

      {/* Quote */}
      {quote && (
        <div className="mt-sp-6 space-y-2">
          <NarrationBlock text={quote} attribution={quoteAttribution} />
          {quoteZh && (
            <p className="pl-4 text-sm italic leading-relaxed text-wood-muted border-l-2 border-border-paper">
              {quoteZh}
            </p>
          )}
        </div>
      )}

      {/* Links */}
      {links && links.length > 0 && (
        <ul className="mt-sp-8 flex flex-col gap-sp-3 sm:flex-row sm:flex-wrap">
          {links.map(({ label, href }) => (
            <li key={href}>
              <Button variant="ghost-moss" size="sm" href={href}>
                {label}
              </Button>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
