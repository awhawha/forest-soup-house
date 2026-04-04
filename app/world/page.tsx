import { LocationCarousel } from "@/components/LocationCarousel";
import { locations } from "@/data/locations";

export default function WorldPage() {
  return (
    <div className="-mt-[var(--site-header-offset)] min-h-screen bg-world-page-bg pt-[var(--site-header-offset)] text-wood">
      <header className="mx-auto max-w-2xl px-page-px pt-hero-pt pb-sp-6 text-center sm:px-page-px-sm sm:pt-hero-pt-sm sm:pb-sp-8">
        <h1 className="font-heading text-2xl font-bold leading-tight text-world-heading sm:text-3xl md:text-4xl">
          選擇你的森林冒險路線
        </h1>
        <p className="mt-sp-3 text-base leading-relaxed text-world-muted sm:text-lg">
          跟著小路慢慢走，每個轉角都可能遇見湯的香氣、朋友的腳印，還有一小段只屬於你的故事。
        </p>
        <p className="mt-sp-2 text-sm text-world-muted/90 sm:text-base">
          Quiet paths and gentle surprises — tap a place to step inside.
        </p>
      </header>

      <LocationCarousel locations={locations} />
    </div>
  );
}
