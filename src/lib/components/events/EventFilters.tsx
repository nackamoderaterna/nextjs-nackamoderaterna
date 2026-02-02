"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/lib/components/ui/tabs";
import { ROUTE_BASE } from "@/lib/routes";

const EVENT_VIEW_OPTIONS = [
  { value: "all", label: "Alla" },
  { value: "kommande", label: "Kommande" },
  { value: "tidigare", label: "Tidigare" },
] as const;

function getHref(view: string): string {
  if (view === "all") return ROUTE_BASE.EVENTS;
  return `${ROUTE_BASE.EVENTS}?view=${view}`;
}

export function EventFilters() {
  const searchParams = useSearchParams();
  const view = searchParams.get("view") || "all";
  const value =
    view === "kommande" || view === "tidigare" ? view : "all";

  return (
    <div className="mb-8">
      <Tabs value={value}>
        <TabsList>
          {EVENT_VIEW_OPTIONS.map((opt) => (
            <TabsTrigger key={opt.value} value={opt.value} asChild>
              <Link href={getHref(opt.value)} className="no-underline bg-transparent">
                {opt.label}
              </Link>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}
