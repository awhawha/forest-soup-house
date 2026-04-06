import { SoupCardsClient } from "@/components/soup-cards/SoupCardsClient";
import { soups } from "@/data/soups";

export default function SoupCardsPage() {
  return <SoupCardsClient soups={soups} />;
}
