import { NewsBlock, NewsBlockProps } from "@/lib/components/blocks/NewsBlock";
import { BlockPoliticianDereferenced } from "@/lib/components/blocks/PoliticianReference";
import {
  BlockHero,
  BlockImage,
  BlockPolitician,
  BlockText,
  BlockVideo,
} from "~/sanity.types";

export type BlockAlignment = "left" | "center" | "right";

export type PageBlock =
  | BlockHero
  | BlockText
  | BlockImage
  | BlockVideo
  | BlockPoliticianDereferenced
  | NewsBlockProps;
