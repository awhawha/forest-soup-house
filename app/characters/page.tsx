import { PageHero } from "@/components/PageHero";
import { CharacterCard } from "@/components/cards/CharacterCard";
import { characters } from "@/data/characters";

export default function CharactersPage() {
  return (
    <div className="min-h-screen bg-paper text-wood">
      <PageHero
        title="Forest Friends"
        titleZh="森林朋友"
        subtitle="The gentle characters who live in the forest and share soup and stories."
        subtitleZh="住在森林裡、與你分享湯與故事的溫柔角色們。"
      />
      <div className="mx-auto max-w-3xl px-4 pb-16 sm:px-6 sm:pb-20">
        <ul className="grid gap-6 sm:gap-8" aria-label="Forest friends">
          {characters.map((character) => (
            <li key={character.slug}>
              <CharacterCard character={character} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
