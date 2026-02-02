import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  Item,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "@/lib/components/ui/item";

interface PoliticalAreaCardProps {
  title: string;
  icon?: LucideIcon;
  href: string;
}

export function PoliticalAreaCard({
  title,
  icon: Icon,
  href,
}: PoliticalAreaCardProps) {
  return (
    <Item
      asChild
      variant="outline"
      className="h-full items-center justify-center rounded-lg hover:border-brand-primary/50 group"
    >
      <Link href={href} className="flex items-center gap-2 py-4">
        {Icon && (
          <ItemMedia variant="icon">
            <Icon className="size-5 text-foreground group-hover:text-brand-primary" />
          </ItemMedia>
        )}
        <ItemContent>
          <ItemTitle className="text-foreground group-hover:text-brand-primary">
            {title}
          </ItemTitle>
        </ItemContent>
      </Link>
    </Item>
  );
}
