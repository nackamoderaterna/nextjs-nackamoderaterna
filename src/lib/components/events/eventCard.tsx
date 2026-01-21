import Link from "next/link";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface EventCardProps {
  day: string;
  month: string;
  title: string;
  time: string;
  location: string;
  href: string;
  isPublic?: boolean;
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
  className,
}: EventCardProps) {
  return (
    <Link
      href={`event/${href}`}
      className={cn(
        "block bg-blue-50/70 rounded-lg p-6 hover:bg-blue-100/70 transition-colors group relative",
        className,
      )}
    >
      {isPublic && (
        <Badge className="absolute top-4 right-4 bg-blue-600 hover:bg-blue-700 text-white">
          Öppet event
        </Badge>
      )}

      {/* Date */}
      <div className="mb-8">
        <span className="block text-4xl md:text-5xl font-bold text-blue-600">
          {day}
        </span>
        <span className="block text-sm font-medium text-blue-600 uppercase tracking-wide">
          {month}
        </span>
      </div>

      {/* Event Info */}
      <div>
        <h3 className="font-semibold text-foreground group-hover:text-blue-600 transition-colors mb-1">
          {title}
        </h3>
        <p className="text-sm text-blue-600">{time}</p>
        <p className="text-sm text-blue-600">@ {location}</p>
      </div>
    </Link>
  );
}
