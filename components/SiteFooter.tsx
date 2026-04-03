import { Button } from "@/components/Button";

/**
 * Global site footer — appears on every page.
 * Soft close: "Back to the forest" + "About" as ghost links.
 */
export function SiteFooter() {
  return (
    <footer
      className="border-t border-border-paper bg-paper py-sp-8"
      role="contentinfo"
    >
      <div className="mx-auto max-w-5xl px-page-px sm:px-page-px-sm">
        <div className="flex flex-col items-center gap-sp-3 text-center text-sm">
          <Button variant="ghost" href="/">
            Back to the Forest · 回到森林
          </Button>
          <Button variant="ghost" href="/about">
            About · 關於湯湯屋
          </Button>
        </div>
      </div>
    </footer>
  );
}
