import Link from "next/link";
import Block from "./Block";
import { Button } from "@/components/ui/button";

interface CTABlockProps {
  _type: "block.cta";
  heading: string;
  description?: string;
  primaryButton?: {
    label: string;
    link: string;
  };
  secondaryButton?: {
    label: string;
    link: string;
  };
  alignment?: "left" | "center" | "right";
}

export function CTABlock({ block }: { block: CTABlockProps }) {
  const alignmentClasses = {
    left: "text-left items-start",
    center: "text-center items-center",
    right: "text-right items-end",
  };

  const alignment = block.alignment || "center";
  const alignClass = alignmentClasses[alignment];

  return (
    <Block>
      <div className={`flex flex-col ${alignClass} max-w-3xl mx-auto`}>
        {block.heading && (
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {block.heading}
          </h2>
        )}
        {block.description && (
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
            {block.description}
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-4">
          {block.primaryButton && (
            <Button asChild size="lg">
              <Link href={block.primaryButton.link}>
                {block.primaryButton.label}
              </Link>
            </Button>
          )}
          {block.secondaryButton && (
            <Button asChild variant="outline" size="lg">
              <Link href={block.secondaryButton.link}>
                {block.secondaryButton.label}
              </Link>
            </Button>
          )}
        </div>
      </div>
    </Block>
  );
}
