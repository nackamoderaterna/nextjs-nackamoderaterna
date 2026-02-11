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
        "block rounded border p-6 transition-colors group relative",
        muted
          ? "border-muted hover:bg-muted-background"
          : "border-border hover:border-brand-primary hover:bg-brand-primary/10",
        className,
      )}
    >
      {isPublic && (
        <Badge
          className={cn(
            "absolute top-4 right-4 bg-muted-background",
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
        <span className="block text-4xl md:text-5xl font-bold text-brand-primary">
          {day}
        </span>
        <span className="block text-sm font-medium text-brand-primary uppercase tracking-wide">
          {month}
        </span>
      </div>

      {/* Event Info */}
      <div>
        {eventTypeName ? (
          <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
            {eventTypeName}
          </p>
        ) : null}
        <h3 className="font-semibold group-hover:text-brand-primary transition-colors mb-1">
          {title}
        </h3>
        {time ? <p className="text-sm text-muted-foreground">{time}</p> : null}
        {location?.trim() ? (
          <p className="text-sm text-muted-foreground">@ {location.trim()}</p>
        ) : null}
      </div>
    </Link>
  );
}
