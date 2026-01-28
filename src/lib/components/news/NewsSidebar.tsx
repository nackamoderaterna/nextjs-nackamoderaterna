import Link from "next/link";
import { SanityImage } from "@/lib/components/shared/SanityImage";
import { PeopleCard } from "@/lib/components/politician/PeopleCard";
import { NewsWithReferences } from "@/types/news";
import { FileDown } from "lucide-react";
import { formatDate } from "@/lib/utils/dateUtils";
import { ROUTE_BASE } from "@/lib/routes";

interface NewsSidebarProps {
  news: NewsWithReferences;
  currentSlug: string;
}

export function NewsSidebar({ news, currentSlug }: NewsSidebarProps) {
  const documentUrl = news.document?.url;

  return (
    <div className="grid gap-4">
      {news.mainImage && (
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-muted">
          <SanityImage 
            image={news.mainImage} 
            fill
            className="object-contain"
            alt={news.mainImage.alt || news.title || ""}
          />
        </div>
      )}

      {documentUrl && (
        <aside aria-label="Bifogat dokument">
          <div className="space-y-4 rounded bg-muted grid p-4">
            <h2 className="text-muted-foreground mb-4">Bifogat dokument</h2>
            <a
              href={documentUrl}
              target="_blank"
              rel="noopener noreferrer"
              download={news.document?.originalFilename}
              className="flex items-center gap-3 group hover:bg-background/80 rounded p-2 -m-2 transition-colors"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-muted-foreground/10 text-muted-foreground group-hover:text-foreground">
                <FileDown className="h-5 w-5" />
              </span>
              <span className="text-sm font-medium text-foreground">
                {news.document?.originalFilename ?? "Ladda ner dokument"}
              </span>
            </a>
          </div>
        </aside>
      )}

      {news.referencedPoliticians && news.referencedPoliticians.length > 0 && (
        <aside  aria-label="Omnämnda företrädare">
          <div className="space-y-4 rounded bg-muted grid p-4">
            <h2 className="text-muted-foreground mb-4">Omnämnda Företrädare</h2>
            <nav aria-label="Lista över omnämnda företrädare">
              <div className="grid gap-4">
              {news.referencedPoliticians.map((politician) => (
                <PeopleCard
                  key={politician._id}
                  image={politician.image}
                  name={politician.name}
                  slug={politician.slug?.current || ""}
                  size="small"
                  className="hover:bg-background/80 p-2 -m-2"
                />
              ))}
              </div>
            </nav>
          </div>
        </aside>
      )}

      {news.geographicalAreas && news.geographicalAreas.length > 0 && (
        <aside aria-label="Geografiska områden">
          <div className="space-y-4 rounded bg-muted grid p-4">
            <h2 className="text-muted-foreground mb-4">Geografiska Områden</h2>
            <nav aria-label="Lista över geografiska områden">
              <div className="grid gap-4">
              {news.geographicalAreas.map((area) => (
                <Link
                  key={area._id}
                  href={`/omrade/${area.slug?.current || ""}`}
                  className="flex items-center gap-3 group hover:bg-background/80 rounded p-2 -m-2 transition-colors"
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
          </div>
        </aside>
      )}

      {news.seriesNews && news.seriesNews.length > 0 && (
        <aside aria-label="Artikelserie">
          <div className="space-y-4 rounded bg-muted grid p-4">
            <h2 className="text-muted-foreground mb-4">
              {news.series?.title ? news.series.title : "Artikelserie"}
            </h2>
            <nav aria-label="Artikelserie">
              <ul className="grid gap-6">
                {news.seriesNews.map((item) => {
                  const itemSlug = item.slug?.current ?? "";
                  const isCurrent = itemSlug === currentSlug;
                  return (
                    <li key={item._id}>
                      {isCurrent ? (
                        <div
                          aria-current="page"
                          className="block rounded p-2 -m-2 bg-muted text-muted-foreground"
                        >
                          <div className="text-sm font-medium">{item.title}</div>
                          {item.effectiveDate && (
                            <time
                              dateTime={item.effectiveDate}
                              className="text-xs text-muted-foreground mt-0.5 block"
                            >
                              {formatDate(item.effectiveDate)}
                            </time>
                          )}
                        </div>
                      ) : (
                        <Link
                          href={`${ROUTE_BASE.NEWS}/${itemSlug}`}
                          className="block rounded p-2 -m-2 transition-colors text-foreground hover:text-primary hover:bg-background/80"
                        >
                          <div className="text-sm font-medium">{item.title}</div>
                          {item.effectiveDate && (
                            <time
                              dateTime={item.effectiveDate}
                              className="text-xs text-muted-foreground mt-0.5 block"
                            >
                              {formatDate(item.effectiveDate)}
                            </time>
                          )}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </aside>
      )}

    </div>
  );
}
