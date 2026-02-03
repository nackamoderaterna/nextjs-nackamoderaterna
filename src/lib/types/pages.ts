import type { PageBlock } from "./types";

/**
 * Shared types for Sanity pages and listing pages.
 */

export type PageHeaderData = {
  header?: string;
  description?: string;
  image?: unknown;
  imageHeight?: "small" | "medium" | "large" | "fullscreen";
  overlayOpacity?: number | null;
  ctaButton?: {
    label: string;
    href: string;
    icon?: { name?: string | null } | null;
  } | null;
};

export type PageSEO = {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: {
    url?: string;
    asset?: unknown;
  };
};

/** Modal shown on page load (e.g. cookie notice, campaign). */
export type PageModalData = {
  enabled?: boolean;
  onLoadDelayMs?: number;
  frequency?: "always" | "oncePerSession" | "oncePerDay";
  storageKey?: string;
  title?: string;
  /** Portable text content (PortableText value). */
  content?: any[];
  primaryButton?: { label?: string; href?: string };
  secondaryButton?: { label?: string; href?: string };
};

export type PageData = {
  title?: string;
  slug?: { current?: string };
  pageHeader?: PageHeaderData | null;
  blocks?: PageBlock[];
  pageModal?: PageModalData | null;
  seo?: PageSEO | null;
};

/** Listing page document (e.g. by key: politics, news, events). */
export type ListingPage = {
  title?: string;
  intro?: string;
  seo?: {
    title?: string;
    description?: string;
  };
};
