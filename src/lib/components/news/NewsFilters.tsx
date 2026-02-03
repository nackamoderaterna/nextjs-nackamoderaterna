"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/lib/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/lib/components/ui/select";
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxList,
  ComboboxItem,
} from "@/lib/components/ui/combobox";
import { getLucideIcon } from "@/lib/utils/iconUtils";
import {
  buildNewsFilterUrl,
  parseNewsFilterParams,
} from "@/lib/utils/newsFilters";
import { X } from "lucide-react";

interface PoliticalArea {
  _id: string;
  name?: string;
  title?: string;
  slug?: {
    current: string;
  };
  icon?: { name?: string | null } | null;
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

export function NewsFilters({ politicalAreas }: NewsFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { areaSlug: selectedArea, typeParam: selectedTypeRaw } =
    parseNewsFilterParams(searchParams);
  const selectedType = selectedTypeRaw ?? "all";
  const hasActiveFilters = !!selectedArea || selectedType !== "all";

  const categories = politicalAreas.filter((area) => area.slug?.current);
  const categorySlugs = categories.map((area) => area.slug!.current);
  const getCategoryName = (slug: string) =>
    categories.find((a) => a.slug?.current === slug)?.name ||
    categories.find((a) => a.slug?.current === slug)?.title ||
    slug;
  const getCategoryIconName = (slug: string) =>
    categories.find((a) => a.slug?.current === slug)?.icon?.name ?? null;

  const handleAreaChange = (value: string | null) => {
    const nextArea = value === "" || value === null ? null : value;
    if (nextArea === selectedArea) return;
    const url = buildNewsFilterUrl(
      nextArea ?? null,
      selectedType !== "all" ? selectedType : null
    );
    router.push(url);
  };

  const handleTypeChange = (value: string) => {
    if (value === selectedType) return;
    const url = buildNewsFilterUrl(
      selectedArea,
      value !== "all" ? value : null
    );
    router.push(url);
  };

  const clearFilters = () => {
    router.push(buildNewsFilterUrl());
  };

  return (
    <div className="mb-8 flex flex-wrap items-center gap-4">
      <Combobox
        items={categorySlugs}
        value={selectedArea ?? ""}
        onValueChange={handleAreaChange}
        itemToStringLabel={(slug) =>
          slug ? getCategoryName(slug) : "Alla kategorier"
        }
      >
        <ComboboxInput
          placeholder="Alla kategorier"
          className="min-w-[200px]"
          showClear={!!selectedArea}
        />
        <ComboboxContent>
          <ComboboxEmpty>Inga kategorier hittades.</ComboboxEmpty>
          <ComboboxList>
            {(item: string) => {
              const Icon = getLucideIcon(getCategoryIconName(item));
              return (
                <ComboboxItem key={item} value={item}>
                  <span className="flex items-center gap-2">
                    {Icon ? (
                      <Icon className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                    ) : null}
                    {getCategoryName(item)}
                  </span>
                </ComboboxItem>
              );
            }}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      <div className="flex items-center gap-2">
          <Select
            value={selectedType}
            onValueChange={handleTypeChange}
            aria-label="Filtrera på typ"
          >
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
