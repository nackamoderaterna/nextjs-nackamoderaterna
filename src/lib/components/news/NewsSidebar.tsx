import { SanityImage } from "@/lib/components/shared/SanityImage";
import { PeopleCard } from "@/lib/components/politician/PoliticianCardLarge";
import { NewsWithReferences } from "@/types/news";

interface NewsSidebarProps {
  news: NewsWithReferences;
}

export function NewsSidebar({ news }: NewsSidebarProps) {
  return (
    <div className="grid gap-4">
      {news.mainImage && (
        <div className="aspect-[4/5]">
          <SanityImage image={news.mainImage} />
        </div>
      )}
      
      {news.referencedPoliticians && news.referencedPoliticians.length > 0 && (
        <aside className="mb-8" aria-label="Omnämnda företrädare">
          <div className="space-y-4 rounded bg-muted grid p-4">
            <h2 className="text-muted-foreground mb-4">Omnämnda Företrädare</h2>
            <nav aria-label="Lista över omnämnda företrädare">
              {news.referencedPoliticians.map((politician) => (
                <PeopleCard
                  key={politician._id}
                  image={politician.image}
                  name={politician.name}
                  slug={politician.slug?.current || ""}
                  size="small"
                />
              ))}
            </nav>
          </div>
        </aside>
      )}
      
      {news.relatedNews && news.relatedNews.length > 0 && (
        <aside className="mb-8" aria-label="Relaterade nyheter">
          <div className="space-y-4 rounded bg-muted grid p-4">
            <h2 className="text-muted-foreground mb-4">Relaterade Nyheter</h2>
            <nav aria-label="Lista över relaterade nyheter">
              {news.relatedNews.map((relatedNews) => (
                <PeopleCard
                  key={relatedNews._id}
                  image={relatedNews.mainImage}
                  name={relatedNews.title}
                  slug={relatedNews.slug?.current || ""}
                  size="small"
                />
              ))}
            </nav>
          </div>
        </aside>
      )}
    </div>
  );
}
