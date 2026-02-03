import Link from "next/link";
import { SidebarList, SidebarListItem } from "@/lib/components/shared/SidebarList";
import { Sidebar } from "@/lib/components/shared/Sidebar";
import { NewsExpanded } from "@/lib/types/news";
import { Button } from "@/lib/components/ui/button";
import { FileDown, Facebook, Instagram } from "lucide-react";
import { formatDate } from "@/lib/utils/dateUtils";
import { ROUTE_BASE } from "@/lib/routes";
import { cleanInvisibleUnicode } from "@/lib/politicians";

interface NewsSidebarProps {
  news: NewsExpanded;
  currentSlug: string;
}

export function NewsSidebar({ news, currentSlug }: NewsSidebarProps) {
  const documents = (news.documents ?? []) as Array<{
    url?: string;
    originalFilename?: string;
  }>;

  return (
    <div className="grid gap-4">
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
      {news.facebookUrl && (
          <Button
            asChild
            variant="outline"
            className="w-full"
            size="lg"
          >
            <Link
              href={news.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2"
            >
              <Facebook className="h-4 w-4" />
              Delta i diskussionen på Facebook
            </Link>
          </Button>
        )}
      {documents.length > 0 && (
        <Sidebar heading="Dokument">
          <SidebarList>
            {documents
              .filter((doc) => doc?.url)
              .map((doc, index) => (
                <SidebarListItem
                  key={index}
                  title={doc.originalFilename ?? "Ladda ner dokument"}
                  href={doc.url!}
                  external
                  download={doc.originalFilename}
                  icon={<FileDown className="h-4 w-4 text-brand-primary" />}
                />
              ))}
          </SidebarList>
        </Sidebar>
      )}

      {news.referencedPoliticians && news.referencedPoliticians.length > 0 && (
        <Sidebar heading="Omnämnda">
          <nav aria-label="Lista över omnämnda företrädare">
            <SidebarList>
              {news.referencedPoliticians.map((politician) => (
                <SidebarListItem
                  key={politician._id}
                  title={cleanInvisibleUnicode(politician.name?.trim() || "Namn saknas")}
                  image={politician.image}
                  href={`${ROUTE_BASE.POLITICIANS}/${politician.slug?.current || ""}`}
                />
              ))}
            </SidebarList>
          </nav>
        </Sidebar>
      )}

      {news.politicalIssues && news.politicalIssues.length > 0 && (
        <Sidebar heading="Politiska frågor">
          <nav aria-label="Lista över politiska frågor">
            <SidebarList>
              {news.politicalIssues.map((issue: { _id: string; question?: string | null; slug?: { current?: string } | null }) => {
                const issueSlug = issue.slug?.current;
                return (
                  <SidebarListItem
                    key={issue._id}
                    title={issue.question || ""}
                    href={issueSlug ? `${ROUTE_BASE.POLITICS_ISSUES}/${issueSlug}` : undefined}
                  />
                );
              })}
            </SidebarList>
          </nav>
        </Sidebar>
      )}

      {news.geographicalAreas && news.geographicalAreas.length > 0 && (
        <Sidebar heading="Geografiska områden">
          <nav aria-label="Lista över geografiska områden">
            <SidebarList>
              {news.geographicalAreas.map((area) => (
                <SidebarListItem
                  key={area._id}
                  title={area.name || ""}
                  image={area.image}
                  href={`${ROUTE_BASE.POLITICS_AREA}/${area.slug?.current || ""}`}
                />
              ))}
            </SidebarList>
          </nav>
        </Sidebar>
      )}

      {news.seriesNews && news.seriesNews.length > 0 && (
        <Sidebar heading={news.series?.title ?? "Artikelserie"}>
          <nav aria-label="Artikelserie">
            <SidebarList>
              {news.seriesNews.map((item) => {
                const itemSlug = item.slug?.current ?? "";
                const isCurrent = itemSlug === currentSlug;
                return (
                  <SidebarListItem
                    key={item._id}
                    title={item.title ?? ""}
                    description={
                      item.effectiveDate ? (
                        <time dateTime={item.effectiveDate}>
                          {formatDate(item.effectiveDate)}
                        </time>
                      ) : undefined
                    }
                    href={isCurrent ? undefined : `${ROUTE_BASE.NEWS}/${itemSlug}`}
                    isCurrent={isCurrent}
                  />
                );
              })}
            </SidebarList>
          </nav>
        </Sidebar>
      )}

    </div>
  );
}
