import { MetadataRoute } from "next";
import { sanityClient } from "@/lib/sanity/client";
import { allPageSlugsQuery } from "@/lib/queries/pages";
import { allNewsSlugsQuery } from "@/lib/queries/nyheter";
import { allPoliticianSlugsQuery } from "@/lib/queries/politicians";
import { allEventSlugsQuery } from "@/lib/queries/events";
import {
  allPoliticalAreaSlugsQuery,
  allGeographicalAreaSlugsQuery,
  allPoliticalIssueSlugsQuery,
} from "@/lib/queries/politik";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://nackamoderaterna.se";

export const revalidate = 86400;

type SlugEntry = { slug: string; lastModified?: string };

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const cacheOpts = { next: { revalidate: 86400 } } as const;
  const [
    pages,
    news,
    politicians,
    events,
    politicalAreas,
    geographicalAreas,
    politicalIssues,
  ] = await Promise.all([
    sanityClient.fetch<SlugEntry[]>(allPageSlugsQuery, {}, cacheOpts),
    sanityClient.fetch<SlugEntry[]>(allNewsSlugsQuery, {}, cacheOpts),
    sanityClient.fetch<SlugEntry[]>(allPoliticianSlugsQuery, {}, cacheOpts),
    sanityClient.fetch<SlugEntry[]>(allEventSlugsQuery, {}, cacheOpts),
    sanityClient.fetch<SlugEntry[]>(allPoliticalAreaSlugsQuery, {}, cacheOpts),
    sanityClient.fetch<SlugEntry[]>(allGeographicalAreaSlugsQuery, {}, cacheOpts),
    sanityClient.fetch<SlugEntry[]>(allPoliticalIssueSlugsQuery, {}, cacheOpts),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/nyheter`, changeFrequency: "daily", priority: 0.8 },
    { url: `${siteUrl}/politiker`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/evenemang`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${siteUrl}/politik`, changeFrequency: "monthly", priority: 0.7 },
    {
      url: `${siteUrl}/politik/sakfragor`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${siteUrl}/omrade`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${siteUrl}/kontakt`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteUrl}/politik/kategori`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  const pageRoutes: MetadataRoute.Sitemap = pages.map(({ slug }) => ({
    url: `${siteUrl}/${slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const newsRoutes: MetadataRoute.Sitemap = news.map(({ slug, lastModified }) => ({
    url: `${siteUrl}/nyheter/${slug}`,
    changeFrequency: "monthly",
    priority: 0.6,
    ...(lastModified && { lastModified }),
  }));

  const politicianRoutes: MetadataRoute.Sitemap = politicians.map(
    ({ slug, lastModified }) => ({
      url: `${siteUrl}/politiker/${slug}`,
      changeFrequency: "monthly",
      priority: 0.5,
      ...(lastModified && { lastModified }),
    })
  );

  const eventRoutes: MetadataRoute.Sitemap = events.map(({ slug, lastModified }) => ({
    url: `${siteUrl}/evenemang/${slug}`,
    changeFrequency: "weekly",
    priority: 0.5,
    ...(lastModified && { lastModified }),
  }));

  const politicalAreaRoutes: MetadataRoute.Sitemap = politicalAreas.map(
    ({ slug, lastModified }) => ({
      url: `${siteUrl}/politik/kategori/${slug}`,
      changeFrequency: "monthly",
      priority: 0.6,
      ...(lastModified && { lastModified }),
    })
  );

  const geographicalAreaRoutes: MetadataRoute.Sitemap =
    geographicalAreas.map(({ slug, lastModified }) => ({
      url: `${siteUrl}/omrade/${slug}`,
      changeFrequency: "monthly",
      priority: 0.5,
      ...(lastModified && { lastModified }),
    }));

  const politicalIssueRoutes: MetadataRoute.Sitemap = politicalIssues.map(
    ({ slug, lastModified }) => ({
      url: `${siteUrl}/politik/sakfragor/${slug}`,
      changeFrequency: "monthly",
      priority: 0.5,
      ...(lastModified && { lastModified }),
    })
  );

  return [
    ...staticRoutes,
    ...pageRoutes,
    ...newsRoutes,
    ...politicianRoutes,
    ...eventRoutes,
    ...politicalAreaRoutes,
    ...geographicalAreaRoutes,
    ...politicalIssueRoutes,
  ];
}
