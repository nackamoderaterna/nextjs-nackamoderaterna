import { NextRequest, NextResponse } from "next/server";
import Fuse from "fuse.js";
import { sanityClient } from "@/lib/sanity/client";
import { searchQuery } from "@/lib/queries/search";
import { ROUTE_BASE } from "@/lib/routes";

export const dynamic = "force-dynamic";

interface SearchResult {
  _id: string;
  _type: string;
  name?: string;
  title?: string;
  question?: string;
  slug?: {
    current: string;
  };
  excerpt?: string;
  searchText?: string;
  icon?: { name?: string | null } | null;
  image?: {
    asset?: {
      _ref: string;
      _type: "reference";
    };
    _type: "image";
  };
  mainImage?: {
    asset?: {
      _ref: string;
      _type: "reference";
    };
    _type: "image";
  };
  featured?: boolean;
  fulfilled?: boolean;
}

interface SearchData {
  politicians: SearchResult[];
  events: SearchResult[];
  news: SearchResult[];
  politicalAreas: SearchResult[];
  geographicalAreas: SearchResult[];
  politicalIssues: SearchResult[];
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
    const allItems: Array<SearchResult & { category: string; url: string }> =
      [];

    // Add politicians
    data.politicians.forEach((item) => {
      allItems.push({
        ...item,
        category: "Politiker",
        url: `${ROUTE_BASE.POLITICIANS}/${item.slug?.current || ""}`,
      });
    });

    // Add events
    data.events.forEach((item) => {
      allItems.push({
        ...item,
        category: "Evenemang",
        url: `${ROUTE_BASE.EVENTS}/${item.slug?.current || ""}`,
      });
    });

    // Add news
    data.news.forEach((item) => {
      allItems.push({
        ...item,
        category: "Nyheter",
        url: `${ROUTE_BASE.NEWS}/${item.slug?.current || ""}`,
      });
    });

    // Add political areas (categories under /politik/kategori)
    data.politicalAreas.forEach((item) => {
      allItems.push({
        ...item,
        category: "Politiskt område",
        url: `${ROUTE_BASE.POLITICS_CATEGORY}/${item.slug?.current || ""}`,
      });
    });

    // Add geographical areas (under /omrade)
    data.geographicalAreas.forEach((item) => {
      allItems.push({
        ...item,
        category: "Geografiskt område",
        url: `${ROUTE_BASE.AREAS}/${item.slug?.current || ""}`,
      });
    });

    // Add political issues (sakfrågor)
    data.politicalIssues.forEach((item) => {
      const iconName = item.fulfilled
        ? "Trophy"
        : item.featured
          ? "Star"
          : "CheckCircle";
      allItems.push({
        ...item,
        name: item.question,
        icon: { name: iconName },
        category: "Sakfråga",
        url: `${ROUTE_BASE.POLITICS_ISSUES}/${item.slug?.current || ""}`,
      });
    });

    // Configure Fuse.js
    const fuse = new Fuse(allItems, {
      ...fuseOptions,
      keys: [
        { name: "name", weight: 0.5 },
        { name: "title", weight: 0.5 },
        { name: "searchText", weight: 0.3 },
        { name: "excerpt", weight: 0.1 },
        { name: "description", weight: 0.1 },
      ],
    });

    // Perform search
    const results = fuse.search(query).slice(0, 10);

    return NextResponse.json({
      results: results.map((result) => ({
        ...result.item,
        // Normalize image field: use mainImage for news, image for others
        image: result.item.mainImage || result.item.image,
        score: result.score,
      })),
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
