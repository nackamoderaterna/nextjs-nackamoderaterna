"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ROUTE_BASE } from "@/lib/routes";
import { cn } from "@/lib/utils";

interface EventType {
  _id: string;
  name: string;
  slug: { current: string };
}

interface EventFiltersProps {
  eventTypes?: EventType[];
}

function buildHref(typeSlug?: string, publicOnly?: boolean): string {
  const params = new URLSearchParams();
  if (typeSlug) params.set("type", typeSlug);
  if (publicOnly) params.set("public", "true");
  const qs = params.toString();
  return qs ? `${ROUTE_BASE.EVENTS}?${qs}` : ROUTE_BASE.EVENTS;
}

export function EventFilters({ eventTypes = [] }: EventFiltersProps) {
  const searchParams = useSearchParams();
  const activeType = searchParams.get("type") || "";
  const publicOnly = searchParams.get("public") === "true";

  return (
    <div className="mb-8">
      <div className="flex flex-wrap items-center gap-2">
        <Link
          href={buildHref(activeType || undefined, publicOnly ? undefined : true)}
          className={cn(
            "inline-flex items-center rounded-full px-3 py-1 text-sm font-medium transition-colors no-underline",
            publicOnly
              ? "bg-brand-primary text-white"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          )}
        >
          Publika
        </Link>

        {eventTypes.length > 0 && (
          <>
            <span className="mx-1 h-5 w-px bg-border" aria-hidden />
            <Link
              href={buildHref(undefined, publicOnly || undefined)}
              className={cn(
                "inline-flex items-center rounded-full px-3 py-1 text-sm font-medium transition-colors no-underline",
                !activeType
                  ? "bg-brand-primary text-white"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              Alla typer
            </Link>
            {eventTypes.map((et) => (
              <Link
                key={et._id}
                href={buildHref(et.slug.current, publicOnly || undefined)}
                className={cn(
                  "inline-flex items-center rounded-full px-3 py-1 text-sm font-medium transition-colors no-underline",
                  activeType === et.slug.current
                    ? "bg-brand-primary text-white"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                {et.name}
              </Link>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
