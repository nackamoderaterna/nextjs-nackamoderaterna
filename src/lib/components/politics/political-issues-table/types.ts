import type { PoliticalIssue } from "~/sanity.types";

export type PoliticalIssueWithAreas = Omit<
  PoliticalIssue,
  "politicalAreas" | "geographicalAreas"
> & {
  description?: string | null;
  fulfilled?: boolean;
  slug?: { current: string } | null;
  politicalAreas: Array<{
    _id: string;
    name: string;
    slug: { current: string };
    icon?: { name?: string } | null;
  }>;
  geographicalAreas?: Array<{
    _id: string;
    name: string;
    slug: { current: string };
  }>;
};
