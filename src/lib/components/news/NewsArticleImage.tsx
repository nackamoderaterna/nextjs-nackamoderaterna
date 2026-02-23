import { SanityImage } from "@/lib/components/shared/SanityImage";
import { NewsExpanded } from "@/lib/types/news";

interface NewsArticleImageProps {
  news: NewsExpanded;
}

export function NewsArticleImage({ news }: NewsArticleImageProps) {
  const mainImage = news.mainImage as {
    alt?: string;
    asset?: unknown;
    dimensions?: { width?: number; height?: number };
  } | undefined;
  if (!mainImage?.asset) return null;

  const width = mainImage.dimensions?.width || 800;
  const height = mainImage.dimensions?.height || 1000;
  const alt = mainImage.alt || news.title || "";

  return (
    <div className="w-full overflow-hidden rounded-lg">
      <SanityImage
        image={mainImage}
        fill={false}
        width={width}
        height={height}
        priority
        className="w-full h-auto"
        alt={alt}
        sizes="(max-width: 767px) 100vw, (max-width: 1023px) 288px, 384px"
      />
    </div>
  );
}
