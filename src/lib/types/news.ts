import {
  GeographicalArea,
  News,
  PoliticalArea,
  PoliticalIssue,
  Politician,
} from "~/sanity.types";
import { Dereferenced, WithDereferencedFields, WithEffectiveDate } from "./shared";

export type NewsDocumentWithUrl = {
  title?: string;
  url?: string;
  originalFilename?: string;
};

/** News document with effectiveDate (dateOverride ?? _createdAt). */
export type RelatedNewsItem = WithEffectiveDate<News>;

export type NewsVariant = "default" | "debate" | "pressrelease";

export type ArticleSeriesInfo = {
  _id: string;
  title?: string;
  slug?: { current?: string };
  description?: string;
};

/** Ref fields on News that are expanded to full documents in queries. */
type NewsRefs = {
  referencedPoliticians: Politician;
  politicalAreas: PoliticalArea;
  geographicalAreas: GeographicalArea;
};

type NewsBase = Omit<
  News,
  | "referencedPolitician"
  | "politicalAreas"
  | "geographicalAreas"
  | "politicalIssues"
  | "related"
  | "dateOverride"
>;

/**
 * News document with reference fields dereferenced (full documents) and effectiveDate.
 * Use for query results where refs are expanded and effectiveDate is projected.
 */
export type NewsExpanded = WithDereferencedFields<NewsBase, NewsRefs> & {
  effectiveDate: string;
  documents?: NewsDocumentWithUrl[];
  instagramUrl?: string | null;
  facebookUrl?: string | null;
  variant?: NewsVariant;
  series?: ArticleSeriesInfo;
  seriesNews?: RelatedNewsItem[];
  relatedByPoliticalArea?: RelatedNewsItem[];
  politicalIssues?: Array<{
    _id: string;
    question?: string | null;
    slug?: { current?: string } | null;
  }>;
};

/** @deprecated Use NewsExpanded. */
export type NewsWithReferences = NewsExpanded;
