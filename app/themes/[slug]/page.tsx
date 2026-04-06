import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ThemePageClient } from "@/components/themes/ThemePageClient";
import { getThemeBySlug, themes } from "@/data/themes";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return themes.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const theme = getThemeBySlug(slug);
  if (!theme) {
    return { title: "主題" };
  }
  return {
    title: `${theme.title} · 主題包`,
    description: theme.tagline,
  };
}

export default async function ThemeDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const theme = getThemeBySlug(slug);
  if (!theme) {
    notFound();
  }

  return <ThemePageClient theme={theme} />;
}
