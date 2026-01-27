import { NewsBlock, NewsBlockProps } from "@/lib/components/blocks/NewsBlock";
import { BlockPoliticianDereferenced } from "@/lib/components/blocks/PoliticianReference";
import {
  BlockHero,
  BlockImage,
  BlockPolitician,
  BlockText,
  BlockVideo,
} from "~/sanity.types";

export type BlockAlignment = "left" | "center" | "right";

// Inline types for new blocks (until Sanity types are regenerated)
type BlockCta = {
  _type: "block.cta";
  heading: string;
  description?: string;
  primaryButton?: {
    label: string;
    link: string;
  };
  secondaryButton?: {
    label: string;
    link: string;
  };
  alignment?: "left" | "center" | "right";
};

type BlockStats = {
  _type: "block.stats";
  heading?: string;
  description?: string;
  stats: Array<{
    value: string;
    label: string;
    description?: string;
  }>;
  columns?: 2 | 3 | 4;
};

type BlockTwoColumn = {
  _type: "block.twoColumn";
  heading?: string;
  image: any;
  content: any[];
  imagePosition?: "left" | "right";
  verticalAlignment?: "top" | "center" | "bottom";
};

type BlockAccordion = {
  _type: "block.accordion";
  heading?: string;
  description?: string;
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
  heading?: string;
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
  heading?: string;
  description?: string;
  showContactInfo?: boolean;
};

export type PageBlock =
  | BlockHero
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
  | BlockContact;

type SanityDocumentBase = {
  _id: string;
  _type: string;
};

export type WithEffectiveDate<T> = T & {
  effectiveDate: string;
};

export type Dereferenced<T extends SanityDocumentBase> = Array<
  Pick<T, "_id"> & Omit<T, "_type">
>;
