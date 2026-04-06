import { PageHero } from "@/components/PageHero";
import { AdventureCard } from "@/components/cards/AdventureCard";
import { adventures } from "@/data/adventures";

export default function AdventuresPage() {
  return (
    <div className="min-h-screen bg-paper text-wood">
      <PageHero
        title="Little Adventures"
        titleZh="森林小冒險"
        subtitle="Gentle invitations to try with a grown-up, inspired by the forest."
        subtitleZh="與大人一起試試的、來自森林的溫柔邀請。"
      />
      <div className="mx-auto max-w-3xl px-4 pb-16 sm:px-6 sm:pb-20">
        <ul className="grid gap-6 sm:gap-8" aria-label="Little adventures">
          {adventures.map((adventure) => (
            <li key={adventure.slug}>
              <AdventureCard adventure={adventure} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
