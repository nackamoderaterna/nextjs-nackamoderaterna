import Link from "next/link";
import {
  Item,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "@/lib/components/ui/item";
import { SanityImage } from "../shared/SanityImage";
import { ROUTE_BASE } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { cleanInvisibleUnicode } from "@/lib/politicians";

export interface PeopleCardProps {
  slug: string;
  image?: unknown;
  name?: string | null;
  /** Role or position title (e.g. "Kommunalråd") */
  title?: string | null;
  size?: "small" | "medium" | "large";
  className?: string;
}

const sizeConfig = {
  small: {
    layout: "horizontal" as const,
    imageClass: "aspect-square size-12",
    itemSize: "sm" as const,
  },
  medium: {
    layout: "horizontal" as const,
    imageClass: "aspect-square size-16",
    itemSize: "default" as const,
  },
  large: {
    layout: "vertical" as const,
    imageClass: "!size-auto w-full aspect-square",
    itemSize: "default" as const,
  },
};

export function PeopleCard({
  slug,
  image,
  name,
  title,
  size = "medium",
  className,
}: PeopleCardProps) {
  const config = sizeConfig[size];
  const href = `${ROUTE_BASE.POLITICIANS}/${slug}`.replace(/\/+/g, "/");
  const displayName = cleanInvisibleUnicode(name?.trim() || "Namn saknas");
  const displayTitle = title?.trim()
    ? cleanInvisibleUnicode(title.trim())
    : null;

  if (config.layout === "vertical") {
    return (
      <Item
        asChild
        variant="outline"
        size={config.itemSize}
        className={cn(
          "h-full flex-col rounded-lg p-0 overflow-hidden group gap-0 hover:border-brand-primary/50 [a]:hover:bg-transparent",
          className
        )}
      >
        <Link href={href} className="flex flex-col h-full">
          <ItemMedia
            variant="image"
            className={cn(
              "w-full shrink-0 overflow-hidden rounded-t-lg",
              config.imageClass
            )}
          >
            {image ? (
              <SanityImage
                image={image}
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            ) : (
              <div className="size-full bg-muted" />
            )}
          </ItemMedia>
          <ItemContent className="p-4 flex-1 w-full">
            <ItemTitle className="text-foreground text-lg group-hover/item:text-foreground">
              {displayName}
            </ItemTitle>
            {displayTitle && (
              <p className="text-sm text-muted-foreground mt-0.5">
                {displayTitle}
              </p>
            )}
          </ItemContent>
        </Link>
      </Item>
    );
  }

  return (
    <Item
      asChild
      variant="outline"
      size={config.itemSize}
      className={cn(
        "h-full rounded-lg group hover:border-brand-primary/50 [a]:hover:bg-transparent hover:bg-muted",
        className
      )}
    >
      <Link href={href} className="flex items-center gap-4">
        <ItemMedia
          variant="image"
          className={cn(
            "relative shrink-0 overflow-hidden rounded-md",
            config.imageClass
          )}
        >
          {image ? (
            <SanityImage
              image={image}
              fill
              className="object-cover"
              sizes="96px"
            />
          ) : (
            <div className="size-full bg-muted" />
          )}
        </ItemMedia>
        <ItemContent>
          <ItemTitle className="text-foreground group-hover/item:text-foreground">
            {displayName}
          </ItemTitle>
          {displayTitle && (
            <p className="text-sm text-muted-foreground mt-0.5">
              {displayTitle}
            </p>
          )}
        </ItemContent>
      </Link>
    </Item>
  );
}
