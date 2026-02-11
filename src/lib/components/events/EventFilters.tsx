"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/lib/components/ui/tabs";
import { ROUTE_BASE } from "@/lib/routes";
import { cn } from "@/lib/utils";

const EVENT_VIEW_OPTIONS = [
  { value: "all", label: "Alla" },
  { value: "kommande", label: "Kommande" },
  { value: "tidigare", label: "Tidigare" },
] as const;

interface EventType {
  _id: string;
  name: string;
  slug: { current: string };
}

interface EventFiltersProps {
  eventTypes?: EventType[];
}

function buildHref(view: string, typeSlug?: string, publicOnly?: boolean): string {
  const params = new URLSearchParams();
  if (view !== "all") params.set("view", view);
  if (typeSlug) params.set("type", typeSlug);
  if (publicOnly) params.set("public", "true");
  const qs = params.toString();
  return qs ? `${ROUTE_BASE.EVENTS}?${qs}` : ROUTE_BASE.EVENTS;
}

export function EventFilters({ eventTypes = [] }: EventFiltersProps) {
  const searchParams = useSearchParams();
  const view = searchParams.get("view") || "all";
  const activeType = searchParams.get("type") || "";
  const publicOnly = searchParams.get("public") === "true";
  const value =
    view === "kommande" || view === "tidigare" ? view : "all";

  return (
    <div className="mb-8 space-y-4">
      <Tabs value={value}>
        <TabsList>
          {EVENT_VIEW_OPTIONS.map((opt) => (
            <TabsTrigger key={opt.value} value={opt.value} asChild>
              <Link href={buildHref(opt.value, activeType || undefined, publicOnly || undefined)} className="no-underline bg-transparent">
                {opt.label}
              </Link>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="flex flex-wrap items-center gap-2">
        {eventTypes.length > 0 && (
          <>
            <Link
              href={buildHref(value, undefined, publicOnly || undefined)}
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
                href={buildHref(value, et.slug.current, publicOnly || undefined)}
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

        <Link
          href={buildHref(value, activeType || undefined, publicOnly ? undefined : true)}
          className={cn(
            "inline-flex items-center rounded-full px-3 py-1 text-sm font-medium transition-colors no-underline",
            publicOnly
              ? "bg-brand-primary text-white"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          )}
        >
          Publika
        </Link>
      </div>
    </div>
  );
}
