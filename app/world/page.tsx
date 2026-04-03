import { PageHero } from "@/components/PageHero";
import { LocationCard } from "@/components/cards/LocationCard";
import { locations } from "@/data/locations";

export default function WorldPage() {
  return (
    <div className="min-h-screen bg-paper text-wood">
      <PageHero
        title="The Forest"
        titleZh="森林地圖"
        subtitle="Quiet places in the story world. The Soup House, the Whisper Shed, and more."
        subtitleZh="故事世界裡的安靜角落：湯湯屋、悄悄耳語小屋，還有更多。"
      />
      <div className="mx-auto max-w-3xl px-4 pb-16 sm:px-6 sm:pb-20">
        <ul className="grid gap-6 sm:gap-8" aria-label="Places in the forest">
          {locations.map((location) => (
            <li key={location.slug}>
              <LocationCard location={location} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
