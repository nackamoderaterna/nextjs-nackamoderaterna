import { NewsBlock, NewsBlockProps } from "@/lib/components/blocks/NewsBlock";
import { BlockPoliticianDereferenced } from "@/lib/components/blocks/PoliticianReference";
import {
  BlockImage,
  BlockPolitician,
  BlockText,
  BlockVideo,
} from "~/sanity.types";
import type { Dereferenced, WithEffectiveDate } from "./shared";

export type { Dereferenced, WithEffectiveDate } from "./shared";

export type BlockAlignment = "left" | "center" | "right";

/** Block heading object (title + subtitle) used across all blocks */
export type BlockHeadingData = {
  title?: string | null;
  subtitle?: string | null;
};

// Inline types for new blocks (until Sanity types are regenerated)
type BlockCta = {
  _type: "block.cta";
  layout?: "fullWidth" | "contained";
  heading?: BlockHeadingData;
  primaryAction?: { label: string; href: string };
  secondaryAction?: { label: string; href: string };
  alignment?: "left" | "center" | "right";
  primaryButton?: { label: string; link: string };
  secondaryButton?: { label: string; link: string };
};

type BlockStats = {
  _type: "block.stats";
  heading?: BlockHeadingData;
  stats: Array<{
    value: string;
    label: string;
    description?: string;
  }>;
  columns?: 2 | 3 | 4;
};

type BlockTwoColumn = {
  _type: "block.twoColumn";
  heading?: BlockHeadingData;
  image: any;
  content: any[];
  imagePosition?: "left" | "right";
  verticalAlignment?: "top" | "center" | "bottom";
};

type BlockAccordion = {
  _type: "block.accordion";
  heading?: BlockHeadingData;
  items: Array<{
    title: string;
    content: any[];
  }>;
  allowMultiple?: boolean;
};

type BlockQuote = {
  _type: "block.quote";
  quote: string;
  author?: string;
  authorTitle?: string;
  authorImage?: any;
  alignment?: "left" | "center" | "right";
};

type BlockImageGallery = {
  _type: "block.imageGallery";
  heading?: BlockHeadingData;
  images?: Array<{
    _key?: string;
    asset?: any;
    alt?: string;
    caption?: string;
  }>;
  columns?: 2 | 3 | 4;
  aspectRatio?: "square" | "landscape" | "portrait" | "auto";
};

type BlockContact = {
  _type: "block.contact";
  heading?: BlockHeadingData;
  showContactInfo?: boolean;
};

type BlockPoliticalAreas = {
  _type: "block.politicalAreas";
  heading?: BlockHeadingData;
  items?: Array<{
    _id: string;
    name?: string | null;
    slug?: { current?: string | null } | null;
    icon?: { name?: string | null } | null;
  }>;
};

type BlockGeographicalAreas = {
  _type: "block.geographicalAreas";
  heading?: BlockHeadingData;
  items?: Array<{
    _id: string;
    name?: string | null;
    slug?: { current?: string | null } | null;
    image?: unknown;
  }>;
};

type BlockPoliticalIssues = {
  _type: "block.politicalIssues";
  heading?: BlockHeadingData;
  politicalArea?: { _ref: string } | null;
  filter?: "all" | "featured" | "fulfilled" | "unfulfilled";
  limit?: number;
};

export type PageBlock =
  | BlockText
  | BlockImage
  | BlockVideo
  | BlockPoliticianDereferenced
  | NewsBlockProps
  | BlockCta
  | BlockStats
  | BlockTwoColumn
  | BlockAccordion
  | BlockQuote
  | BlockImageGallery
  | BlockContact
  | BlockPoliticalAreas
  | BlockGeographicalAreas
  | BlockPoliticalIssues;

