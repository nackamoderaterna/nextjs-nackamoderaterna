import { cn } from "@/lib/utils";
import { Button } from "@/lib/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Block from "./Block";
import { getBlockHeading } from "./BlockHeading";

interface CTABlockProps {
  _type: "block.cta";
  layout?: "fullWidth" | "contained";
  heading?: { title?: string | null; subtitle?: string | null } | string;
  title?: string;
  subtitle?: string;
  description?: string;
  primaryAction?: { label: string; href: string };
  secondaryAction?: { label: string; href: string };
  alignment?: "left" | "center" | "right";
  // Legacy fields (backward compatibility)
  primaryButton?: { label: string; link: string };
  secondaryButton?: { label: string; link: string };
}

export function CTABlock({ block }: { block: CTABlockProps }) {
  const { title, subtitle } = getBlockHeading(block);
  const primaryAction =
    block.primaryAction ??
    (block.primaryButton
      ? { label: block.primaryButton.label, href: block.primaryButton.link }
      : undefined);
  const secondaryAction =
    block.secondaryAction ??
    (block.secondaryButton
      ? block.secondaryButton.label && block.secondaryButton.link
        ? { label: block.secondaryButton.label, href: block.secondaryButton.link }
        : undefined
      : undefined);
  const layout = block.layout ?? "fullWidth";
  const alignment = block.alignment ?? "center";

  if (!primaryAction?.label || !primaryAction?.href) {
    return null;
  }

  const maxWidth = layout === "fullWidth" ? "7xl" : "3xl";

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
    <Block paddingY="xlarge" maxWidth={maxWidth} className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8" containerClassName={`rounded-xl p-12 md:p-16 border border-border bg-card shadow-sm`}>
      <div className="mx-auto max-w-3xl">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-balance mb-6">
          {title ?? ""}
        </h2>
        {subtitle && (
          <p className="text-lg text-muted-foreground leading-relaxed text-pretty mb-8">
            {subtitle}
          </p>
        )}
        <div
          className={cn(
            "flex flex-col sm:flex-row gap-4",
            flexAlignmentClasses[alignment]
          )}
        >
          <Button size="lg" className="group" asChild>
            <Link href={primaryAction.href}>
              {primaryAction.label}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
          {secondaryAction?.label && secondaryAction?.href && (
            <Button size="lg" variant="outline" asChild>
              <Link href={secondaryAction.href}>{secondaryAction.label}</Link>
            </Button>
          )}
        </div>
        </div>
    </Block>
  );
}
