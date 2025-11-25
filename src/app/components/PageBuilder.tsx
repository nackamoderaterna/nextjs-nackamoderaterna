import { PageBlock } from "@/types/types";
import { TextBlock } from "./blocks/textBlock";
import { HeroBlock } from "./blocks/heroBlock";
import { ImageBlock } from "./blocks/imageBlock";
import VideoBlock from "./blocks/videoBlock";

interface PageBuilderProps {
  blocks: PageBlock[];
}
export function PageBuilder({ blocks }: PageBuilderProps) {
  return (
    <div>
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
