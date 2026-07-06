import { PhoneFrame } from "@/components/app/PhoneFrame";
import { CabinetDrawer } from "@/components/app/CabinetDrawer";
import {
  getAllWeekIngredients,
  getCurrentWeekNumber,
  getWeekCards,
} from "@/lib/weekly";

export const dynamic = "force-dynamic";

export default async function SoupExperienceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [weekCards, dex, currentWeek] = await Promise.all([
    getWeekCards(),
    getAllWeekIngredients(),
    getCurrentWeekNumber(),
  ]);

  return (
    <PhoneFrame>
      {children}
      <CabinetDrawer weekCards={weekCards} dex={dex} currentWeek={currentWeek} />
    </PhoneFrame>
  );
}
