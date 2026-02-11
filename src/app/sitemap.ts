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
    sanityClient.fetch<{ slug: string }[]>(allPageSlugsQuery, {}, cacheOpts),
    sanityClient.fetch<{ slug: string }[]>(allNewsSlugsQuery, {}, cacheOpts),
    sanityClient.fetch<{ slug: string }[]>(allPoliticianSlugsQuery, {}, cacheOpts),
    sanityClient.fetch<{ slug: string }[]>(allEventSlugsQuery, {}, cacheOpts),
    sanityClient.fetch<{ slug: string }[]>(allPoliticalAreaSlugsQuery, {}, cacheOpts),
    sanityClient.fetch<{ slug: string }[]>(allGeographicalAreaSlugsQuery, {}, cacheOpts),
    sanityClient.fetch<{ slug: string }[]>(allPoliticalIssueSlugsQuery, {}, cacheOpts),
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
  ];

  const pageRoutes: MetadataRoute.Sitemap = pages.map(({ slug }) => ({
    url: `${siteUrl}/${slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const newsRoutes: MetadataRoute.Sitemap = news.map(({ slug }) => ({
    url: `${siteUrl}/nyheter/${slug}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const politicianRoutes: MetadataRoute.Sitemap = politicians.map(
    ({ slug }) => ({
      url: `${siteUrl}/politiker/${slug}`,
      changeFrequency: "monthly",
      priority: 0.5,
    })
  );

  const eventRoutes: MetadataRoute.Sitemap = events.map(({ slug }) => ({
    url: `${siteUrl}/evenemang/${slug}`,
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  const politicalAreaRoutes: MetadataRoute.Sitemap = politicalAreas.map(
    ({ slug }) => ({
      url: `${siteUrl}/politik/kategori/${slug}`,
      changeFrequency: "monthly",
      priority: 0.6,
    })
  );

  const geographicalAreaRoutes: MetadataRoute.Sitemap =
    geographicalAreas.map(({ slug }) => ({
      url: `${siteUrl}/omrade/${slug}`,
      changeFrequency: "monthly",
      priority: 0.5,
    }));

  const politicalIssueRoutes: MetadataRoute.Sitemap = politicalIssues.map(
    ({ slug }) => ({
      url: `${siteUrl}/politik/sakfragor/${slug}`,
      changeFrequency: "monthly",
      priority: 0.5,
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
