import { BlockText } from "@/types/sanity.types";
import { PortableText } from "next-sanity";

export function TextBlock({ block }: { block: BlockText }) {
  return <div>{block.content && <PortableText value={block.content} />}</div>;
}
