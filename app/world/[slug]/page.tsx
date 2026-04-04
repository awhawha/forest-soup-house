import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { locations } from "@/data/locations";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return locations.map((location) => ({ slug: location.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const location = locations.find((l) => l.slug === slug);
  if (!location) {
    return { title: "Place not found" };
  }
  return {
    title: `${location.name} · ${location.nameEn}`,
    description: location.tagline,
  };
}

export default async function LocationPage({ params }: PageProps) {
  const { slug } = await params;
  const location = locations.find((l) => l.slug === slug);

  if (!location) {
    notFound();
  }

  const { name, nameEn, emoji, tagline, description, atmosphere, status } =
    location;

  return (
    <div className="min-h-screen bg-paper text-wood">
      <div className="mx-auto max-w-2xl px-page-px pb-sp-12 pt-hero-pt sm:px-page-px-sm sm:pb-sp-16 sm:pt-hero-pt-sm">
        {status === "coming-soon" ? (
          <div
            className="mb-sp-8 rounded-2xl border border-moss-soft/35 bg-moss-pale/45 px-sp-4 py-sp-4 text-center text-sm leading-relaxed text-wood sm:px-sp-6"
            role="status"
          >
            這個地方還在準備中，Fina 說再等等⋯ 🌿
          </div>
        ) : null}

        <article className="space-y-sp-6">
          <header className="space-y-sp-3 text-center sm:text-left">
            <p
              className="text-5xl leading-none sm:text-6xl"
              aria-hidden
            >
              {emoji}
            </p>
            <h1 className="font-heading text-2xl font-medium text-moss sm:text-3xl">
              {name}
            </h1>
            <p className="text-base text-wood-muted sm:text-lg">{nameEn}</p>
            <p className="text-base leading-relaxed text-wood sm:text-lg">
              {tagline}
            </p>
          </header>

          <div className="space-y-sp-4 border-t border-border-paper pt-sp-6">
            <h2 className="font-heading text-sm font-medium uppercase tracking-wide text-wood-muted">
              關於這裡
            </h2>
            <p className="leading-relaxed text-wood">{description}</p>
          </div>

          <div className="space-y-sp-4 border-t border-border-paper pt-sp-6">
            <h2 className="font-heading text-sm font-medium uppercase tracking-wide text-wood-muted">
              氛圍
            </h2>
            <p className="leading-relaxed text-wood">{atmosphere}</p>
          </div>

          <div className="border-t border-border-paper pt-sp-8">
            <Link
              href="/world"
              className="btn btn-primary btn-md inline-flex w-full justify-center sm:w-auto"
            >
              ← 回到森林
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
}
