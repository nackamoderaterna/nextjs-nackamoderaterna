import React from "react";
import { BlockVideo } from "@/lib/sanity/sanity.types";
import { VideoBlockUtils } from "@/lib/utils/videoBlock";
import { TEXT_COLUMN_MAX_WIDTH } from "@/lib/utils/layout";
import ContainedBlock from "../core/containedBlock";
import AlignedBlock from "../core/alignedBlock";

interface VideoBlockProps {
  block: BlockVideo;
}

export default function VideoBlock({ block }: VideoBlockProps) {
  const { video, caption, alignment = "left" } = block;

  const containerClasses = VideoBlockUtils.getContainerClasses(alignment);
  if (!video) {
    return null;
  }
  const videoInfo = VideoBlockUtils.parseVideoUrl(video);

  const renderVideo = () => {
    if (videoInfo.type === "youtube") {
      return (
        <iframe
          src={VideoBlockUtils.getYoutubeEmbedUrl(videoInfo.id)}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={caption || "YouTube video"}
        />
      );
    }

    if (videoInfo.type === "vimeo") {
      return (
        <iframe
          src={VideoBlockUtils.getVimeoEmbedUrl(videoInfo.id)}
          className="absolute inset-0 w-full h-full"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          title={caption || "Vimeo video"}
        />
      );
    }

    // Direct video URL
    return null;
  };

  return (
    <AlignedBlock alignment={alignment} reflow={false}>
      <div
        className={` relative overflow-hidden rounded-lg bg-gray-100 aspect-16/9`}
      >
        {renderVideo()}
      </div>

      {caption && <p className="mt-2 text-sm text-gray-600">{caption}</p>}
    </AlignedBlock>
  );
}
