import { VideoBlockUtils } from "@/lib/utils/videoBlock";
import Block from "./Block";
import { BlockHeading, getBlockHeading } from "./BlockHeading";
import { BlockVideo } from "~/sanity.types";
import LiteVideoEmbed from "@/lib/components/media/LiteVideoEmbed";

interface VideoBlockProps {
  block: BlockVideo;
}

export default function VideoBlock({ block }: VideoBlockProps) {
  const { video, caption } = block;
  const { title } = getBlockHeading(block as Record<string, unknown>);

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
    <Block>
      <div className="max-w-3xl mx-auto">
        <BlockHeading title={title} />
        <div className={`rounded bg-gray-100 aspect-16/9`}>{renderVideo()}</div>

        {caption && <p className="mt-2 text-sm text-center text-muted-foreground">{caption}</p>}
      </div>
    </Block>
  );
}
