import ShelfCategoryPage, {
  shelfCategoryMetadata,
} from "@/components/ShelfCategoryPage";

export const dynamic = "force-dynamic";
export const metadata = shelfCategoryMetadata("anime");

export default function AnimePage() {
  return <ShelfCategoryPage category="anime" />;
}
