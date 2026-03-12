interface PageHeroProps {
  title: string;
  subtitle?: string;
}

/**
 * Page-level title and optional subtitle for inner pages.
 * Editorial style: no card, no box. Used on World, Characters, Stories, Soup Cards, Missions, About.
 */
export function PageHero({ title, subtitle }: PageHeroProps) {
  return (
    <div className="mx-auto max-w-3xl px-4 pt-8 pb-6 sm:px-6 sm:pt-10 sm:pb-8">
      <h1 className="font-heading text-2xl font-medium text-wood sm:text-3xl">
        {title}
      </h1>
      {subtitle ? (
        <p className="mt-2 text-lg text-wood-muted leading-relaxed">{subtitle}</p>
      ) : null}
    </div>
  );
}
