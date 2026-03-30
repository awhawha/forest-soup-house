import * as React from "react";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ButtonVariant = "primary" | "ghost" | "ghost-moss" | "outline";
export type ButtonSize    = "md" | "sm";

interface BaseProps {
  variant?: ButtonVariant;
  size?:    ButtonSize;
  className?: string;
}

// When `href` is provided → renders as <Link> (or <a> for external)
interface LinkProps extends BaseProps {
  href: string;
  children?: React.ReactNode;
  external?: boolean;             // adds target="_blank" rel="noopener noreferrer"
  type?: never;
  onClick?: never;
  disabled?: never;
}

// When no `href` → renders as <button>
interface ButtonElementProps extends BaseProps, React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: never;
  external?: never;
}

export type ButtonProps = LinkProps | ButtonElementProps;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function buildClassName(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  extra?: string,
): string {
  const parts = [
    "btn",
    `btn-${variant}`,
    // ghost variants manage their own padding — don't apply size padding
    variant === "ghost" || variant === "ghost-moss" ? "" : `btn-${size}`,
    extra,
  ];
  return parts.filter(Boolean).join(" ");
}

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * Unified button/link component for Forest Soup House.
 *
 * Variants:
 *   primary    — filled green pill; for CTAs and primary actions
 *   ghost      — text-only in wood-muted; for secondary nav links (footer, etc.)
 *   ghost-moss — text-only in moss green; for in-content action links
 *   outline    — bordered; reserved for future use
 *
 * Sizes:
 *   md  — default: 24px h-pad, 12px v-pad  (standalone CTAs)
 *   sm  — compact: 16px h-pad, 8px v-pad   (inline card links)
 *
 * Usage:
 *   // Primary CTA (renders as <button>)
 *   <Button variant="primary" onClick={handleClick}>Explore</Button>
 *
 *   // Primary CTA link (renders as Next.js <Link>)
 *   <Button variant="primary" href="/world">Explore</Button>
 *
 *   // Ghost nav link
 *   <Button variant="ghost" href="/">Back to the forest</Button>
 *
 *   // In-content link (moss coloured)
 *   <Button variant="ghost-moss" href="/soup-cards/memory-soup" size="sm">
 *     View soup card
 *   </Button>
 */
export function Button(props: ButtonProps) {
  const { variant = "primary", size = "md", className, ...rest } = props;
  const cls = buildClassName(variant, size, className);

  // Link variant
  if ("href" in rest && rest.href !== undefined) {
    const { href, external, ...linkRest } = rest as LinkProps;
    if (external) {
      return (
        <a
          href={href}
          className={cls}
          target="_blank"
          rel="noopener noreferrer"
          {...(linkRest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        />
      );
    }
    return <Link href={href} className={cls} {...linkRest} />;
  }

  // Button variant
  const { type = "button", ...buttonRest } = rest as ButtonElementProps;
  return <button type={type} className={cls} {...buttonRest} />;
}
