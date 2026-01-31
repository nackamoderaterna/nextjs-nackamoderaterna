import Link from "next/link";
import type { ComponentType } from "react";

interface SidebarListItemProps {
  /** Primary text (header) */
  title: string;
  /** Optional secondary text shown below the title */
  secondaryText?: string;
  /** ISO date string for semantic <time> element when secondaryText is a date */
  secondaryDateTime?: string;
  /** Optional icon component (e.g. from lucide-react or @tabler/icons-react) - receives className for sizing */
  icon?: ComponentType<{ className?: string }>;
  /** When provided, renders as a link; otherwise renders as static content */
  href?: string;
  /** When true, uses active/current styling (e.g. for "you are here" state) */
  isCurrent?: boolean;
}

export function SidebarNewsItem({
  title,
  secondaryText,
  secondaryDateTime,
  icon: Icon,
  href,
  isCurrent = false,
}: SidebarListItemProps) {
  const textContent = (
    <>
      <div className="text-sm font-medium">
        {isCurrent && <span className="mr-2 text-muted-foreground">&gt;</span>}
        {title}
      </div>
      {secondaryText && (
        secondaryDateTime ? (
          <time
            dateTime={secondaryDateTime}
            className="text-xs text-muted-foreground mt-0.5 block"
          >
            {secondaryText}
          </time>
        ) : (
          <span className="text-xs text-muted-foreground mt-0.5 block">
            {secondaryText}
          </span>
        )
      )}
    </>
  );

  const content = Icon ? (
    <div className="flex items-start gap-3">
      <Icon className="h-4 w-4 shrink-0 text-muted-foreground mt-0.5" />
      <div className="flex-1 min-w-0">{textContent}</div>
    </div>
  ) : (
    textContent
  );

  const baseClasses = "block rounded p-2 -m-2";

  if (isCurrent) {
    return (
      <div
        aria-current="page"
        className={`${baseClasses}   text-muted-foreground`}
      >
        {content}
      </div>
    );
  }

  if (href) {
    return (
      <Link
        href={href}
        className={`${baseClasses} transition-colors text-foreground hover:text-primary hover:bg-muted`}
      >
        {content}
      </Link>
    );
  }

  return (
    <div className={`${baseClasses} text-foreground`}>
      {content}
    </div>
  );
}
