import Link from "next/link";
import type { ReactNode } from "react";
import { SanityImage } from "@/lib/components/shared/SanityImage";

interface SidebarListProps {
  children: ReactNode;
}

export function SidebarList({ children }: SidebarListProps) {
  return <ul className="grid gap-3">{children}</ul>;
}

interface SidebarListItemProps {
  title: string;
  description?: ReactNode;
  href?: string;
  external?: boolean;
  download?: string;
  icon?: ReactNode;
  image?: unknown;
  isCurrent?: boolean;
}

export function SidebarListItem({
  title,
  description,
  href,
  external,
  download,
  icon,
  image,
  isCurrent,
}: SidebarListItemProps) {
  const leading = image ? (
    <span className="relative size-10 shrink-0 overflow-hidden rounded-md bg-muted">
      <SanityImage image={image} fill className="object-cover" sizes="40px" />
    </span>
  ) : icon ? (
    <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-brand-primary/10">
      {icon}
    </span>
  ) : null;

  const content = (
    <span className={`flex items-center gap-3${leading ? "" : ""}`}>
      {leading}
      <span className="min-w-0 flex-1">
        <span className="block text-base text-foreground">{title}</span>
        {description && (
          <span className="block text-sm text-muted-foreground">
            {description}
          </span>
        )}
      </span>
    </span>
  );

  const padding = "rounded-md p-2 -m-2 transition-colors";

  if (isCurrent) {
    return (
      <li>
        <div aria-current="page" className={`${padding} text-muted-foreground`}>
          {content}
        </div>
      </li>
    );
  }

  if (href && (external || download)) {
    return (
      <li>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          download={download}
          className={`block ${padding} hover:bg-muted`}
        >
          {content}
        </a>
      </li>
    );
  }

  if (href) {
    return (
      <li>
        <Link href={href} className={`block ${padding} hover:bg-muted`}>
          {content}
        </Link>
      </li>
    );
  }

  return (
    <li>
      <div className={padding}>{content}</div>
    </li>
  );
}
