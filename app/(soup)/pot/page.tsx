import { SoupPotClient } from "@/components/app/SoupPotClient";
import { getAllWeekIngredients, getPotRecipes } from "@/lib/weekly";

export default async function SoupPotPage() {
  const [recipes, dex] = await Promise.all([
    getPotRecipes(),
    getAllWeekIngredients(),
  ]);
  return <SoupPotClient recipes={recipes} dex={dex} />;
}
