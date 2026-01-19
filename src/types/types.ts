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

type SanityDocumentBase = {
  _id: string;
  _type: string;
};

export type WithEffectiveDate<T> = T & {
  effectiveDate: string;
};

export type Dereferenced<T extends SanityDocumentBase> = Array<
  Pick<T, "_id"> & Omit<T, "_type">
>;
