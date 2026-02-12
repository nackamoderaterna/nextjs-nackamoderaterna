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
  /** When true, card uses subdued styling (e.g. past events). */
  muted?: boolean;
  eventTypeName?: string;
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
  eventTypeName,
  className,
}: EventCardProps) {
  return (
    <Link
      href={`${ROUTE_BASE.EVENTS}/${href}`}
      className={cn(
        "block rounded border p-6 transition-colors group relative hover:bg-muted",
        muted ? "border-muted" : "border-border",
        className,
      )}
    >
      {isPublic && (
        <Badge
          className={cn(
            "absolute top-4 right-4",
            muted
              ? "text-muted-foreground bg-muted-background hover:bg-muted/90"
              : "bg-brand-primary hover:bg-blue-700 text-white",
          )}
        >
          Publikt
        </Badge>
      )}

      {/* Date */}
      <div className="mb-8">
        <span
          className={cn(
            "block text-4xl md:text-5xl font-bold transition-colors",
            muted
              ? "text-muted-foreground group-hover:text-primary"
              : "text-brand-primary",
          )}
        >
          {day}
        </span>
        <span
          className={cn(
            "block text-sm font-medium uppercase tracking-wide transition-colors",
            muted
              ? "text-muted-foreground group-hover:text-primary"
              : "text-brand-primary",
          )}
        >
          {month}
        </span>
      </div>

      {/* Event Info */}
      <div>
        {eventTypeName && (
          <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
            {eventTypeName}
          </p>
        )}
        <h3
          className={cn(
            "font-semibold transition-colors mb-1",
            muted
              ? "text-muted-foreground group-hover:text-primary"
              : "group-hover:text-primary",
          )}
        >
          {title}
        </h3>
        {time && <p className="text-sm text-muted-foreground">{time}</p>}
        {location?.trim() && (
          <p className="text-sm text-muted-foreground">
            @ {location.trim()}
          </p>
        )}
      </div>
    </Link>
  );
}
