import Link from "next/link";
import { SanityImage } from "@/lib/components/shared/SanityImage";
import { PeopleCard } from "@/lib/components/politician/PeopleCard";
import { Sidebar } from "@/lib/components/shared/Sidebar";
import { SidebarNewsItem } from "@/lib/components/shared/SidebarListItem";
import { NewsExpanded } from "@/lib/types/news";
import { Button } from "@/lib/components/ui/button";
import { FileDown, Instagram } from "lucide-react";
import { formatDate } from "@/lib/utils/dateUtils";
import { ROUTE_BASE } from "@/lib/routes";

interface NewsSidebarProps {
  news: NewsExpanded;
  currentSlug: string;
}

const SIDEBAR_ASPECT_CLASSES: Record<string, string> = {
  portrait: "aspect-[4/5]",
  square: "aspect-square",
  landscape: "aspect-video",
  auto: "aspect-auto",
};

export function NewsSidebar({ news, currentSlug }: NewsSidebarProps) {
  const documents = news.documents ?? [];
  const mainImage = news.mainImage as { aspectRatio?: string } | undefined;
  const aspectRatio = mainImage?.aspectRatio && SIDEBAR_ASPECT_CLASSES[mainImage.aspectRatio]
    ? mainImage.aspectRatio
    : "portrait";
  const aspectClass = SIDEBAR_ASPECT_CLASSES[aspectRatio];
  const useAuto = aspectRatio === "auto";

  return (
    <div className="grid gap-4">
      {news.mainImage && (
          <div
            className={`relative w-full h-full overflow-hidden rounded-lg bg-muted ${aspectClass} hidden lg:block`}
          >
            {useAuto ? (
              <SanityImage
                image={news.mainImage}
                fill={false}
                width={800}
                height={600}
                className="w-full h-full object-cover"
                alt={news.mainImage.alt || news.title || ""}
              />
            ) : (
              <SanityImage
                image={news.mainImage}
                fill
                className="object-cover"
                alt={news.mainImage.alt || news.title || ""}
              />
            )}
          </div>
         
        
      )}

{news.instagramUrl && (
          <Button
            asChild
            variant="outline"
            className="w-full"
            size="lg"
          >
            <Link
              href={news.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              
              className="flex items-center justify-center gap-2"
            >
              <Instagram className="h-4 w-4" />
              Delta i diskussionen på Instagram
            </Link>
          </Button>
          
        )}
      {documents.length > 0 && (
        <Sidebar heading="Dokument">
         <ul className="grid gap-4"> {documents
            .filter((doc) => doc?.url)
            .map((doc, index) => (
              <Link
                key={index}
                href={doc.url!}
                target="_blank"
                rel="noopener noreferrer"
                download={doc.originalFilename}
                className="flex items-center gap-3 group hover:bg-muted rounded p-2 -m-2 transition-colors"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-muted-foreground/10 text-muted-foreground group-hover:text-foreground">
                  <FileDown className="h-5 w-5" />
                </span>
                <span className="text-sm font-medium text-foreground">
                  {doc.originalFilename ?? "Ladda ner dokument"}
                </span>
              </Link>
            ))}
            </ul>
        </Sidebar>
      )}

      {news.referencedPoliticians && news.referencedPoliticians.length > 0 && (
        <Sidebar heading="Omnämnda">
          <nav aria-label="Lista över omnämnda företrädare">
            <div className="grid gap-4">
              {news.referencedPoliticians.map((politician) => (
                <PeopleCard
                  key={politician._id}
                  image={politician.image}
                  name={politician.name}
                  slug={politician.slug?.current || ""}
                  size="small"
                />
              ))}
            </div>
          </nav>
        </Sidebar>
      )}

      {news.politicalIssues && news.politicalIssues.length > 0 && (
        <Sidebar heading="Politiska frågor">
          <nav aria-label="Lista över politiska frågor">
            <div className="grid gap-4">
              {news.politicalIssues.map((issue: { _id: string; question?: string | null; slug?: { current?: string } | null }) => {
                const issueSlug = (issue as { slug?: { current?: string } }).slug?.current;
                return issueSlug ? (
                  <Link
                    key={issue._id}
                    href={`${ROUTE_BASE.POLITICS_ISSUES}/${issueSlug}`}
                    className="flex items-center gap-3 group hover:bg-muted rounded p-2 -m-2 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground text-sm leading-tight">
                        {issue.question}
                      </h3>
                    </div>
                  </Link>
                ) : (
                  <div
                    key={issue._id}
                    className="flex items-center gap-3 rounded p-2"
                  >
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground text-sm leading-tight">
                        {issue.question}
                      </h3>
                    </div>
                  </div>
                );
              })}
            </div>
          </nav>
        </Sidebar>
      )}

      {news.geographicalAreas && news.geographicalAreas.length > 0 && (
        <Sidebar heading="Geografiska områden">
          <nav aria-label="Lista över geografiska områden">
              <div className="grid gap-4">
              {news.geographicalAreas.map((area) => (
                <Link
                  key={area._id}
                  href={`${ROUTE_BASE.POLITICS_AREA}/${area.slug?.current || ""}`}
                  className="flex items-center gap-3 group hover:bg-muted rounded p-2 -m-2 transition-colors"
                >
                  {area.image && (
                    <div className="relative w-12 h-12 flex-shrink-0 rounded overflow-hidden bg-muted">
                      <SanityImage
                        image={area.image}
                        fill
                        alt={area.name || ""}
                        sizes="48px"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground text-sm leading-tight">
                      {area.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </nav>
        </Sidebar>
      )}

      {news.seriesNews && news.seriesNews.length > 0 && (
        <Sidebar heading={news.series?.title ?? "Artikelserie"}>
          <nav aria-label="Artikelserie">
              <ul className="grid gap-6">
                {news.seriesNews.map((item) => {
                  const itemSlug = item.slug?.current ?? "";
                  const isCurrent = itemSlug === currentSlug;
                  return (
                    <li key={item._id}>
                      <SidebarNewsItem
                        title={item.title ?? ""}
                        secondaryText={item.effectiveDate ? formatDate(item.effectiveDate) : undefined}
                        secondaryDateTime={item.effectiveDate}
                        href={isCurrent ? undefined : `${ROUTE_BASE.NEWS}/${itemSlug}`}
                        isCurrent={isCurrent}
                      />
                    </li>
                  );
                })}
              </ul>
            </nav>
        </Sidebar>
      )}

    </div>
  );
}
