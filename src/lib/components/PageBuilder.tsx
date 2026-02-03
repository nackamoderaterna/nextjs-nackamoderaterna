import { TextBlock } from "./blocks/textBlock";
import { ImageBlock } from "./blocks/imageBlock";
import VideoBlock from "./blocks/videoBlock";
import { PageBlock } from "@/lib/types/types";
import { PoliticianReferenceBlock } from "./blocks/PoliticianReference";
import { NewsBlock } from "./blocks/NewsBlock";
import { StatsBlock } from "./blocks/StatsBlock";
import { TextMediaBlock } from "./blocks/TextMediaBlock";
import { AccordionBlock } from "./blocks/AccordionBlock";
import { QuoteBlock } from "./blocks/QuoteBlock";
import { ImageGalleryBlock } from "./blocks/ImageGalleryBlock";
import { CTABlock } from "./blocks/cta-block";
import { ContactBlock } from "./blocks/ContactBlock";
import { PoliticalAreasBlock } from "./blocks/PoliticalAreasBlock";
import { GeographicalAreasBlock } from "./blocks/GeographicalAreasBlock";
import { PoliticalIssuesBlock } from "./blocks/PoliticalIssuesBlock";
import { AnimateOnScroll } from "./shared/AnimateOnScroll";

interface PageBuilderProps {
  blocks: PageBlock[];
}

function renderBlock(block: PageBlock) {
  switch (block._type) {
    case "block.text":
      return <TextBlock block={block as any} />;
    case "block.image":
      return <ImageBlock block={block as any} />;
    case "block.video":
      return <VideoBlock block={block as any} />;
    case "block.politician":
      return <PoliticianReferenceBlock block={block as any} />;
    case "block.news":
      return <NewsBlock block={block as any} />;
    case "block.cta":
      return <CTABlock block={block as any} />;
    case "block.stats":
      return <StatsBlock block={block as any} />;
    case "block.twoColumn":
      return <TextMediaBlock block={block as any} />;
    case "block.accordion":
      return <AccordionBlock block={block as any} />;
    case "block.quote":
      return <QuoteBlock block={block as any} />;
    case "block.imageGallery":
      return <ImageGalleryBlock block={block as any} />;
    case "block.contact":
      return <ContactBlock block={block as any} />;
    case "block.politicalAreas":
      return <PoliticalAreasBlock block={block as any} />;
    case "block.geographicalAreas":
      return <GeographicalAreasBlock block={block as any} />;
    case "block.politicalIssues":
      return <PoliticalIssuesBlock block={block as any} />;
    default:
      return null;
  }
}

export function PageBuilder({ blocks }: PageBuilderProps) {
  if (!blocks || blocks.length === 0) {
    return null;
  }

  return (
    <div className="w-full mx-auto">
      {blocks.map((block, index) => {
        const key = (block as any)._id || `${block._type}-${index}`;
        const content = renderBlock(block);

        if (!content) return null;

        return (
          <AnimateOnScroll key={key}>
            {content}
          </AnimateOnScroll>
        );
      })}
    </div>
  );
}
