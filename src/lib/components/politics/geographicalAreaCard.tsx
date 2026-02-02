import Link from "next/link";
import {
  Item,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "@/lib/components/ui/item";
import { SanityImage } from "../shared/SanityImage";
import { ROUTE_BASE } from "@/lib/routes";

interface GeographicalAreaCardProps {
  title: string;
  image: any;
  slug: string;
  className?: string;
}

export function GeographicalAreaCard({
  title,
  image,
  slug,
  className,
}: GeographicalAreaCardProps) {
  return (
    <Item
      asChild
      variant="outline"
      className={`h-full rounded-lg hover:border-brand-primary/50 ${className || ""}`}
    >
      <Link href={`${ROUTE_BASE.POLITICS_AREA}/${slug}`} className="flex items-center gap-4">
        <ItemMedia variant="image" className="relative aspect-square size-16 shrink-0 overflow-hidden">
          {image ? (
            <SanityImage
              image={image}
              fill
              className="object-cover"
            />
          ) : (
            <div className="size-full bg-muted" />
          )}
        </ItemMedia>
        <ItemContent>
          <ItemTitle className="text-foreground group-hover/item:text-brand-primary">
            {title}
          </ItemTitle>
        </ItemContent>
      </Link>
    </Item>
  );
}
