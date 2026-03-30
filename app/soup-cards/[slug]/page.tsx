import { notFound } from "next/navigation";
import { Button } from "@/components/Button";
import { soupCards } from "@/data/soupCards";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return soupCards.map((soup) => ({ slug: soup.slug }));
}

export default async function SoupCardDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const soup = soupCards.find((entry) => entry.slug === slug);
  if (!soup) notFound();

  const { name, mood, description, ingredients } = soup;

  return (
    <div className="bg-paper text-wood">
      <article className="mx-auto max-w-3xl px-page-px py-page-py sm:px-page-px-sm sm:py-page-py-sm">
        <header>
          <h1 className="font-heading text-2xl font-medium text-wood sm:text-3xl">
            {name}
          </h1>
          {mood ? (
            <p className="mt-sp-1 text-wood-muted leading-relaxed">{mood}</p>
          ) : null}
        </header>

        {description ? (
          <div className="mt-sp-6 space-y-4 text-wood leading-relaxed">
            <p>{description}</p>
          </div>
        ) : null}

        {ingredients && ingredients.length > 0 ? (
          <section className="mt-sp-8" aria-label="Ingredients for this soup">
            <h2 className="font-heading text-lg font-medium text-wood">
              Ingredients (a little bit like a spell)
            </h2>
            <ul className="mt-sp-3 list-disc space-y-1 pl-5 text-wood leading-relaxed">
              {ingredients.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        ) : null}

        <div className="mt-banner-mt flex flex-col gap-sp-3 sm:flex-row sm:flex-wrap">
          <Button variant="ghost-moss" href="/soup-cards">
            Back to soup cards
          </Button>
          <Button variant="ghost-moss" href="/missions">
            Visit the little adventures
          </Button>
        </div>
      </article>
    </div>
  );
}
