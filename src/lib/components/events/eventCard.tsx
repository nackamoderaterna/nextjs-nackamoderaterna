import Link from "next/link";
import { cn } from "@/lib/utils";
import { Badge } from "@/lib/components/ui/badge";
import { Button } from "@/lib/components/ui/button";
import { ROUTE_BASE } from "@/lib/routes";
import { MapPin, UserPlus } from "lucide-react";

interface EventCardProps {
  day: string;
  month?: string;
  title: string;
  time: string;
  location: string;
  href: string;
  isPublic?: boolean;
  /** When true, card uses subdued styling (e.g. past events). */
  muted?: boolean;
  eventTypeName?: string;
  eventTypeColor?: string;
  description?: string;
  registrationUrl?: string;
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
  eventTypeColor,
  description,
  registrationUrl,
  className,
}: EventCardProps) {
  return (
    <div
      className={cn(
        "@container rounded border transition-colors group relative hover:bg-muted flex flex-col",
        muted ? "border-muted" : "border-border",
        className,
      )}
    >
      <div className="flex flex-col @md:flex-row @md:items-start p-6 pb-0">
        {/* Content */}
        <Link
          href={`${ROUTE_BASE.EVENTS}/${href}`}
          className="block flex-1 min-w-0"
        >
          {/* Badges */}
          {(isPublic || eventTypeName) && (
            <div className="flex items-center gap-1.5 mb-4">
              {isPublic && (
                <Badge
                  className={cn(
                    muted
                      ? "text-muted-foreground bg-muted-background"
                      : "bg-brand-primary text-white",
                  )}
                >
                  Öppen
                </Badge>
              )}
              {eventTypeName && (
                <Badge
                  variant="outline"
                  className="text-xs"
                  style={
                    eventTypeColor
                      ? {
                          borderColor: eventTypeColor,
                          backgroundColor: `${eventTypeColor}15`,
                          color: eventTypeColor,
                        }
                      : undefined
                  }
                >
                  {eventTypeName}
                </Badge>
              )}
            </div>
          )}

          {/* Date */}
          <div className="mb-4">
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
            {month && (
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
            )}
          </div>

          {/* Event Info */}
          <div>
            <h3
              className={cn(
                "font-semibold transition-colors mb-1",
                muted
                  ? "text-muted-foreground group-hover:text-brand-primary"
                  : "text-foreground",
              )}
            >
              {title}
            </h3>
            {time && <p className="text-sm text-muted-foreground">{time}</p>}
            {location?.trim() && (
              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                <MapPin className="size-3 shrink-0" />
                {location.trim()}
              </p>
            )}
          </div>
        </Link>

        {/* Registration button */}
        {registrationUrl && !muted && (
          <div className="mt-4 @md:mt-0 @md:ml-4 shrink-0">
            <Button asChild variant="outline" size="sm" className="gap-1.5">
              <a href={registrationUrl} target="_blank" rel="noopener noreferrer">
                <UserPlus className="size-3.5" />
                Anmäl dig
              </a>
            </Button>
          </div>
        )}
      </div>

      {/* Description – full width */}
      {description && (
        <div className="px-6 pb-6">
          <hr className="my-3 border-border" />
          <p className="text-sm text-muted-foreground line-clamp-2">
            {description}
          </p>
        </div>
      )}
    </div>
  );
}
