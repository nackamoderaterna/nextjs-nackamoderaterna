import { sanityClient } from "@/lib/sanity/client";
import { groq } from "next-sanity";
import Block from "./Block";
import { BlockHeading, getBlockHeading } from "./BlockHeading";
import { PoliticalIssueItem } from "../politics/PoliticalIssueItem";
import { ResponsiveGrid } from "../shared/ResponsiveGrid";

interface PoliticalIssueData {
  _id: string;
  question?: string | null;
  description?: string | null;
  slug?: { current?: string } | null;
  featured?: boolean;
  fulfilled?: boolean;
  politicalAreas?: Array<{
    _id?: string;
    name?: string | null;
    slug?: { current?: string } | null;
    icon?: { name?: string | null } | null;
  }>;
  geographicalAreas?: Array<{
    _id?: string;
    name?: string | null;
    slug?: { current?: string } | null;
  }>;
}

interface PoliticalIssuesBlockProps {
  _type: "block.politicalIssues";
  heading?: { title?: string | null; subtitle?: string | null };
  mode?: "manual" | "allFeatured" | "byCategory";
  items?: PoliticalIssueData[];
  politicalArea?: { _ref: string } | null;
  filter?: "all" | "featured" | "fulfilled" | "unfulfilled";
  limit?: number;
}

async function fetchPoliticalIssues(
  areaId?: string,
  filter?: string,
  limit?: number
): Promise<PoliticalIssueData[]> {
  const conditions = ['_type == "politicalIssue"'];

  if (areaId) {
    conditions.push(`references("${areaId}")`);
  }

  if (filter === "featured") {
    conditions.push("featured == true");
  } else if (filter === "fulfilled") {
    conditions.push("fulfilled == true");
  } else if (filter === "unfulfilled") {
    conditions.push("(fulfilled != true || !defined(fulfilled))");
  }

  const query = groq`
    *[${conditions.join(" && ")}] | order(featured desc, _updatedAt desc) ${limit ? `[0...${limit}]` : ""} {
      _id,
      question,
      description,
      slug,
      featured,
      fulfilled,
      "politicalAreas": politicalAreas[]->{
        _id,
        name,
        slug,
        icon{ name }
      }
    }
  `;

  return sanityClient.fetch<PoliticalIssueData[]>(query, {}, {
    next: { revalidate: 3600 },
  });
}

export async function PoliticalIssuesBlock({
  block,
}: {
  block: PoliticalIssuesBlockProps;
}) {
  const { title, subtitle } = getBlockHeading(block);

  let issues: PoliticalIssueData[];

  if (block.mode === "manual" && block.items?.length) {
    // Use pre-resolved items from query
    issues = block.items;
  } else if (block.mode === "allFeatured") {
    // Fetch all featured (kärnfrågor) issues
    issues = await fetchPoliticalIssues(undefined, "featured", block.limit);
  } else {
    // Fetch by category (default behavior)
    const areaId = block.politicalArea?._ref;
    issues = await fetchPoliticalIssues(areaId, block.filter, block.limit);
  }

  if (!issues.length) {
    return null;
  }

  // Sort: kärnfrågor first, then fulfilled, then rest
  const sorted = [
    ...issues.filter((i) => i.featured && !i.fulfilled),
    ...issues.filter((i) => i.featured && i.fulfilled),
    ...issues.filter((i) => !i.featured && i.fulfilled),
    ...issues.filter((i) => !i.featured && !i.fulfilled),
  ];

  return (
    <Block paddingY="large" maxWidth="7xl">
      <BlockHeading title={title} subtitle={subtitle} />
      <ResponsiveGrid cols={3}>
        {sorted.map((issue) => (
          <PoliticalIssueItem
            key={issue._id}
            title={issue.question || ""}
            description={issue.description}
            issueSlug={issue.slug?.current}
            featured={issue.featured}
            fulfilled={issue.fulfilled}
            politicalAreas={issue.politicalAreas}
            geographicalAreas={issue.geographicalAreas ?? []}
          />
        ))}
      </ResponsiveGrid>
    </Block>
  );
}
