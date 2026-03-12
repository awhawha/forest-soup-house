import { PageHero } from "@/components/PageHero";
import { SoupCard } from "@/components/cards/SoupCard";
import { soupCards } from "@/data/soupCards";

export default function SoupCardsPage() {
  return (
    <div className="min-h-screen bg-paper text-wood">
      <PageHero
        title="Soup Cards"
        subtitle="Soups of the forest. Each one is a small, gentle piece of the story world."
      />
      <div className="mx-auto max-w-3xl px-4 pb-16 sm:px-6 sm:pb-20">
        <ul className="grid gap-6 sm:gap-8" aria-label="Soup cards">
          {soupCards.map((soup) => (
            <li key={soup.slug}>
              <SoupCard soup={soup} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}