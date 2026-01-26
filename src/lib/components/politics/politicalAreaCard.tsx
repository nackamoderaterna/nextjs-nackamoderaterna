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
      className="group flex flex-col items-center justify-center gap-2 rounded-lg bg-blue-50/50 px-6 py-4 transition-all hover:bg-blue-100/70 hover:shadow-sm"
    >
      {Icon && (
        <Icon className="h-8 w-8 text-blue-900 transition-transform group-hover:scale-110" />
      )}
      <span className="text-center text-sm font-semibold text-blue-900">
        {title}
      </span>
    </Link>
  );
}
