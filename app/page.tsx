import { EntryPathCard } from "@/components/cards/EntryPathCard";
import { TodaysAdventureCard } from "@/components/TodaysAdventureCard";
import { SectionDivider } from "@/components/SectionDivider";
import { adventures } from "@/data/adventure";

const entryPaths = [
  {
    title: "Explore the forest",
    href: "/world",
    description: "Visit the Soup House, the Whisper Shed, and other quiet places.",
  },
  {
    title: "Meet the forest friends",
    href: "/characters",
    description: "Fina, Poffy, Lilo, and other gentle friends live here.",
  },
  {
    title: "Listen to a story",
    href: "/stories",
    description: "Sit down for a warm little story from the forest.",
  },
  {
    title: "Find a soup",
    href: "/soup-cards",
    description: "Some soups are for tasting. Some are for remembering.",
  },
];

export default function HomePage() {
  const start = new Date().getDate() % adventures.length;
  const todays = [
    ...adventures.slice(start),
    ...adventures.slice(0, start),
  ].slice(0, 3);

  return (
    <div className="bg-paper text-wood">
      <div className="mx-auto w-full max-w-6xl px-6 py-14 md:px-8 md:py-20">
        <div className="mx-auto w-full max-w-5xl">
          {/* 1. Today’s Little Adventures */}
          <section
            className="space-y-5"
            aria-label="Today's Little Adventures"
          >
            <div className="space-y-2">
              <h2 className="font-heading text-xl font-medium text-wood md:text-2xl">
                Today’s Little Adventures
              </h2>
              <p className="text-sm leading-7 text-wood-muted md:text-base">
                Small moments happening in the forest today.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              {todays.map((adventure) => (
                <TodaysAdventureCard
                  key={adventure.id}
                  adventure={adventure}
                />
              ))}
            </div>
          </section>

          {/* 2. World note */}
          <section
            className="mt-10 rounded-2xl border border-border-paper bg-paper-card px-4 py-4 sm:px-5 sm:py-5"
            aria-label="Where you are in the forest"
          >
            <p className="text-sm leading-relaxed text-wood">
              You are near the Soup House.
            </p>
            <p className="mt-1 text-sm leading-relaxed text-wood-muted">
              A quiet place in the forest where soup is a little bit magical.
            </p>
            <p className="mt-3 text-xs leading-relaxed text-wood-muted">
              Path: Soup House → Whisper Shed → story circle → the quiet places
              where friends gather.
            </p>
          </section>

          <div className="my-20 md:my-24">
            <SectionDivider />
          </div>
        </div>
      </div>

      {/* 3. Explore section band */}
      <section className="bg-paper-section py-14 md:py-16" aria-label="Explore the forest">
        <div className="mx-auto w-full max-w-5xl px-6 md:px-8">
          <div className="space-y-5">
            <div className="space-y-2">
              <h2 className="font-heading text-xl font-medium text-wood md:text-2xl">
                Explore the forest
              </h2>
              <p className="text-sm leading-7 text-wood-muted md:text-base">
                Follow a path into the forest.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {entryPaths.map((path) => (
                <EntryPathCard
                  key={path.href}
                  title={path.title}
                  href={path.href}
                  description={path.description}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}