import Link from "next/link";

export function SiteFooter() {
  return (
    <footer
      className="border-t border-border-paper bg-paper py-8"
      role="contentinfo"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="flex flex-col items-center gap-3 text-center text-sm text-wood-muted">
          <Link
            href="/"
            className="text-wood transition-colors hover:text-moss focus:outline-none focus:ring-2 focus:ring-moss/40 focus:ring-offset-2 focus:ring-offset-paper min-h-[44px] inline-flex items-center"
          >
            Back to the forest
          </Link>
          <Link
            href="/about"
            className="transition-colors hover:text-wood focus:outline-none focus:ring-2 focus:ring-moss/40 focus:ring-offset-2 focus:ring-offset-paper min-h-[44px] inline-flex items-center"
          >
            About
          </Link>
        </div>
      </div>
    </footer>
  );
}
