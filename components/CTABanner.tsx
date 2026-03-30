import { Button } from "@/components/Button";

interface CTABannerProps {
  label: string;
  href: string;
  secondary?: { label: string; href: string };
}

/**
 * Single clear next step at end of story, character profile, etc.
 * Primary CTA as filled button-link; optional secondary as ghost link.
 */
export function CTABanner({ label, href, secondary }: CTABannerProps) {
  return (
    <div className="mt-banner-mt flex flex-col items-center gap-gap-inline sm:flex-row sm:justify-center sm:gap-gap-inline-sm">
      <Button variant="primary" size="md" href={href}>
        {label}
      </Button>
      {secondary ? (
        <Button variant="ghost" href={secondary.href}>
          {secondary.label}
        </Button>
      ) : null}
    </div>
  );
}
