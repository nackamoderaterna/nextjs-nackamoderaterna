"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/lib/components/ui/tabs";
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
    <div className="mb-8">
      <Tabs value={value} onValueChange={handleChange}>
        <TabsList variant="line" className="h-auto p-0 bg-transparent">
          {EVENT_VIEW_OPTIONS.map((opt) => (
            <TabsTrigger
              key={opt.value}
              value={opt.value}
            >
              {opt.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}
