import {
  GeographicalArea,
  News,
  PoliticalArea,
  Politician,
} from "~/sanity.types";
import { Dereferenced } from "./types";

export type NewsWithReferences = Omit<
  News,
  | "referencedPolitician"
  | "politicalAreas"
  | "geographicalAreas"
  | "related"
  | "dateOverride"
> & {
  effectiveDate: string;

  referencedPoliticians?: Dereferenced<Politician>;
  politicalAreas?: Dereferenced<PoliticalArea>;
  geographicalAreas?: Dereferenced<GeographicalArea>;
  relatedNews?: Array<Dereferenced<News>>;
};
