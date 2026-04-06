import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdventureDetailClient } from "@/components/adventures/AdventureDetailClient";
import { adventures, getAdventureBySlug } from "@/data/adventures";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return adventures.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const adventure = getAdventureBySlug(slug);
  if (!adventure) {
    return { title: "Adventure not found" };
  }
  return {
    title: `${adventure.title} · ${adventure.titleEn}`,
    description: adventure.description,
  };
}

export default async function AdventureDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const adventure = getAdventureBySlug(slug);

  if (!adventure) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-paper text-wood">
      <AdventureDetailClient adventure={adventure} />
    </div>
  );
}
