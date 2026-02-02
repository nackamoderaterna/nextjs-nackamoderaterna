import Link from "next/link";
import { ReactNode } from "react";

interface ContactInfoItemProps {
  icon: ReactNode;
  label: string;
  children: ReactNode;
  /** When set, the whole row is clickable and links to this URL */
  href?: string;
  /** Use for external links (opens in new tab) */
  external?: boolean;
  /** When false, renders as static text with no link or hover effects even if href is set */
  isLink?: boolean;
}

const baseRowClasses =
  "flex items-center gap-3 rounded-lg px-2 py-1.5 -mx-2 -my-1.5 text-muted-foreground transition-colors";

const linkRowClasses = `${baseRowClasses} hover:bg-brand-primary/10 hover:text-foreground`;

export function ContactInfoItem({
  icon,
  label,
  children,
  href,
  external,
  isLink = true,
}: ContactInfoItemProps) {
  const content = (
    <>
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-brand-primary/10 text-brand-primary [&>svg]:h-4 [&>svg]:w-4">
        {icon}
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <span className="text-sm text-foreground">{children}</span>
      </div>
    </>
  );

  const renderAsLink = href && isLink;

  if (renderAsLink) {
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={linkRowClasses}
        >
          {content}
        </a>
      );
    }
    return (
      <Link href={href} className={linkRowClasses}>
        {content}
      </Link>
    );
  }

  return <div className={baseRowClasses}>{content}</div>;
}
