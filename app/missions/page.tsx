import { PageHero } from "@/components/PageHero";
import { MissionCard } from "@/components/cards/MissionCard";
import { missions } from "@/data/missions";

export default function MissionsPage() {
  return (
    <div className="min-h-screen bg-paper text-wood">
      <PageHero
        title="Little Adventures"
        subtitle="Gentle invitations to try with a grown-up, inspired by the forest."
      />
      <div className="mx-auto max-w-3xl px-4 pb-16 sm:px-6 sm:pb-20">
        <ul className="grid gap-6 sm:gap-8" aria-label="Little adventures">
          {missions.map((mission) => (
            <li key={mission.id}>
              <MissionCard mission={mission} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}