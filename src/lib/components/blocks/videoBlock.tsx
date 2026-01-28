import React from "react";
import { VideoBlockUtils } from "@/lib/utils/videoBlock";
import Block from "./Block";
import { BlockVideo } from "~/sanity.types";
import LiteVideoEmbed from "@/lib/components/media/LiteVideoEmbed";

interface VideoBlockProps {
  block: BlockVideo;
}

export default function VideoBlock({ block }: VideoBlockProps) {
  const { video, caption } = block;
  const heading = (block as any).heading;

  if (!video) {
    return null;
  }
  const videoInfo = VideoBlockUtils.parseVideoUrl(video);

  const renderVideo = () => {
    if (videoInfo.type === "youtube") {
      return (
        <LiteVideoEmbed type="youtube" id={videoInfo.id} title={caption || "YouTube video"} />
      );
    }

    if (videoInfo.type === "vimeo") {
      return (
        <LiteVideoEmbed type="vimeo" id={videoInfo.id} title={caption || "Vimeo video"} />
      );
    }

    return null;
  };

  return (
    <Block maxWidth="3xl">
        {heading && (
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            {heading}
          </h2>
        )}
        <div className={`rounded bg-gray-100 aspect-16/9`}>{renderVideo()}</div>

        {caption && <p className="mt-2 text-sm text-gray-600">{caption}</p>}
    </Block>
  );
}
