import { PortableText, PortableTextBlock } from "next-sanity";
import { portableTextComponents } from "../PortableTextComponents";

interface FooterContentProps {
  content: PortableTextBlock[];
}

export function FooterContent({ content }: FooterContentProps) {
  if (!content?.length) return null;

  return (
    <div className="mt-8 pt-8 border-t border-border">
      <div className="text-sm">
        <PortableText value={content} components={portableTextComponents} />
      </div>
    </div>
  );
}
