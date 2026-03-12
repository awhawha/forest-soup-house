import Link from "next/link";
import { notFound } from "next/navigation";
import { soupCards } from "@/data/soupCards";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return soupCards.map((soup) => ({
    slug: soup.slug,
  }));
}

export default async function SoupCardDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const soup = soupCards.find((entry) => entry.slug === slug);

  if (!soup) {
    notFound();
  }

  const { name, mood, description, ingredients } = soup;

  return (
    <div className="bg-paper text-wood">
      <article className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
        <header>
          <h1 className="font-heading text-2xl font-medium text-wood sm:text-3xl">
            {name}
          </h1>
          {mood ? (
            <p className="mt-1 text-wood-muted leading-relaxed">{mood}</p>
          ) : null}
        </header>

        {description ? (
          <div className="mt-6 space-y-4 text-wood leading-relaxed">
            <p>{description}</p>
          </div>
        ) : null}

        {ingredients && ingredients.length > 0 ? (
          <section className="mt-8" aria-label="Ingredients for this soup">
            <h2 className="font-heading text-lg font-medium text-wood">
              Ingredients (a little bit like a spell)
            </h2>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-wood leading-relaxed">
              {ingredients.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        ) : null}

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link
            href="/soup-cards"
            className="inline-flex min-h-[44px] items-center text-moss transition-colors hover:text-moss-dark focus:outline-none focus:ring-2 focus:ring-moss/40 focus:ring-offset-2 focus:ring-offset-paper"
          >
            Back to soup cards
          </Link>
          <Link
            href="/missions"
            className="inline-flex min-h-[44px] items-center text-moss transition-colors hover:text-moss-dark focus:outline-none focus:ring-2 focus:ring-moss/40 focus:ring-offset-2 focus:ring-offset-paper"
          >
            Visit the little adventures
          </Link>
        </div>
      </article>
    </div>
  );
}