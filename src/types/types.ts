import {
  BlockHero,
  BlockImage,
  BlockText,
  BlockVideo,
} from "@/lib/sanity/sanity.types";

export type BlockAlignment = "left" | "center" | "right";

export type PageBlock = BlockHero | BlockText | BlockImage | BlockVideo;
