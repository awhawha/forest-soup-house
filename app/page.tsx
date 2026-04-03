import { EntryPathCard } from "@/components/cards/EntryPathCard";
import { TodaysAdventureCard } from "@/components/TodaysAdventureCard";
import { SectionDivider } from "@/components/SectionDivider";
import { adventures } from "@/data/adventure";

const entryPaths = [
  {
    title: "Explore the forest · 走進森林",
    href: "/world",
    description:
      "Visit the Soup House, the Whisper Shed, and other quiet places.",
    descriptionZh:
      "去看看湯湯屋、悄悄耳語小屋，還有森林裡其他安靜的小地方。",
  },
  {
    title: "Meet the forest friends · 認識森林朋友",
    href: "/characters",
    description: "Fina, Poffy, Lilo, and other gentle friends live here.",
    descriptionZh: "菲娜、波飛、里洛，還有其他溫柔的森林朋友都住在這裡。",
  },
  {
    title: "Listen to a story · 聽一個小故事",
    href: "/stories",
    description: "Sit down for a warm little story from the forest.",
    descriptionZh: "坐下來，聽一個來自森林裡的溫暖小故事。",
  },
  {
    title: "Find a soup · 找一碗湯",
    href: "/soup-cards",
    description: "Some soups are for tasting. Some are for remembering.",
    descriptionZh: "有些湯是用來品嚐的，有些湯是用來記住一個時刻的。",
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
                <span className="block">Today’s Little Adventures</span>
                <span className="mt-1 block text-lg font-normal text-wood-muted md:text-xl">
                  今日森林小冒險
                </span>
              </h2>
              <p className="text-sm leading-7 text-wood-muted md:text-base">
                Small moments happening in the forest today.
              </p>
              <p className="text-sm leading-7 text-wood-muted/90 md:text-base">
                今天，森林裡有幾個小小的故事正在發生。
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
        </div>
      </div>

      {/* 3. Explore section band */}
      <section className="bg-paper-section py-14 md:py-16" aria-label="Explore the forest">
        <div className="mx-auto w-full max-w-5xl px-6 md:px-8">
          <div className="space-y-5">
            <div className="space-y-2">
              <h2 className="font-heading text-xl font-medium text-wood md:text-2xl">
                <span className="block">Explore the Forest</span>
                <span className="mt-1 block text-lg font-normal text-wood-muted md:text-xl">
                  走進森林
                </span>
              </h2>
              <p className="text-sm leading-7 text-wood-muted md:text-base">
                Follow a path into the forest.
              </p>
              <p className="text-sm leading-7 text-wood-muted/90 md:text-base">
                跟著一條小路，慢慢走進森林裡。
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {entryPaths.map((path) => (
                <EntryPathCard
                  key={path.href}
                  title={path.title}
                  href={path.href}
                  description={path.description}
                  descriptionZh={path.descriptionZh}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
