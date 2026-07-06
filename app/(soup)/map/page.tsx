import { notFound } from "next/navigation";
import { ForestMapClient } from "@/components/app/ForestMapClient";
import { getMapPins, getWeekBundle } from "@/lib/weekly";

export default async function ForestMapPage() {
  const [week, pins] = await Promise.all([getWeekBundle(), getMapPins()]);
  if (!week) notFound();
  return <ForestMapClient week={week} pins={pins} />;
}
