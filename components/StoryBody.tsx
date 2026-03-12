import type { StorySection } from "@/data/stories";
import { SectionDivider } from "./SectionDivider";

interface StoryBodyProps {
  title: string;
  sections: StorySection[];
  heroImage?: string;
}

/**
 * Story episode content: title, optional hero image, sections with optional titles.
 * Editorial layout: single column, readable line length, section dividers between blocks.
 * No card wrapper—feels like a storybook spread.
 */
export function StoryBody({ title, sections, heroImage }: StoryBodyProps) {
  return (
    <article className="mx-auto max-w-[720px] px-4 py-6 sm:px-6 sm:py-8">
      <h1 className="font-heading text-2xl font-medium text-wood sm:text-3xl">
        {title}
      </h1>

      {heroImage ? (
        <div className="relative mt-6 aspect-[3/2] w-full overflow-hidden rounded-2xl bg-paper-card">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={heroImage}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
      ) : null}

      <div className="mt-8 space-y-8">
        {sections.map((section, index) => (
          <div key={index}>
            {index > 0 ? <SectionDivider /> : null}
            {section.title ? (
              <h2 className="font-heading mb-3 text-lg font-medium text-wood">
                {section.title}
              </h2>
            ) : null}
            <div className="text-lg leading-relaxed text-wood">
              {section.content.split(/\n\n+/).map((paragraph, i) => (
                <p key={i} className="mb-4 last:mb-0">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
