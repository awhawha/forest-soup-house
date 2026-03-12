import Link from "next/link";
import { notFound } from "next/navigation";
import { StoryBody } from "@/components/StoryBody";
import { CTABanner } from "@/components/CTABanner";
import { NarrationBlock } from "@/components/NarrationBlock";
import { stories } from "@/data/stories";
import { soupCards } from "@/data/soupCards";
import { missions } from "@/data/missions";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return stories.map((story) => ({
    slug: story.slug,
  }));
}

export default async function StoryEpisodePage({ params }: PageProps) {
  const { slug } = await params;

  const story = stories.find((entry) => entry.slug === slug);

  if (!story) {
    notFound();
  }

  const relatedSoup = story.relatedSoupCardSlug
    ? soupCards.find((s) => s.slug === story.relatedSoupCardSlug)
    : undefined;
  const relatedMission = story.relatedMissionId
    ? missions.find((m) => m.id === story.relatedMissionId)
    : undefined;
  const hasDiscoveries = relatedSoup ?? relatedMission;

  return (
    <div className="bg-paper text-wood">
      <div className="mx-auto max-w-[720px] px-4 pt-6 sm:px-6 sm:pt-8">
        <NarrationBlock text="Tonight, the Soup House would like to tell a little story." />
      </div>

      <StoryBody title={story.title} sections={story.sections} heroImage={story.image} />

      <div className="mx-auto max-w-[720px] px-4 pb-12 sm:px-6 sm:pb-14">
        <p className="text-base text-wood-muted">The end.</p>

        {hasDiscoveries ? (
          <>
            <div className="mx-auto my-4 h-px max-w-xl bg-border-paper" aria-hidden />
            <section className="mt-4" aria-label="Where this story leads">
              <p className="text-sm font-medium text-wood-muted">
                Where this story leads
              </p>

              {relatedSoup ? (
                <div className="mt-4 rounded-xl border border-border-paper bg-paper-card/60 px-4 py-3.5">
                  <p className="font-medium text-wood">{relatedSoup.name}</p>
                  <p className="text-xs text-wood-muted mt-0.5">{relatedSoup.mood}</p>
                  <p className="mt-2 text-sm italic text-wood-muted leading-relaxed">
                    This soup carries a little of the story with it.
                  </p>
                  <p className="mt-1.5 text-sm text-wood leading-relaxed line-clamp-2">
                    {relatedSoup.description}
                  </p>
                  <p className="mt-2">
                    <Link
                      href={`/soup-cards/${relatedSoup.slug}`}
                      className="inline-flex min-h-[44px] items-center text-sm text-moss transition-colors hover:text-moss-dark focus:outline-none focus:ring-2 focus:ring-moss/40 focus:ring-offset-2 focus:ring-offset-paper"
                    >
                      View soup card
                    </Link>
                  </p>
                </div>
              ) : null}

              {relatedMission ? (
                <div className={`mt-4 rounded-xl border border-border-paper bg-paper-card/60 px-4 py-3.5`}>
                  <p className="font-medium text-wood">{relatedMission.title}</p>
                  <p className="mt-1 text-sm text-wood-muted leading-relaxed line-clamp-2">
                    {relatedMission.prompt}
                  </p>
                  <p className="mt-2">
                    <Link
                      href={`/missions#${relatedMission.id}`}
                      className="inline-flex min-h-[44px] items-center text-sm text-moss transition-colors hover:text-moss-dark focus:outline-none focus:ring-2 focus:ring-moss/40 focus:ring-offset-2 focus:ring-offset-paper"
                    >
                      Try a little adventure
                    </Link>
                  </p>
                </div>
              ) : null}
            </section>

            <CTABanner
              label="Back to Story Time"
              href="/stories"
              secondary={{ label: "Explore the forest", href: "/" }}
            />
          </>
        ) : (
          <CTABanner
            label="Back to stories"
            href="/stories"
            secondary={{ label: "Explore the forest", href: "/" }}
          />
        )}
      </div>
    </div>
  );
}

