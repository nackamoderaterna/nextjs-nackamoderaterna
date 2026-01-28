import {
  GeographicalArea,
  News,
  PoliticalArea,
  Politician,
} from "~/sanity.types";
import { Dereferenced } from "./types";

export type NewsDocumentWithUrl = {
  url?: string;
  originalFilename?: string;
};

export type RelatedNewsItem = News & { effectiveDate: string };

export type NewsVariant = "default" | "debate" | "pressrelease";

export type ArticleSeriesInfo = {
  _id: string;
  title?: string;
  slug?: { current?: string };
  description?: string;
};

export type NewsWithReferences = Omit<
  News,
  | "referencedPolitician"
  | "politicalAreas"
  | "geographicalAreas"
  | "related"
  | "dateOverride"
> & {
  effectiveDate: string;
  document?: NewsDocumentWithUrl;
  variant?: NewsVariant;

  referencedPoliticians?: Dereferenced<Politician>;
  politicalAreas?: Dereferenced<PoliticalArea>;
  geographicalAreas?: Dereferenced<GeographicalArea>;
  /**
   * Artikelserie-objekt (om artikeln tillhör en serie).
   * OBS: Sanity TypeGen i repo kan ligga efter schemaändringar.
   */
  series?: ArticleSeriesInfo;
  seriesNews?: Array<RelatedNewsItem>;
  relatedByPoliticalArea?: Array<RelatedNewsItem>;
};
