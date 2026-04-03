import { notFound } from "next/navigation";
import { StoryBody } from "@/components/StoryBody";
import { CTABanner } from "@/components/CTABanner";
import { NarrationBlock } from "@/components/NarrationBlock";
import { Button } from "@/components/Button";
import { stories } from "@/data/stories";
import { soupCards } from "@/data/soupCards";
import { missions } from "@/data/missions";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return stories.map((story) => ({ slug: story.slug }));
}

export default async function StoryEpisodePage({ params }: PageProps) {
  const { slug } = await params;
  const story = stories.find((entry) => entry.slug === slug);
  if (!story) notFound();

  const relatedSoup = story.relatedSoupCardSlug
    ? soupCards.find((s) => s.slug === story.relatedSoupCardSlug)
    : undefined;
  const relatedMission = story.relatedMissionId
    ? missions.find((m) => m.id === story.relatedMissionId)
    : undefined;
  const hasDiscoveries = relatedSoup ?? relatedMission;

  return (
    <div className="bg-paper text-wood">
      <div className="mx-auto max-w-[720px] px-page-px pt-sp-6 sm:px-page-px-sm sm:pt-sp-8">
        <NarrationBlock text="Tonight, the Soup House would like to tell a little story." />
      </div>

      <StoryBody title={story.title} sections={story.sections} heroImage={story.image} />

      <div className="mx-auto max-w-[720px] px-page-px pb-sp-12 sm:px-page-px-sm sm:pb-sp-12">
        <p className="text-base text-wood-muted">
          The end. <span className="text-wood-muted/80">結局。</span>
        </p>

        {hasDiscoveries ? (
          <>
            <div className="mx-auto my-sp-4 h-px max-w-xl bg-border-paper" aria-hidden />
            <section className="mt-sp-4" aria-label="Where this story leads">
              <p className="text-sm font-medium text-wood-muted">
                Where this story leads · 故事往哪裡延伸
              </p>

              {relatedSoup ? (
                <div className="mt-sp-4 rounded-xl border border-border-paper bg-paper-card/60 px-page-px py-sp-3">
                  <p className="font-medium text-wood">{relatedSoup.name}</p>
                  <p className="text-xs text-wood-muted mt-sp-1">{relatedSoup.mood}</p>
                  <p className="mt-sp-2 text-sm italic text-wood-muted leading-relaxed">
                    This soup carries a little of the story with it.
                  </p>
                  <p className="mt-sp-1 text-sm text-wood leading-relaxed line-clamp-2">
                    {relatedSoup.description}
                  </p>
                  <div className="mt-sp-2">
                    <Button
                      variant="ghost-moss"
                      size="sm"
                      href={`/soup-cards/${relatedSoup.slug}`}
                    >
                      View soup card · 看看湯譜卡
                    </Button>
                  </div>
                </div>
              ) : null}

              {relatedMission ? (
                <div className="mt-sp-4 rounded-xl border border-border-paper bg-paper-card/60 px-page-px py-sp-3">
                  <p className="font-medium text-wood">{relatedMission.title}</p>
                  <p className="mt-sp-1 text-sm text-wood-muted leading-relaxed line-clamp-2">
                    {relatedMission.prompt}
                  </p>
                  <div className="mt-sp-2">
                    <Button
                      variant="ghost-moss"
                      size="sm"
                      href={`/missions#${relatedMission.id}`}
                    >
                      Explore adventures · 看更多小冒險
                    </Button>
                  </div>
                </div>
              ) : null}
            </section>

            <CTABanner
              label="Back to Story Time · 回到故事時間"
              href="/stories"
              secondary={{ label: "Explore more · 繼續走進森林", href: "/" }}
            />
          </>
        ) : (
          <CTABanner
            label="Back to stories · 回到故事時間"
            href="/stories"
            secondary={{ label: "Explore more · 繼續走進森林", href: "/" }}
          />
        )}
      </div>
    </div>
  );
}
