import ShelfCategoryPage, {
  shelfCategoryMetadata,
} from "@/components/ShelfCategoryPage";

export const dynamic = "force-dynamic";
export const metadata = shelfCategoryMetadata("other");

export default function OtherPage() {
  return <ShelfCategoryPage category="other" />;
}
