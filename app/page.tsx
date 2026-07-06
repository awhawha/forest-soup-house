/**
 * 湯湯屋 v2 — native app（四分頁 + 覆蓋層）。
 * server 取本週資料，client 端 AppRoot 決定 Onboarding 或進 app。
 */
import { notFound } from "next/navigation";
import { PhoneFrame } from "@/components/app/PhoneFrame";
import { AppRoot } from "@/components/app/AppRoot";
import {
  getForestPlaces,
  getResidents,
  getWeekBundle,
  getWeekCards,
} from "@/lib/weekly";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [week, weekCards, residents, places] = await Promise.all([
    getWeekBundle(),
    getWeekCards(),
    getResidents(),
    getForestPlaces(),
  ]);
  if (!week) notFound();

  return (
    <PhoneFrame>
      <AppRoot week={week} weekCards={weekCards} residents={residents} places={places} />
    </PhoneFrame>
  );
}
