import { NextResponse } from "next/server";
import { sanityClient } from "@/lib/sanity/client";
import { searchQuery, SearchData, buildSearchItems } from "@/lib/queries/search";

export const revalidate = 86400;

export async function GET() {
  const data = await sanityClient.fetch<SearchData>(searchQuery, {}, {
    next: { revalidate: 86400 },
  });

  const items = buildSearchItems(data);

  return NextResponse.json(items, {
    headers: {
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=86400",
    },
  });
}
