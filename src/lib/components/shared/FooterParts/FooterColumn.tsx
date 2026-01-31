import Link from "next/link";
import { getMenuItemHref, type MenuItemWithReference } from "@/lib/queries/navigation";

interface FooterColumnProps {
  title?: string;
  items: MenuItemWithReference[];
}

const linkClassName =
  "text-sm text-muted-foreground hover:text-foreground transition-colors";

export function FooterColumn({ title, items }: FooterColumnProps) {
  if (!items?.length && !title) return null;

  return (
    <div>
      {title && (
        <h3 className="font-semibold text-foreground mb-4">{title}</h3>
      )}
      {items.length > 0 && (
        <ul className="space-y-2">
          {items.map((item, index) => (
            <li key={index}>
              <Link
                href={getMenuItemHref(item)}
                className={linkClassName}
                {...(item.linkType === "external" && {
                  target: "_blank",
                  rel: "noopener noreferrer",
                })}
              >
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
