"use client";

import * as React from "react";
import Image from "next/image";
import { VideoBlockUtils } from "@/lib/utils/videoBlock";

type LiteVideoEmbedProps = {
  type: "youtube" | "vimeo";
  id: string;
  title?: string;
  className?: string;
};

export default function LiteVideoEmbed({
  type,
  id,
  title,
  className,
}: LiteVideoEmbedProps) {
  const [active, setActive] = React.useState(false);

  const iframeSrc =
    type === "youtube"
      ? VideoBlockUtils.getYoutubeEmbedUrl(id, true, false)
      : VideoBlockUtils.getVimeoEmbedUrl(id, true, false);

  return (
    <div className={`relative w-full h-full ${className ?? ""}`}>
      {active ? (
        <iframe
          src={iframeSrc}
          className="absolute inset-0 w-full h-full"
          allow={
            type === "youtube"
              ? "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              : "autoplay; fullscreen; picture-in-picture"
          }
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          title={title || (type === "youtube" ? "YouTube video" : "Vimeo video")}
        />
      ) : (
        <button
          type="button"
          onClick={() => setActive(true)}
          className="group absolute inset-0 w-full h-full overflow-hidden rounded bg-gray-100"
          aria-label={`Play ${type === "youtube" ? "YouTube" : "Vimeo"} video`}
        >
          {type === "youtube" ? (
            <Image
              src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
              priority={false}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-100" />
          )}

          <span className="absolute inset-0 grid place-items-center">
            <span className="inline-flex items-center justify-center rounded-full bg-black/70 text-white w-16 h-16 transition-transform group-hover:scale-105">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </span>
        </button>
      )}
    </div>
  );
}

