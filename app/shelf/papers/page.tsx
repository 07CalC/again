import ShelfCategoryPage, {
  shelfCategoryMetadata,
} from "@/components/ShelfCategoryPage";

export const dynamic = "force-dynamic";
export const metadata = shelfCategoryMetadata("papers");

export default function PapersPage() {
  return <ShelfCategoryPage category="papers" />;
}
