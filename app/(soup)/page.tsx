import { notFound } from "next/navigation";
import { HomeClient } from "@/components/app/HomeClient";
import { getWeekBundle } from "@/lib/weekly";

export default async function HomePage() {
  const week = await getWeekBundle();
  if (!week) notFound();
  return <HomeClient week={week} />;
}
