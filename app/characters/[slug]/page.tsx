import { notFound } from "next/navigation";
import { CharacterProfile } from "@/components/CharacterProfile";
import { CTABanner } from "@/components/CTABanner";
import { characters } from "@/data/characters";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return characters.map((character) => ({
    slug: character.slug,
  }));
}

export default async function CharacterProfilePage({ params }: PageProps) {
  const { slug } = await params;

  const character = characters.find((entry) => entry.slug === slug);

  if (!character) {
    notFound();
  }

  return (
    <div className="bg-paper text-wood">
      <CharacterProfile character={character} />
      <div className="mx-auto max-w-2xl px-4 pb-10 sm:px-6 sm:pb-12">
        <CTABanner
          label="Back to forest friends · 回到森林朋友"
          href="/characters"
          secondary={{ label: "Explore more · 繼續走進森林", href: "/" }}
        />
      </div>
    </div>
  );
}

