import { notFound } from "next/navigation";
import { StoryFlowClient } from "@/components/app/StoryFlowClient";
import { getWeekBundle } from "@/lib/weekly";

export default async function StoryPage() {
  const week = await getWeekBundle();
  if (!week) notFound();
  return <StoryFlowClient week={week} />;
}
