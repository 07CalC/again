import ShelfCategoryPage, {
  shelfCategoryMetadata,
} from "@/components/ShelfCategoryPage";

export const dynamic = "force-dynamic";
export const metadata = shelfCategoryMetadata("games");

export default function GamesPage() {
  return <ShelfCategoryPage category="games" />;
}
