import { SanityImage } from "@/lib/components/shared/SanityImage";
import { NewsExpanded } from "@/lib/types/news";

const SIDEBAR_ASPECT_CLASSES: Record<string, string> = {
  portrait: "aspect-[4/5]",
  square: "aspect-square",
  landscape: "aspect-video",
  auto: "aspect-auto",
};

interface NewsArticleImageProps {
  news: NewsExpanded;
}

/**
 * Unified hero image for news articles. Renders once - on mobile it appears
 * first (order-1), on desktop in the sidebar (order-2). Single network request.
 */
export function NewsArticleImage({ news }: NewsArticleImageProps) {
  const mainImage = news.mainImage as { aspectRatio?: string; alt?: string } | undefined;
  if (!mainImage) return null;

  const aspectRatio =
    mainImage?.aspectRatio && mainImage.aspectRatio in SIDEBAR_ASPECT_CLASSES
      ? mainImage.aspectRatio
      : "portrait";
  const aspectClass = SIDEBAR_ASPECT_CLASSES[aspectRatio];
  const useAuto = aspectRatio === "auto";
  const alt = mainImage.alt || news.title || "";

  return (
    <div
      className={`relative w-full overflow-hidden rounded-lg bg-muted ${aspectClass} max-w-sm mx-auto lg:mx-0 lg:max-w-none`}
    >
      {useAuto ? (
        <SanityImage
          image={mainImage}
          fill={false}
          width={800}
          height={600}
          priority
          className="w-full h-full object-cover"
          alt={alt}
          sizes="(max-width: 1023px) 100vw, (min-width: 1024px) 400px, 384px"
        />
      ) : (
        <SanityImage
          image={mainImage}
          fill
          priority
          className="object-cover"
          alt={alt}
          sizes="(max-width: 1023px) 100vw, (min-width: 1024px) 400px, 384px"
        />
      )}
    </div>
  );
}
