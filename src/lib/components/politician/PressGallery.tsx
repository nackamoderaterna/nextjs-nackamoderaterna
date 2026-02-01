"use client";

import { useState } from "react";
import Image from "next/image";
import { buildImageUrl } from "@/lib/sanity/image";
import { SanityImage } from "@/lib/components/shared/SanityImage";
import { Download } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/lib/components/ui/dialog";
import type { PressbildItem } from "@/lib/politicians";

interface PressGalleryProps {
  images: PressbildItem[];
}

export function PressGallery({ images }: PressGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const validImages = images.filter(
    (img) => img && (img.asset?._ref || img.asset?._id || img.asset?.url)
  );

  if (validImages.length === 0) {
    return null;
  }

  const lightboxImage = lightboxIndex !== null ? validImages[lightboxIndex] : null;
  const lightboxImageUrl = lightboxImage
    ? buildImageUrl(lightboxImage, { width: 2400, quality: 90 })
    : null;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {validImages.map((image, index) => {
          const downloadUrl = buildImageUrl(image, { width: 2400, quality: 90 });
          return (
            <div key={image._key ?? index} className="space-y-2">
              <button
                type="button"
                onClick={() => setLightboxIndex(index)}
                className="relative w-full aspect-[4/5] rounded-lg overflow-hidden bg-muted block text-left focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                aria-label={image.caption ?? image.alt ?? "Visa bild i full storlek"}
              >
                <SanityImage
                  image={image}
                  alt={image.alt ?? ""}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              </button>
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

      <Dialog open={lightboxIndex !== null} onOpenChange={(open) => !open && setLightboxIndex(null)}>
        <DialogContent
          className="max-w-7xl w-full p-0 overflow-hidden bg-black/95 border-none"
          showCloseButton={true}
          closeButtonClassName="bg-white"
        >
          {lightboxImageUrl && lightboxImage && (
            <>
              <DialogTitle className="sr-only">
                {lightboxImage.caption ?? lightboxImage.alt ?? "Pressbild"}
              </DialogTitle> 
              <div className="relative w-full h-auto max-h-[85vh] flex items-center justify-center">
                <Image
                  src={lightboxImageUrl}
                  alt={lightboxImage.alt ?? lightboxImage.caption ?? ""}
                  width={1200}
                  height={1500}
                  className="w-auto h-auto max-h-[85vh] object-contain"
                  unoptimized
                />
              </div>
              {lightboxImage.caption && (
                <p className="p-4 text-sm text-white text-center">
                  {lightboxImage.caption}
                </p>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
