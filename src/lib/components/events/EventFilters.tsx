"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/lib/components/ui/select";
import { Toggle } from "@/lib/components/ui/toggle";
import { Button } from "@/lib/components/ui/button";
import { ROUTE_BASE } from "@/lib/routes";
import { X } from "lucide-react";

interface EventType {
  _id: string;
  name: string;
  slug: { current: string };
  color?: string;
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeType = searchParams.get("type") || "";
  const publicOnly = searchParams.get("public") === "true";
  const hasActiveFilters = !!activeType || publicOnly;

  const handleTypeChange = (value: string) => {
    const slug = value === "all" ? undefined : value;
    router.push(buildHref(slug, publicOnly || undefined));
  };

  const handlePublicToggle = (pressed: boolean) => {
    router.push(buildHref(activeType || undefined, pressed || undefined));
  };

  const clearFilters = () => {
    router.push(ROUTE_BASE.EVENTS);
  };

  return (
    <div className="mb-8 flex flex-wrap items-center gap-4">
      {eventTypes.length > 0 && (
        <Select
          value={activeType || "all"}
          onValueChange={handleTypeChange}
          aria-label="Filtrera på typ"
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Alla typer" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alla typer</SelectItem>
            {eventTypes.map((et) => (
              <SelectItem key={et._id} value={et.slug.current}>
                <span className="flex items-center gap-2">
                  <span
                    className="size-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: et.color || "#0072CE" }}
                  />
                  {et.name}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      <Toggle
        variant="outline"
        pressed={publicOnly}
        onPressedChange={handlePublicToggle}
        aria-label="Visa bara öppna evenemang"
      >
        Öppna för allmänheten
      </Toggle>

      {hasActiveFilters && (
        <Button
          variant="outline"
          size="sm"
          onClick={clearFilters}
          className="gap-2"
        >
          <X className="size-4" />
          Rensa filter
        </Button>
      )}
    </div>
  );
}
