import Link from "next/link";
import type { LucideIcon } from "lucide-react";

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
    <Link
      href={href}
      className="group flex flex-col items-center justify-center gap-2 rounded-lg bg-brand-primary/10 px-6 py-4 transition-all hover:bg-brand-primary/15 hover:shadow-sm"
    >
      {Icon && (
        <Icon className="h-8 w-8 text-brand-primary transition-transform group-hover:scale-110" />
      )}
      <span className="text-center text-sm font-semibold text-brand-primary">
        {title}
      </span>
    </Link>
  );
}
