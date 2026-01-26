import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Block from "./Block";

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
  const { heading, description, primaryButton, secondaryButton, alignment = "center" } = block;

  if (!primaryButton?.label || !primaryButton?.link) {
    return null;
  }

  const alignmentClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  const flexAlignmentClasses = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end",
  };

  return (
    <Block>
      <div className="w-full py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div
            className={cn(
              "mx-auto max-w-3xl rounded-xl p-12 md:p-16 border border-border bg-card shadow-sm",
              alignmentClasses[alignment]
            )}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-balance mb-6">
              {heading}
            </h2>
            {description && (
              <p className="text-lg text-muted-foreground leading-relaxed text-pretty mb-8">
                {description}
              </p>
            )}
            <div
              className={cn(
                "flex flex-col sm:flex-row gap-4",
                flexAlignmentClasses[alignment]
              )}
            >
              <Button size="lg" className="group" asChild>
                <Link href={primaryButton.link}>
                  {primaryButton.label}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              {secondaryButton?.label && secondaryButton?.link && (
                <Button size="lg" variant="outline" asChild>
                  <Link href={secondaryButton.link}>{secondaryButton.label}</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Block>
  );
}
