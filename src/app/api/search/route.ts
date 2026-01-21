import { NextRequest, NextResponse } from "next/server";
import Fuse from "fuse.js";
import { sanityClient } from "@/lib/sanity/client";
import { searchQuery } from "@/lib/queries/search";

export const dynamic = "force-dynamic";

interface SearchResult {
  _id: string;
  _type: string;
  name?: string;
  title?: string;
  slug?: {
    current: string;
  };
  excerpt?: string;
  searchText?: string;
}

interface SearchData {
  politicians: SearchResult[];
  events: SearchResult[];
  news: SearchResult[];
  politicalAreas: SearchResult[];
  geographicalAreas: SearchResult[];
}

const fuseOptions = {
  threshold: 0.3,
  includeScore: true,
  minMatchCharLength: 2,
};

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q");

    if (!query || query.length < 2) {
      return NextResponse.json({ results: [] });
    }

    // Fetch all searchable data
    const data = await sanityClient.fetch<SearchData>(searchQuery);

    // Combine all items with type labels
    const allItems: Array<SearchResult & { category: string; url: string }> = [];

    // Add politicians
    data.politicians.forEach((item) => {
      allItems.push({
        ...item,
        category: "Politiker",
        url: `/politiker/${item.slug?.current || ""}`,
      });
    });

    // Add events
    data.events.forEach((item) => {
      allItems.push({
        ...item,
        category: "Evenemang",
        url: `/event/${item.slug?.current || ""}`,
      });
    });

    // Add news
    data.news.forEach((item) => {
      allItems.push({
        ...item,
        category: "Nyheter",
        url: `/nyheter/${item.slug?.current || ""}`,
      });
    });

    // Add political areas
    data.politicalAreas.forEach((item) => {
      allItems.push({
        ...item,
        category: "Politiskt område",
        url: `/politik/${item.slug?.current || ""}`,
      });
    });

    // Add geographical areas
    data.geographicalAreas.forEach((item) => {
      allItems.push({
        ...item,
        category: "Geografiskt område",
        url: `/politik/${item.slug?.current || ""}`,
      });
    });

    // Configure Fuse.js
    const fuse = new Fuse(allItems, {
      ...fuseOptions,
      keys: [
        { name: "name", weight: 0.5 },
        { name: "title", weight: 0.5 },
        { name: "searchText", weight: 0.3 },
        { name: "excerpt", weight: 0.2 },
        { name: "description", weight: 0.2 },
      ],
    });

    // Perform search
    const results = fuse.search(query).slice(0, 10);

    return NextResponse.json({
      results: results.map((result) => ({
        ...result.item,
        score: result.score,
      })),
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Search failed" },
      { status: 500 }
    );
  }
}
