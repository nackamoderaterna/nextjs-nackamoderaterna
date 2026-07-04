import { cn } from "@/lib/utils";
import { Button } from "@/lib/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Block from "./Block";
import { getBlockHeading } from "./BlockHeading";
import { cleanInvisibleUnicode } from "@/lib/politicians";
import { getLucideIcon } from "@/lib/utils/iconUtils";

interface ButtonAction {
  label: string;
  href: string;
  icon?: { name?: string | null } | null;
}

interface CTABlockProps {
  _type: "block.cta";
  layout?: "fullWidth" | "contained";
  heading?: { title?: string | null; subtitle?: string | null } | string;
  title?: string;
  subtitle?: string;
  description?: string;
  buttons?: ButtonAction[];
  alignment?: "left" | "center" | "right";
  // Legacy fields (backward compatibility)
  primaryAction?: ButtonAction;
  secondaryAction?: ButtonAction;
  primaryButton?: { label: string; link: string };
  secondaryButton?: { label: string; link: string };
}

function getButtons(block: CTABlockProps): ButtonAction[] {
  const validButtons = block.buttons?.filter((b) => b?.label && b?.href);
  if (validButtons?.length) {
    return validButtons;
  }

  // Legacy fallback for CTA blocks created before the "buttons" array field.
  const primaryAction =
    block.primaryAction ??
    (block.primaryButton
      ? { label: block.primaryButton.label, href: block.primaryButton.link }
      : undefined);
  const secondaryAction =
    block.secondaryAction ??
    (block.secondaryButton?.label && block.secondaryButton?.link
      ? {
          label: block.secondaryButton.label,
          href: block.secondaryButton.link,
        }
      : undefined);

  return [primaryAction, secondaryAction].filter(
    (action): action is ButtonAction => !!action?.label && !!action?.href,
  );
}

export function CTABlock({ block }: { block: CTABlockProps }) {
  const { title, subtitle } = getBlockHeading(block);
  const buttons = getButtons(block);
  const layout = block.layout ?? "fullWidth";
  const alignment =
    (cleanInvisibleUnicode(block.alignment) as "left" | "center" | "right") ??
    "center";

  if (buttons.length === 0) {
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

  const content = (
    <div
      className={cn(
        "mx-auto flex-col max-w-3xl flex",
        flexAlignmentClasses[alignment],
        alignmentClasses[alignment],
      )}
    >
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-balance mb-6">
        {title ?? ""}
      </h2>
      {subtitle && (
        <p className="text-lg text-white/80 leading-relaxed text-pretty mb-8">
          {subtitle}
        </p>
      )}
      <div
        className={cn(
          "flex flex-col sm:flex-row gap-4 flex-wrap",
          flexAlignmentClasses[alignment],
        )}
      >
        {buttons.map((action, index) => {
          const Icon = getLucideIcon(action.icon?.name);
          return (
            <Button
              key={`${action.href}-${index}`}
              size="lg"
              className="group text-foreground"
              variant="secondary"
              asChild
            >
              <Link href={action.href}>
                {Icon && <Icon className="h-4 w-4" />}
                {action.label}
                {!Icon && (
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                )}
              </Link>
            </Button>
          );
        })}
      </div>
    </div>
  );

  if (layout === "fullWidth") {
    // Full-bleed: background extends edge-to-edge, content constrained internally
    return (
      <Block paddingY="xlarge" className="bg-brand-primary text-white">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {content}
        </div>
      </Block>
    );
  }

  // Contained: card-style with rounded corners and border
  return (
    <Block paddingY="none">
      <div className="rounded-xl p-12 md:p-16 border border-border bg-brand-primary text-white shadow-sm">
        {content}
      </div>
    </Block>
  );
}
