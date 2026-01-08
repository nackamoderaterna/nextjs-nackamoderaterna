import Link from "next/link";
import { SanityImage } from "../shared/SanityImage";
import { Event } from "~/sanity.types";

interface Props {
  event: Event;
}

export function EventCard({ event }: Props) {
  return (
    <Link
      href={`/event/${event.slug?.current}`}
      className="group block rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition"
    >
      {event.image && (
        <div className="aspect-[16/9] overflow-hidden">
          <SanityImage
            image={event.image}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform"
          />
        </div>
      )}

      <div className="p-4 space-y-2">
        <p className="text-sm text-gray-500">
          {new Date(event.startDate || Date.now()).toLocaleDateString("sv-SE", {
            dateStyle: "long",
          })}
        </p>

        <h3 className="text-lg font-semibold">{event.title}</h3>

        {event.location?.city && (
          <p className="text-sm text-gray-600">{event.location.city}</p>
        )}
      </div>
    </Link>
  );
}
