import { notFound } from "next/navigation";
import { SoupHouseClient } from "@/components/world/SoupHouseClient";
import { getThemeBySlug } from "@/data/themes";

/** 湯湯屋主屋：當前主題包入口（與首頁「今日旅程」一致時可改此 slug） */
const SOUP_HOUSE_THEME_SLUG = "memory-soup";

export default function SoupHousePage() {
  const theme = getThemeBySlug(SOUP_HOUSE_THEME_SLUG);
  if (!theme) {
    notFound();
  }

  return <SoupHouseClient theme={theme} />;
}
