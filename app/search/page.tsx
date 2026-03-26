import { Suspense } from "react";
import { SearchPageClient } from "@/components/search/SearchPageClient";

export const metadata = {
  title: "Search Deals — Travel Deal Hunter",
  description:
    "Search and compare the best flight, train, bus, and hotel deals powered by AI."
};

export default function SearchPage() {
  return (
    <Suspense>
      <SearchPageClient />
    </Suspense>
  );
}
