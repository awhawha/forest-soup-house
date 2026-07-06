import { FriendsClient } from "@/components/app/FriendsClient";
import { getResidents } from "@/lib/weekly";

export default async function FriendsPage() {
  const residents = await getResidents();
  return <FriendsClient residents={residents} />;
}
