import { EntryPathCard } from "@/components/cards/EntryPathCard";
import { NarrationBlock } from "@/components/NarrationBlock";
import { SectionDivider } from "@/components/SectionDivider";

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
  return (
    <div className="bg-paper text-wood">
      <main className="mx-auto flex w-full max-w-5xl flex-1 px-6 py-14 md:px-8 md:py-20">
        <div className="w-full max-w-3xl">
          <section className="space-y-8 md:space-y-9">
            <div className="space-y-4">
              <p className="text-xs tracking-[0.18em] text-wood-muted uppercase md:text-sm">
                Forest Gate
              </p>

              <div className="space-y-4">
                <h1 className="font-heading max-w-2xl text-4xl font-semibold tracking-tight text-wood md:text-5xl">
                  Forest Soup House
                </h1>

                <p className="max-w-xl text-lg leading-8 text-wood-muted md:text-xl">
                  A quiet place in the forest where soup is a little bit magical.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-accent-pull">
              <div className="h-px w-10 bg-border-paper" />
              <span className="text-sm italic tracking-wide">
                warm light, soft steam
              </span>
            </div>

            <div className="max-w-2xl">
              <NarrationBlock text="Fina is waiting by the Soup House. She has something warm to share." />
            </div>

            <p className="max-w-2xl text-base leading-8 text-wood-muted md:text-lg">
              Step inside. There are warm stories, gentle friends, and a little
              soup magic waiting for you.
            </p>
          </section>

          <div className="my-10 md:my-14">
            <SectionDivider />
          </div>

          <section className="space-y-5">
            <div className="space-y-2">
              <h2 className="font-heading text-xl font-medium text-wood md:text-2xl">
                Where would you like to begin?
              </h2>
              <p className="text-sm leading-7 text-wood-muted md:text-base">
                Follow a path into the forest.
              </p>
            </div>

            <div className="space-y-4">
              {entryPaths.map((path) => (
                <EntryPathCard
                  key={path.href}
                  title={path.title}
                  href={path.href}
                  description={path.description}
                />
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}