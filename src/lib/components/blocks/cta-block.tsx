import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface CTABlockProps {
  eyebrow?: string;
  title: string;
  description?: string;
  primaryButtonText: string;
  primaryButtonHref: string;
  secondaryButtonText?: string;
  secondaryButtonHref?: string;
  alignment?: "left" | "center";
  variant?: "default" | "bordered";
  className?: string;
}

export function CTABlock({
  eyebrow,
  title,
  description,
  primaryButtonText,
  primaryButtonHref,
  secondaryButtonText,
  secondaryButtonHref,
  alignment = "center",
  variant = "default",
  className,
}: CTABlockProps) {
  return (
    <div className={cn("w-full py-16 md:py-24", className)}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div
          className={cn(
            "mx-auto max-w-3xl rounded-xl p-12 md:p-16",
            variant === "bordered" && "border border-border bg-card shadow-sm",
            alignment === "center" && "text-center",
          )}
        >
          {eyebrow && (
            <p className="text-sm font-medium text-primary/60 mb-4 tracking-wide uppercase">
              {eyebrow}
            </p>
          )}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-balance mb-6">
            {title}
          </h2>
          {description && (
            <p className="text-lg text-muted-foreground leading-relaxed text-pretty mb-8">
              {description}
            </p>
          )}
          <div
            className={cn(
              "flex flex-col sm:flex-row gap-4",
              alignment === "center" && "justify-center",
              alignment === "left" && "justify-start",
            )}
          >
            <Button size="lg" className="group" asChild>
              <a href={primaryButtonHref}>
                {primaryButtonText}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </Button>
            {secondaryButtonText && secondaryButtonHref && (
              <Button size="lg" variant="outline" asChild>
                <a href={secondaryButtonHref}>{secondaryButtonText}</a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
