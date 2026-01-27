import { TextBlock } from "./blocks/textBlock";
import { HeroBlock } from "./blocks/HeroBlock";
import { ImageBlock } from "./blocks/imageBlock";
import VideoBlock from "./blocks/videoBlock";
import { PageBlock } from "@/types/types";
import {
  PoliticianReferenceBlock,
} from "./blocks/PoliticianReference";
import { NewsBlock } from "./blocks/NewsBlock";
import { StatsBlock } from "./blocks/StatsBlock";
import { TextMediaBlock } from "./blocks/TextMediaBlock";
import { AccordionBlock } from "./blocks/AccordionBlock";
import { QuoteBlock } from "./blocks/QuoteBlock";
import { ImageGalleryBlock } from "./blocks/ImageGalleryBlock";
import { CTABlock } from "./blocks/cta-block";
import { ContactBlock } from "./blocks/ContactBlock";

interface PageBuilderProps {
  blocks: PageBlock[];
}
export function PageBuilder({ blocks }: PageBuilderProps) {
  if (!blocks || blocks.length === 0) {
    return null;
  }

  return (
    <div className="w-full mx-auto">
      {blocks.map((block, index) => {
        const key = (block as any)._id || `${block._type}-${index}`;
        const blockType = block._type;
        
        switch (blockType) {
          case "block.text":
            return <TextBlock key={key} block={block as any} />;
          case "block.hero":
            return <HeroBlock key={key} block={block as any} />;
          case "block.image":
            return <ImageBlock key={key} block={block as any} />;
          case "block.video":
            return <VideoBlock key={key} block={block as any} />;
          case "block.politician":
            return <PoliticianReferenceBlock key={key} block={block as any} />;
          case "block.news":
            return <NewsBlock key={key} block={block as any} />;
          case "block.cta":
            return <CTABlock key={key} block={block as any} />;
          case "block.stats":
            return <StatsBlock key={key} block={block as any} />;
          case "block.twoColumn":
            return <TextMediaBlock key={key} block={block as any} />;
          case "block.accordion":
            return <AccordionBlock key={key} block={block as any} />;
          case "block.quote":
            return <QuoteBlock key={key} block={block as any} />;
          case "block.imageGallery":
            return <ImageGalleryBlock key={key} block={block as any} />;
          case "block.contact":
            return <ContactBlock key={key} block={block as any} />;
          default:
            return null;
        }
      })}
    </div>
  );
}
