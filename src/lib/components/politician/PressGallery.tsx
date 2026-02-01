import { buildImageUrl } from "@/lib/sanity/image";
import { SanityImage } from "@/lib/components/shared/SanityImage";
import { Download } from "lucide-react";
import type { PressbildItem } from "@/lib/politicians";

interface PressGalleryProps {
  images: PressbildItem[];
}

export function PressGallery({ images }: PressGalleryProps) {
  const validImages = images.filter(
    (img) => img && (img.asset?._ref || img.asset?._id || img.asset?.url)
  );

  if (validImages.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {validImages.map((image, index) => {
        const downloadUrl = buildImageUrl(image, { width: 2400, quality: 90 });
        return (
          <div key={image._key ?? index} className="space-y-2">
            <div className="relative w-full aspect-[4/5] rounded-lg overflow-hidden bg-muted">
              <SanityImage
                image={image}
                alt={image.alt ?? ""}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
              />
            </div>
            {image.caption && (
              <p className="text-sm text-muted-foreground">{image.caption}</p>
            )}
            <a
              href={downloadUrl}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              <Download className="h-4 w-4" />
              Ladda ner
            </a>
          </div>
        );
      })}
    </div>
  );
}
