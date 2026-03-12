import { PageHero } from "@/components/PageHero";
import { CharacterCard } from "@/components/cards/CharacterCard";
import { characters } from "@/data/characters";

export default function CharactersPage() {
  return (
    <div className="min-h-screen bg-paper text-wood">
      <PageHero
        title="Forest Friends"
        subtitle="The gentle characters who live in the forest and share soup and stories."
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
