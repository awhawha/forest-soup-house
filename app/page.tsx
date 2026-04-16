import Link from "next/link";
import { EntryPathCard } from "@/components/cards/EntryPathCard";
import { TodaysAdventureCard } from "@/components/TodaysAdventureCard";
import { Button } from "@/components/Button";
import { getThemeBySlug } from "@/data/themes";
import { todaysAdventures } from "@/data/todaysAdventures";

const todaysThemeSlug = "memory-soup" as const;

const entryPaths = [
  {
    title: "Explore the map · 探索森林",
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
  const start = new Date().getDate() % todaysAdventures.length;
  const todays = [
    ...todaysAdventures.slice(start),
    ...todaysAdventures.slice(0, start),
  ].slice(0, 3);

  const todaysTheme = getThemeBySlug(todaysThemeSlug);

  return (
    <div className="bg-paper text-wood">
      <section
        aria-label="Welcome"
        className="relative isolate w-full min-h-[calc(100svh-var(--site-header-offset))]"
      >
        <div className="absolute inset-0 z-0 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/places/forest-entrance.png"
            alt=""
            className="h-full min-h-[calc(100svh-var(--site-header-offset))] w-full object-cover object-center opacity-90"
          />
        </div>
        <div
          className="pointer-events-none absolute inset-0 z-[1] hero-overlay-warm"
          aria-hidden
        />
        <div className="relative z-10 flex min-h-[calc(100svh-var(--site-header-offset))] flex-col items-center justify-center px-6 py-16 text-center">
          <h1 className="font-heading opacity-0 text-4xl font-medium leading-tight text-ink-on-green drop-shadow-md sm:text-5xl md:text-6xl lg:text-7xl animate-fade-in-up">
            日常就是魔法
          </h1>
          <p
            className="mt-sp-4 max-w-2xl opacity-0 text-lg leading-relaxed text-ink-on-green/90 drop-shadow-sm sm:text-xl md:text-2xl animate-fade-in-up"
            style={{ animationDelay: "0.15s" }}
          >
            Everyday life is magic
          </p>
          <p
            className="mt-sp-4 max-w-md opacity-0 text-sm leading-relaxed text-ink-on-green/85 sm:text-base animate-fade-in-up"
            style={{ animationDelay: "0.28s" }}
          >
            推開木門，感官、故事和遊戲在這裡交織成奇妙冒險
          </p>
          <div className="mt-sp-8 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.42s" }}>
            {/* <Button
              variant="primary"
              href="#explore"
              className="font-heading shadow-[var(--shadow-warm)]"
            >
              Explore the forest · 走進森林
            </Button> */}
          </div>
        </div>
      </section>


              
      <section className="py-14 md:py-20" aria-label="Today's choice">
  <div className="mx-auto w-full max-w-5xl px-6 md:px-8">

    {/* Header */}
    <div className="mb-10 space-y-1 text-center">
      <p className="text-[10px] uppercase tracking-[0.1em] text-wood-muted">
        Today in the forest · 今日森林時刻
      </p>
      <h2 className="font-heading text-xl font-medium text-wood md:text-2xl">
        What would you like to do today?
        <span className="mt-1 block text-base font-normal text-wood-muted">
          今天想怎麼玩？
        </span>
      </h2>
    </div>

    {/* Two-column choice */}
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

      {/* Left: Adventures */}
      <div className="flex flex-col gap-sp-4 overflow-hidden rounded-2xl border border-border-card bg-paper-card p-sp-6 shadow-[var(--shadow-paper)]">
        <p className="text-[10px] uppercase tracking-[0.08em] text-wood-muted">
          Forest adventure · 森林冒險
        </p>
        <div>
          <h3 className="font-heading text-lg font-medium text-wood">
            Today's Little Adventures
          </h3>
          <p className="text-sm text-wood-muted">今日森林小冒險</p>
        </div>
        <p className="text-sm leading-relaxed text-wood">
          Pick an adventure, step outside, and brew something magic from everyday things.
        </p>
        <p className="text-xs leading-relaxed text-wood-muted">
          挑一個小冒險，踏出門，把日常變成魔法。
        </p>

        {/* Mini adventure list */}
        <div className="flex flex-col gap-2">
          {todays.map((adventure) => (
            <Link
              key={adventure.id}
              href={`/adventures/${adventure.slug}`}
              className="flex items-start gap-3 rounded-xl bg-moss-pale px-3 py-2.5 text-sm transition-colors hover:bg-moss-pale/80"
            >
              <span className="mt-0.5 size-1.5 shrink-0 rounded-full bg-moss" />
              <span className="leading-snug text-wood">{adventure.title}</span>
            </Link>
          ))}
        </div>

        <div className="mt-auto pt-2">
          <Link
            href="/adventures"
            className="btn btn-outline btn-md w-full justify-center text-sm"
          >
            所有小冒險 →
          </Link>
        </div>
      </div>

      {/* Right: Story */}
      {todaysTheme ? (
        <div className="flex flex-col gap-sp-4 overflow-hidden rounded-2xl border-2 border-moss/40 bg-paper-card p-sp-6 shadow-[var(--shadow-paper)]">
          <p className="text-[10px] uppercase tracking-[0.08em] text-wood-muted">
            Today's story · 今日故事
          </p>
          <div>
            <h3 className="font-heading text-lg font-medium text-wood">
              Today's Story
            </h3>
            <p className="text-sm text-wood-muted">今日主題故事</p>
          </div>
          <p className="text-sm leading-relaxed text-wood">
            Settle in together. Let Fina take you into today's forest world.
          </p>
          <p className="text-xs leading-relaxed text-wood-muted">
            坐下來，跟著菲娜進入今天的故事。
          </p>

          {/* Today's theme */}
          <div className="rounded-xl border border-border-card bg-moss-pale/50 px-4 py-3">
            <p className="text-[10px] uppercase tracking-[0.08em] text-wood-muted">
              Theme of the day · 今日主題
            </p>
            <p className="mt-1 font-heading text-base font-medium text-wood">
              {todaysTheme.title}
            </p>
          </div>

          <div className="mt-auto pt-2">
            <Link
              href={`/themes/${todaysThemeSlug}`}
              className="inline-flex min-h-[2.75rem] w-full items-center justify-center rounded-2xl border-2 border-moss/40 bg-moss px-6 font-heading text-sm font-semibold text-paper shadow-[0_8px_28px_-6px_rgba(45,90,65,0.45)] transition-[transform,box-shadow] hover:border-moss-hover hover:bg-moss-hover sm:text-base"
            >
              開始今天的旅程 →
            </Link>
          </div>
        </div>
      ) : null}

    </div>
  </div>
</section>

      {/* 3. Explore section band */}
      <section id="explore" className="bg-paper-section py-12 md:py-14" aria-label="Explore the forest">
        <div className="mx-auto w-full max-w-5xl px-6 md:px-8">
          <div className="space-y-5">
            <div className="space-y-2">
              <h2 className="font-heading text-xl font-medium text-wood md:text-2xl">
                <span className="block">Explore the Forest</span>
                {/* <span className="mt-1 block text-lg font-normal text-wood-muted md:text-xl">
                  走進森林
                </span> */}
              </h2>
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
