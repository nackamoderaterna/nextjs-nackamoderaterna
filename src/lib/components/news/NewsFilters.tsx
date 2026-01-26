"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";

interface PoliticalArea {
  _id: string;
  name?: string;
  title?: string;
  slug?: {
    current: string;
  };
}

interface NewsFiltersProps {
  politicalAreas: PoliticalArea[];
}

const NEWS_TYPE_OPTIONS = [
  { value: "all", label: "Alla typer" },
  { value: "default", label: "Nyheter" },
  { value: "debate", label: "Debattartikel" },
  { value: "pressrelease", label: "Pressmeddelande" },
] as const;

function updateParams(
  current: URLSearchParams,
  updates: { area?: string; type?: string }
) {
  const params = new URLSearchParams(current.toString());
  params.delete("page");
  if (updates.area !== undefined) {
    if (updates.area === "all") params.delete("area");
    else params.set("area", updates.area);
  }
  if (updates.type !== undefined) {
    if (updates.type === "all") params.delete("type");
    else params.set("type", updates.type);
  }
  return params;
}

export function NewsFilters({ politicalAreas }: NewsFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedArea = searchParams.get("area");
  const selectedType = searchParams.get("type") || "all";
  const hasActiveFilters = !!selectedArea || selectedType !== "all";

  const handleAreaChange = (value: string) => {
    const params = updateParams(searchParams, { area: value });
    router.push(`/nyheter?${params.toString()}`);
  };

  const handleTypeChange = (value: string) => {
    const params = updateParams(searchParams, { type: value });
    router.push(`/nyheter?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push("/nyheter");
  };

  return (
    <div className="flex flex-wrap items-center gap-4 mb-8">
      <div className="flex items-center gap-2">
        <label htmlFor="area-filter" className="text-sm font-medium">
          Filtrera på område:
        </label>
        <Select value={selectedArea || "all"} onValueChange={handleAreaChange}>
          <SelectTrigger id="area-filter" className="w-[200px]">
            <SelectValue placeholder="Alla områden" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alla områden</SelectItem>
            {politicalAreas.map((area) => (
              <SelectItem key={area._id} value={area._id}>
                {area.name || area.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-2">
        <label htmlFor="type-filter" className="text-sm font-medium">
          Typ:
        </label>
        <Select value={selectedType} onValueChange={handleTypeChange}>
          <SelectTrigger id="type-filter" className="w-[200px]">
            <SelectValue placeholder="Alla typer" />
          </SelectTrigger>
          <SelectContent>
            {NEWS_TYPE_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {hasActiveFilters && (
        <Button
          variant="outline"
          size="sm"
          onClick={clearFilters}
          className="gap-2"
        >
          <X className="w-4 h-4" />
          Rensa filter
        </Button>
      )}
    </div>
  );
}
