import { PageHero } from "@/components/PageHero";
import { StoryCard } from "@/components/cards/StoryCard";
import { stories } from "@/data/stories";

export default function StoriesPage() {
  return (
    <div className="min-h-screen bg-paper text-wood">
      <PageHero
        title="Story Time"
        titleZh="故事時間"
        subtitle="Stories from the forest Soup House, meant to be read aloud together. Some open a full theme pack—not only the story."
        subtitleZh="來自森林湯湯屋的故事，適合一起朗讀。標有「完整主題包」的卡片會帶你到整段旅程：故事、採集、煮湯、延伸閱讀。"
      />
      <div className="mx-auto max-w-3xl px-4 pb-16 sm:px-6 sm:pb-20">
        <ul className="grid gap-6 sm:gap-8" aria-label="Stories from the forest">
          {stories.map((story) => (
            <li key={story.slug}>
              <StoryCard story={story} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

