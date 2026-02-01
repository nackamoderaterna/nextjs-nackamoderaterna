"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/lib/components/ui/select";
import { ROUTE_BASE } from "@/lib/routes";

const EVENT_VIEW_OPTIONS = [
  { value: "all", label: "Alla evenemang" },
  { value: "kommande", label: "Kommande" },
  { value: "tidigare", label: "Tidigare" },
] as const;

function updateParams(current: URLSearchParams, view: string) {
  const params = new URLSearchParams(current.toString());
  params.delete("page");
  if (view === "all") {
    params.delete("view");
  } else {
    params.set("view", view);
  }
  return params;
}

export function EventFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const view = searchParams.get("view") || "all";
  const value =
    view === "kommande" || view === "tidigare" ? view : "all";

  const handleChange = (newValue: string) => {
    const params = updateParams(searchParams, newValue);
    const queryString = params.toString();
    router.push(queryString ? `${ROUTE_BASE.EVENTS}?${queryString}` : ROUTE_BASE.EVENTS);
  };

  return (
    <div className="flex flex-wrap items-center gap-4 mb-8">
      <div className="flex items-center gap-2">
        <label htmlFor="event-view-filter" className="text-sm font-medium">
          Visa:
        </label>
        <Select value={value} onValueChange={handleChange}>
          <SelectTrigger id="event-view-filter" className="w-[200px]">
            <SelectValue placeholder="Välj vy" />
          </SelectTrigger>
          <SelectContent>
            {EVENT_VIEW_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
