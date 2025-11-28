import { TextBlock } from "./blocks/textBlock";
import { HeroBlock } from "./blocks/heroBlock";
import { ImageBlock } from "./blocks/imageBlock";
import VideoBlock from "./blocks/videoBlock";
import PageLoader from "next/dist/client/page-loader";
import { PageBlock } from "@/types/types";

interface PageBuilderProps {
  blocks: PageBlock[];
}
export function PageBuilder({ blocks }: PageBuilderProps) {
  return (
    <div className="w-full mx-auto">
      {blocks.map((block, index) => {
        switch (block._type) {
          case "block.text":
            return <TextBlock key={index} block={block} />;
          case "block.hero":
            return <HeroBlock key={index} block={block} />;
          case "block.image":
            return <ImageBlock key={index} block={block} />;
          case "block.video":
            return <VideoBlock key={index} block={block} />;
        }
      })}
    </div>
  );
}
