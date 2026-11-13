import ShelfCategoryPage, {
  shelfCategoryMetadata,
} from "@/components/ShelfCategoryPage";

export const dynamic = "force-dynamic";
export const metadata = shelfCategoryMetadata("movies");

export default function MoviesPage() {
  return <ShelfCategoryPage category="movies" />;
}
