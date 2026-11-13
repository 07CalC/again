import ShelfCategoryPage, {
  shelfCategoryMetadata,
} from "@/components/ShelfCategoryPage";

export const dynamic = "force-dynamic";
export const metadata = shelfCategoryMetadata("books");

export default function BooksPage() {
  return <ShelfCategoryPage category="books" />;
}
