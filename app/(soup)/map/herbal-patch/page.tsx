import { notFound } from "next/navigation";
import { HerbalGardenClient } from "@/components/app/HerbalGardenClient";
import { getWeekBundle } from "@/lib/weekly";

export default async function HerbalPatchPage() {
  const week = await getWeekBundle();
  if (!week) notFound();
  return <HerbalGardenClient ingredients={week.ingredients} />;
}
