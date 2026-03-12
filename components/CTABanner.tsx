import Link from "next/link";

interface CTABannerProps {
  label: string;
  href: string;
  secondary?: { label: string; href: string };
}

/**
 * Single clear next step at end of story, character profile, etc.
 * Primary CTA as button-style link; optional secondary as text link.
 */
export function CTABanner({ label, href, secondary }: CTABannerProps) {
  return (
    <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-6">
      <Link
        href={href}
        className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-moss px-6 py-3 text-base font-medium text-white transition-colors hover:bg-moss-dark focus:outline-none focus:ring-2 focus:ring-moss/50 focus:ring-offset-2 focus:ring-offset-paper"
      >
        {label}
      </Link>
      {secondary ? (
        <Link
          href={secondary.href}
          className="inline-flex min-h-[44px] items-center text-wood-muted transition-colors hover:text-wood focus:outline-none focus:ring-2 focus:ring-moss/40 focus:ring-offset-2 focus:ring-offset-paper"
        >
          {secondary.label}
        </Link>
      ) : null}
    </div>
  );
}
