import Link from "next/link";
import { Mail, Phone } from "lucide-react";
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
import { formatPhoneNumber } from "@/lib/utils/phoneUtils";
import { Button } from "../ui/button";

export interface PeopleCardProps {
  slug: string;
  image?: unknown;
  name?: string | null;
  /** Role or position title (e.g. "Kommunalråd") */
  title?: string | null;
  size?: "small" | "medium" | "large";
  email?: string | null;
  phone?: string | null;
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
  email,
  phone,
  className,
}: PeopleCardProps) {
  const config = sizeConfig[size];
  const href = `${ROUTE_BASE.POLITICIANS}/${slug}`.replace(/\/+/g, "/");
  const displayName = cleanInvisibleUnicode(name?.trim() || "Namn saknas");
  const displayTitle = title?.trim()
    ? cleanInvisibleUnicode(title.trim())
    : null;
  const hasContact = !!(email || phone);

  if (config.layout === "vertical") {
    return (
      <Item
        variant="outline"
        size={config.itemSize}
        className={cn(
          "h-full flex-col items-start rounded-lg overflow-hidden group gap-0",
          className,
        )}
      >
        <Link
          href={href}
          className="flex flex-col flex-1 hover:opacity-90 transition-opacity w-full"
        >
          <ItemMedia
            variant="image"
            className="relative w-full shrink-0 overflow-hidden rounded-t-lg aspect-square min-h-68 max-h-72"
          >
            {image ? (
              <SanityImage
                image={image}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            ) : (
              <div className="size-full bg-muted" />
            )}
          </ItemMedia>
          <ItemContent className="py-4 flex-1 w-full">
            <ItemTitle className="text-foreground text-lg">
              {displayName}
            </ItemTitle>
            {displayTitle && (
              <p className="text-muted-foreground mt-0.5">{displayTitle}</p>
            )}
          </ItemContent>
        </Link>
        {hasContact && (
          <div className="flex items-start w-full gap-2">
            {email && (
              <Button variant="outline" asChild>
                <Link href={`mailto:${email}`}>
                  <Mail className="size-3.5" />
                  E-post
                </Link>
              </Button>
            )}
            {phone && (
              <Button variant="outline" asChild>
                <Link href={`tel:${phone.replace(/\D/g, "")}`}>
                  <Phone className="size-3.5" />
                  {formatPhoneNumber(phone)}
                </Link>
              </Button>
            )}
          </div>
        )}
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
        className,
      )}
    >
      <Link href={href} className="flex items-center gap-4">
        <ItemMedia
          variant="image"
          className={cn(
            "relative shrink-0 overflow-hidden rounded-md",
            config.imageClass,
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
