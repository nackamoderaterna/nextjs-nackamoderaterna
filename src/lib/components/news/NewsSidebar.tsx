import Link from "next/link";
import { SanityImage } from "@/lib/components/shared/SanityImage";
import { PeopleCard } from "@/lib/components/politician/PoliticianCardLarge";
import { NewsWithReferences } from "@/types/news";
import { FileDown } from "lucide-react";
import { formatDate } from "@/lib/utils/dateUtils";

interface NewsSidebarProps {
  news: NewsWithReferences;
}

export function NewsSidebar({ news }: NewsSidebarProps) {
  const documentUrl = news.document?.url;

  return (
    <div className="grid gap-4">
      {news.mainImage && (
        <div className="aspect-[4/5]">
          <SanityImage image={news.mainImage} />
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
        <aside className="mb-8" aria-label="Omnämnda företrädare">
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

      {news.relatedNews && news.relatedNews.length > 0 && (
        <aside className="mb-8" aria-label="Artikelserie">
          <div className="space-y-4 rounded bg-muted grid p-4">
            <h2 className="text-muted-foreground mb-4">Artikelserie</h2>
            <nav aria-label="Artikelserie">
              <ul className="space-y-3">
                {news.relatedNews.map((related) => (
                  <li key={related._id}>
                    <Link
                      href={`/nyheter/${related.slug?.current ?? ""}`}
                      className="block text-sm font-medium text-foreground hover:text-primary transition-colors"
                    >
                      {related.title}
                    </Link>
                    {related.effectiveDate && (
                      <time
                        dateTime={related.effectiveDate}
                        className="text-xs text-muted-foreground mt-0.5 block"
                      >
                        {formatDate(related.effectiveDate)}
                      </time>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </aside>
      )}
    </div>
  );
}
