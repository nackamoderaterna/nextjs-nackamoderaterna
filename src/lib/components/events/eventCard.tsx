import Link from "next/link";
import { cn } from "@/lib/utils";
import { Badge } from "@/lib/components/ui/badge";
import { ROUTE_BASE } from "@/lib/routes";

interface EventCardProps {
  day: string;
  month: string;
  title: string;
  time: string;
  location: string;
  href: string;
  isPublic?: boolean;
  /** When true, card and badge use muted styling (e.g. past events). */
  muted?: boolean;
  className?: string;
}

export function EventCard({
  day,
  month,
  title,
  time,
  location,
  href,
  isPublic = false,
  muted = false,
  className,
}: EventCardProps) {
  return (
    <Link
      href={`${ROUTE_BASE.EVENTS}/${href}`}
      className={cn(
        "block bg-brand-primary/5 rounded-lg p-6 hover:bg-brand-primary/10 transition-colors group relative",
        className,
      )}
    >
      {isPublic && (
        <Badge
          className={cn(
            "absolute top-4 right-4 bg-muted-background",
            muted
              ? "text-muted-foreground bg-muted-background hover:bg-muted/90"
              : "bg-brand-primary hover:bg-blue-700 text-white"
          )}
        >
          Öppet event
        </Badge>
      )}

      {/* Date */}
      <div className="mb-8">
        <span className="block text-4xl md:text-5xl font-bold text-brand-primary">
          {day}
        </span>
        <span className="block text-sm font-medium text-brand-primary uppercase tracking-wide">
          {month}
        </span>
      </div>

      {/* Event Info */}
      <div>
        <h3 className="font-semibold text-brand-primary group-hover:text-brand-primary transition-colors mb-1">
          {title}
        </h3>
        {time ? (
          <p className="text-sm text-brand-primary">{time}</p>
        ) : null}
        {location?.trim() ? (
          <p className="text-sm text-brand-primary">@ {location.trim()}</p>
        ) : null}
      </div>
    </Link>
  );
}
