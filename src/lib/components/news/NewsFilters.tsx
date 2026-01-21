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

export function NewsFilters({ politicalAreas }: NewsFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedArea = searchParams.get("area");

  const handleAreaChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete("area");
      params.delete("page"); // Reset to first page
    } else {
      params.set("area", value);
      params.delete("page"); // Reset to first page
    }
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
        <Select
          value={selectedArea || "all"}
          onValueChange={handleAreaChange}
        >
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
      {selectedArea && (
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
