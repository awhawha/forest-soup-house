import { permanentRedirect } from "next/navigation";

/** Navbar 使用 /missions；內容與森林小冒險頁相同 */
export default function MissionsPage() {
  permanentRedirect("/adventures");
}
